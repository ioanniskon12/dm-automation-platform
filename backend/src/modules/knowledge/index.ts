import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory storage for documents per brand (in production, this would use the database)
const brandDocuments = new Map<string, any[]>();

// Helper function to get or create brand documents
const getBrandDocuments = (brandId: string): any[] => {
  if (!brandDocuments.has(brandId)) {
    brandDocuments.set(brandId, []);
  }
  return brandDocuments.get(brandId)!;
};

export default async function (fastify: any) {
  // GET /api/knowledge - Fetch all documents for a brand
  fastify.get('/', async (request: any, reply: any) => {
    const { brandId } = request.query;

    if (!brandId) {
      return reply.code(400).send({
        success: false,
        error: 'brandId is required'
      });
    }

    const documents = getBrandDocuments(brandId);
    console.log(`Fetching knowledge documents for brand ${brandId}:`, documents.length);

    return {
      success: true,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        source: doc.source,
        content: doc.content,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        metadata: doc.metadata
      }))
    };
  });

  // POST /api/knowledge/upload - Upload file
  fastify.post('/upload', async (request: any, reply: any) => {
    try {
      console.log('Received file upload request');

      const data = await request.file();

      if (!data) {
        return reply.code(400).send({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Extract brandId from query
      const { brandId } = request.query;

      if (!brandId) {
        return reply.code(400).send({
          success: false,
          error: 'brandId is required'
        });
      }

      console.log('File received:', data.filename, data.mimetype);

      // Validate file type - accept multiple formats
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'text/plain', // .txt
        'text/csv', // .csv
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
      ];

      if (!allowedMimeTypes.includes(data.mimetype)) {
        return reply.code(400).send({
          success: false,
          error: 'File type not supported. Please upload PDF, DOC, DOCX, TXT, CSV, XLS, or XLSX files.'
        });
      }

      // Determine file type for display
      let fileType = 'Document';
      if (data.mimetype === 'application/pdf') fileType = 'PDF Document';
      else if (data.mimetype.includes('word')) fileType = 'Word Document';
      else if (data.mimetype === 'text/plain') fileType = 'Text File';
      else if (data.mimetype === 'text/csv') fileType = 'CSV File';
      else if (data.mimetype.includes('excel') || data.mimetype.includes('spreadsheet')) fileType = 'Excel File';

      // Generate unique filename
      const filename = `${Date.now()}-${data.filename}`;
      const uploadDir = path.join(__dirname, '../../../uploads');
      const filepath = path.join(uploadDir, filename);

      // Save file
      await pipeline(data.file, createWriteStream(filepath));
      console.log('File saved to:', filepath);

      // Create document record
      const doc = {
        id: `doc_${Date.now()}`,
        title: data.filename.replace(/\.(pdf|doc|docx|txt|csv|xls|xlsx)$/i, ''),
        type: fileType,
        source: 'upload',
        filepath: filepath,
        createdAt: new Date().toISOString(),
        metadata: {
          filename: data.filename,
          size: data.file.bytesRead,
          mimetype: data.mimetype
        }
      };

      const documents = getBrandDocuments(brandId);
      documents.push(doc);
      console.log(`Document added to knowledge base for brand ${brandId}:`, doc.id);

      return {
        success: true,
        document: {
          id: doc.id,
          title: doc.title,
          type: doc.type,
          source: doc.source,
          createdAt: doc.createdAt
        }
      };
    } catch (error: any) {
      console.error('Error uploading file:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to upload file'
      });
    }
  });

  // Helper function to extract text from HTML
  const extractTextFromHtml = (html: string): string => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Helper function to fetch and parse sitemap
  const fetchSitemap = async (baseUrl: string): Promise<string[]> => {
    const sitemapUrls = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap_index.xml`,
      `${baseUrl}/sitemap-index.xml`,
      `${baseUrl}/sitemap1.xml`
    ];

    for (const sitemapUrl of sitemapUrls) {
      try {
        console.log('Trying sitemap:', sitemapUrl);
        const response = await fetch(sitemapUrl);
        if (response.ok) {
          const xml = await response.text();
          console.log('Found sitemap at:', sitemapUrl);

          // Extract URLs from sitemap (basic XML parsing)
          const urlMatches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
          const urls = Array.from(urlMatches).map(match => match[1]);

          if (urls.length > 0) {
            console.log(`Found ${urls.length} URLs in sitemap`);
            return urls;
          }
        }
      } catch (error) {
        console.log(`Sitemap not found at ${sitemapUrl}`);
      }
    }

    return [];
  };

  // Helper function to extract URLs from HTML
  const extractUrlsFromHtml = (html: string, baseUrl: string): string[] => {
    const urls = new Set<string>();
    const urlObj = new URL(baseUrl);
    const baseDomain = urlObj.hostname;

    // Match all href attributes
    const hrefMatches = html.matchAll(/href=["']([^"']+)["']/gi);

    for (const match of hrefMatches) {
      try {
        let url = match[1];

        // Skip anchors, javascript, mailto, tel, etc.
        if (url.startsWith('#') || url.startsWith('javascript:') ||
            url.startsWith('mailto:') || url.startsWith('tel:')) {
          continue;
        }

        // Convert relative URLs to absolute
        if (url.startsWith('/')) {
          url = `${urlObj.protocol}//${urlObj.host}${url}`;
        } else if (!url.startsWith('http')) {
          url = `${baseUrl}/${url}`;
        }

        // Only include URLs from the same domain
        const linkUrl = new URL(url);
        if (linkUrl.hostname === baseDomain) {
          // Remove hash fragments
          linkUrl.hash = '';
          urls.add(linkUrl.toString());
        }
      } catch (error) {
        // Invalid URL, skip it
        continue;
      }
    }

    return Array.from(urls);
  };

  // Helper function to scrape a single URL
  const scrapeSingleUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    return extractTextFromHtml(html);
  };

  // Helper function to crawl website and discover URLs
  const crawlWebsite = async (startUrl: string, maxPages: number = 50): Promise<string[]> => {
    const urlsToCrawl: string[] = [startUrl];
    const visitedUrls = new Set<string>();
    const discoveredUrls: string[] = [];

    console.log('Starting website crawl from:', startUrl);

    while (urlsToCrawl.length > 0 && discoveredUrls.length < maxPages) {
      const currentUrl = urlsToCrawl.shift()!;

      // Skip if already visited
      if (visitedUrls.has(currentUrl)) {
        continue;
      }

      visitedUrls.add(currentUrl);
      discoveredUrls.push(currentUrl);

      try {
        console.log(`Crawling (${discoveredUrls.length}/${maxPages}):`, currentUrl);
        const response = await fetch(currentUrl);
        if (response.ok) {
          const html = await response.text();

          // Extract links from this page
          const links = extractUrlsFromHtml(html, currentUrl);

          // Add new links to crawl queue
          for (const link of links) {
            if (!visitedUrls.has(link) && !urlsToCrawl.includes(link)) {
              urlsToCrawl.push(link);
            }
          }

          console.log(`Found ${links.length} links on ${currentUrl}`);
        }
      } catch (error) {
        console.warn(`Failed to crawl ${currentUrl}:`, error);
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Crawling complete. Discovered ${discoveredUrls.length} URLs`);
    return discoveredUrls;
  };

  // POST /api/knowledge/scrape - Scrape URL
  fastify.post('/scrape', async (request: any, reply: any) => {
    try {
      const { url } = request.body;
      const { brandId } = request.query;

      if (!brandId) {
        return reply.code(400).send({
          success: false,
          error: 'brandId is required'
        });
      }

      if (!url) {
        return reply.code(400).send({
          success: false,
          error: 'URL is required'
        });
      }

      console.log('Scraping URL:', url);

      // Extract base URL
      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;

      // Try to find and fetch sitemap
      const sitemapUrls = await fetchSitemap(baseUrl);

      let urlsToScrape: string[] = [];
      let crawlMethod = '';

      if (sitemapUrls.length > 0) {
        // Limit to first 50 URLs to avoid overwhelming the system
        urlsToScrape = sitemapUrls.slice(0, 50);
        crawlMethod = 'sitemap';
        console.log(`Will scrape ${urlsToScrape.length} URLs from sitemap`);
      } else {
        // No sitemap found, crawl the website to discover URLs
        console.log('No sitemap found, crawling website to discover URLs...');
        urlsToScrape = await crawlWebsite(url, 50);
        crawlMethod = 'crawl';
        console.log(`Will scrape ${urlsToScrape.length} URLs discovered by crawling`);
      }

      // Scrape all URLs
      const scrapedCount = urlsToScrape.length;
      let combinedContent = '';

      for (const targetUrl of urlsToScrape) {
        try {
          const content = await scrapeSingleUrl(targetUrl);
          combinedContent += `\n\n=== Content from ${targetUrl} ===\n\n${content}`;
          console.log(`Scraped: ${targetUrl}`);
        } catch (error) {
          console.warn(`Failed to scrape ${targetUrl}:`, error);
        }
      }

      // Create document record
      const doc = {
        id: `doc_${Date.now()}`,
        title: `${baseUrl.replace(/^https?:\/\//, '')} (${scrapedCount} pages)`,
        type: 'url',
        source: 'scrape',
        content: combinedContent.trim(),
        createdAt: new Date().toISOString(),
        metadata: {
          baseUrl: baseUrl,
          originalUrl: url,
          scrapedAt: new Date().toISOString(),
          pagesScraped: scrapedCount,
          crawlMethod: crawlMethod,
          hasSitemap: sitemapUrls.length > 0,
          length: combinedContent.length
        }
      };

      const documents = getBrandDocuments(brandId);
      documents.push(doc);
      console.log(`Sitemap content added to knowledge base for brand ${brandId}:`, doc.id);

      return {
        success: true,
        document: {
          id: doc.id,
          title: doc.title,
          type: doc.type,
          createdAt: doc.createdAt
        },
        pagesScraped: scrapedCount
      };
    } catch (error: any) {
      console.error('Error scraping URL:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to scrape URL'
      });
    }
  });

  // POST /api/knowledge/text - Add text content
  fastify.post('/text', async (request: any, reply: any) => {
    try {
      const { title, content } = request.body;
      const { brandId } = request.query;

      if (!brandId) {
        return reply.code(400).send({
          success: false,
          error: 'brandId is required'
        });
      }

      if (!title || !content) {
        return reply.code(400).send({
          success: false,
          error: 'Title and content are required'
        });
      }

      console.log('Adding text content:', title);

      // Create document record
      const doc = {
        id: `doc_${Date.now()}`,
        title: title,
        type: 'Text Content',
        source: 'text',
        content: content,
        createdAt: new Date().toISOString(),
        metadata: {
          length: content.length,
          wordCount: content.split(/\s+/).length
        }
      };

      const documents = getBrandDocuments(brandId);
      documents.push(doc);
      console.log(`Text content added to knowledge base for brand ${brandId}:`, doc.id);

      return {
        success: true,
        document: {
          id: doc.id,
          title: doc.title,
          type: doc.type,
          createdAt: doc.createdAt
        }
      };
    } catch (error: any) {
      console.error('Error adding text:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to add text content'
      });
    }
  });

  // PUT /api/knowledge/:id - Update document
  fastify.put('/:id', async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const { title, content } = request.body;
      const { brandId } = request.query;

      if (!brandId) {
        return reply.code(400).send({
          success: false,
          error: 'brandId is required'
        });
      }

      const documents = getBrandDocuments(brandId);
      const index = documents.findIndex(doc => doc.id === id);

      if (index === -1) {
        return reply.code(404).send({
          success: false,
          error: 'Document not found'
        });
      }

      const doc = documents[index];
      console.log('Updating document:', doc.id, doc.title);

      // Update document fields
      if (title !== undefined) {
        doc.title = title;
      }

      // If it's an uploaded file with a filepath, write content to the file
      if (content !== undefined) {
        if (doc.filepath) {
          // Write content back to file
          const fs = await import('fs/promises');
          await fs.writeFile(doc.filepath, content, 'utf-8');
          console.log('File content updated:', doc.filepath);

          // Update file size in metadata
          if (doc.metadata) {
            doc.metadata.size = Buffer.byteLength(content, 'utf-8');
          }
        } else {
          // For non-file documents, update content directly
          doc.content = content;
          // Update metadata
          if (doc.metadata) {
            doc.metadata.length = content.length;
            doc.metadata.wordCount = content.split(/\s+/).length;
          }
        }
      }
      doc.updatedAt = new Date().toISOString();

      return {
        success: true,
        document: {
          id: doc.id,
          title: doc.title,
          type: doc.type,
          content: doc.content,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        }
      };
    } catch (error: any) {
      console.error('Error updating document:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to update document'
      });
    }
  });

  // GET /api/knowledge/file/:id - Download/view uploaded file
  fastify.get('/file/:id', async (request: any, reply: any) => {
    try {
      const { id } = request.params;

      const doc = documents.find(d => d.id === id);

      if (!doc) {
        return reply.code(404).send({
          success: false,
          error: 'Document not found'
        });
      }

      if (!doc.filepath) {
        return reply.code(404).send({
          success: false,
          error: 'File not found for this document'
        });
      }

      // Send the file
      return reply.sendFile(path.basename(doc.filepath), path.dirname(doc.filepath));
    } catch (error: any) {
      console.error('Error serving file:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to serve file'
      });
    }
  });

  // GET /api/knowledge/content/:id - Get file content for editing
  fastify.get('/content/:id', async (request: any, reply: any) => {
    try {
      const { id } = request.params;

      const doc = documents.find(d => d.id === id);

      if (!doc) {
        return reply.code(404).send({
          success: false,
          error: 'Document not found'
        });
      }

      if (!doc.filepath) {
        return reply.code(404).send({
          success: false,
          error: 'File not found for this document'
        });
      }

      // Read file content
      const fs = await import('fs/promises');
      const content = await fs.readFile(doc.filepath, 'utf-8');

      return {
        success: true,
        content: content,
        mimetype: doc.metadata?.mimetype
      };
    } catch (error: any) {
      console.error('Error reading file content:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to read file content'
      });
    }
  });

  // DELETE /api/knowledge/:id - Delete document
  fastify.delete('/:id', async (request: any, reply: any) => {
    try {
      const { id } = request.params;

      const index = documents.findIndex(doc => doc.id === id);

      if (index === -1) {
        return reply.code(404).send({
          success: false,
          error: 'Document not found'
        });
      }

      const doc = documents[index];
      console.log('Deleting document:', doc.id, doc.title);

      // Delete file if it exists
      if (doc.filepath) {
        try {
          await unlink(doc.filepath);
          console.log('File deleted:', doc.filepath);
        } catch (error) {
          console.warn('Could not delete file:', error);
        }
      }

      // Remove from array
      documents.splice(index, 1);

      return {
        success: true,
        message: 'Document deleted successfully'
      };
    } catch (error: any) {
      console.error('Error deleting document:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to delete document'
      });
    }
  });
}
