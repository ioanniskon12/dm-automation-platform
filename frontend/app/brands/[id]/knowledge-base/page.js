"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSidebar } from '../../../../contexts/SidebarContext';
import Link from 'next/link';
import axios from 'axios';
import NavigationSidebar from '../../../../components/NavigationSidebar';
import ProtectedRoute from '../../../../components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function KnowledgeBase() {
  const params = useParams();
  const brandId = params.id;
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState('upload');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // URL scraping state
  const [url, setUrl] = useState('');
  const [scrapingUrl, setScrapingUrl] = useState(false);

  // Text paste state
  const [pastedText, setPastedText] = useState('');
  const [textTitle, setTextTitle] = useState('');

  // Instruction state
  const [botPurpose, setBotPurpose] = useState('');
  const [botBehavior, setBotBehavior] = useState('');
  const [botAvoid, setBotAvoid] = useState('');
  const [savingInstruction, setSavingInstruction] = useState(false);
  const [instructionsSaved, setInstructionsSaved] = useState(false);
  const [isEditingInstructions, setIsEditingInstructions] = useState(true);

  // View/Edit modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  useEffect(() => {
    fetchDocuments();
    fetchInstructions();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/knowledge?brandId=${brandId}`);
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);

    setLoading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(`${API_URL}/api/knowledge/upload?brandId=${brandId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        setUploadFile(null);
        setUploadProgress(0);
        fetchDocuments();
        updateOnboardingProgress();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlScrape = async (e) => {
    e.preventDefault();
    if (!url) return;

    setScrapingUrl(true);

    try {
      const response = await axios.post(`${API_URL}/api/knowledge/scrape?brandId=${brandId}`, { url });
      if (response.data.success) {
        setUrl('');
        fetchDocuments();
        updateOnboardingProgress();
      }
    } catch (error) {
      console.error('Error scraping URL:', error);
    } finally {
      setScrapingUrl(false);
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!pastedText || !textTitle) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/knowledge/text?brandId=${brandId}`, {
        title: textTitle,
        content: pastedText,
      });

      if (response.data.success) {
        setPastedText('');
        setTextTitle('');
        fetchDocuments();
        updateOnboardingProgress();
      }
    } catch (error) {
      console.error('Error adding text:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewDocument = (doc) => {
    setSelectedDoc(doc);
    setEditTitle(doc.title);
    setEditContent(doc.content || '');
    setEditUrl(doc.metadata?.originalUrl || '');
    setIsEditing(false);
    setViewModalOpen(true);
  };

  const editDocument = (doc) => {
    setSelectedDoc(doc);
    setEditTitle(doc.title);
    setEditContent(doc.content || '');
    setEditUrl(doc.metadata?.originalUrl || '');
    setIsEditing(true);
    setViewModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle) return;

    setLoading(true);
    try {
      // Check if this is a URL document and if the URL has changed
      const isUrlDocument = selectedDoc.type === 'url';
      const urlChanged = isUrlDocument && editUrl !== selectedDoc.metadata?.originalUrl;

      if (urlChanged) {
        // Delete the old document
        await axios.delete(`${API_URL}/api/knowledge/${selectedDoc.id}?brandId=${brandId}`);

        // Re-scrape with the new URL
        const scrapeResponse = await axios.post(`${API_URL}/api/knowledge/scrape?brandId=${brandId}`, { url: editUrl });

        if (scrapeResponse.data.success) {
          fetchDocuments();
          setViewModalOpen(false);
          setIsEditing(false);
        }
      } else {
        // Normal update for text documents
        const response = await axios.put(`${API_URL}/api/knowledge/${selectedDoc.id}?brandId=${brandId}`, {
          title: editTitle,
          content: editContent,
        });

        if (response.data.success) {
          fetchDocuments();
          setViewModalOpen(false);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Error updating document:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (doc) => {
    setDocToDelete(doc);
    setDeleteModalOpen(true);
  };

  const deleteDocument = async () => {
    if (!docToDelete) return;

    try {
      await axios.delete(`${API_URL}/api/knowledge/${docToDelete.id}?brandId=${brandId}`);
      fetchDocuments();
      updateOnboardingProgress();
      setDeleteModalOpen(false);
      setDocToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const updateOnboardingProgress = () => {
    const progress = JSON.parse(localStorage.getItem('onboardingProgress') || '{}');
    progress.knowledgeAdded = documents.length > 0;
    localStorage.setItem('onboardingProgress', JSON.stringify(progress));
  };

  const fetchInstructions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bot-instructions?brandId=${brandId}`);
      if (response.data.success && response.data.instructions) {
        const instructions = response.data.instructions;
        setBotPurpose(instructions.purpose || '');
        setBotBehavior(instructions.behavior || '');
        setBotAvoid(instructions.avoid || '');
        // If instructions exist, set to view mode
        if (instructions.purpose || instructions.behavior || instructions.avoid) {
          setIsEditingInstructions(false);
        }
      }
    } catch (error) {
      console.error('Error fetching instructions:', error);
    }
  };

  const handleSaveInstructions = async () => {
    setSavingInstruction(true);
    setInstructionsSaved(false);
    try {
      const response = await axios.post(`${API_URL}/api/bot-instructions?brandId=${brandId}`, {
        purpose: botPurpose,
        behavior: botBehavior,
        avoid: botAvoid,
      });

      if (response.data.success) {
        setInstructionsSaved(true);
        setIsEditingInstructions(false);
        // Hide success message after 3 seconds
        setTimeout(() => {
          setInstructionsSaved(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving instructions:', error);
      alert('Failed to save instructions. Please try again.');
    } finally {
      setSavingInstruction(false);
    }
  };

  const tabs = [
    { id: 'upload', name: 'Upload Files', icon: '📄' },
    { id: 'scrape', name: 'Scrape URLs', icon: '🌐' },
    { id: 'text', name: 'Paste Text', icon: '📝' },
    { id: 'instruction', name: 'Instruction', icon: '🤖' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />

      {/* Main Content - with left padding for sidebar */}
      <main className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} max-w-7xl mx-auto px-6 py-12`}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Knowledge Base</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
            Train your AI assistant with your FAQs, documentation, and knowledge. The more context you provide, the better it can respond to questions.
          </p>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
              <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">{documents.length} Documents Added</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input Methods */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 font-semibold text-xs transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.icon} {tab.name}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Upload Files Tab */}
                {activeTab === 'upload' && (
                  <form onSubmit={handleFileUpload}>
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-black dark:text-white mb-1">Upload Documents</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Upload files containing FAQs, product docs, or any reference material. Supported formats: PDF, DOC, DOCX, TXT, CSV, XLS, XLSX</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all rounded-lg">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                        onChange={(e) => setUploadFile(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-4xl mb-3">📎</div>
                        <p className="text-sm font-semibold text-black dark:text-white mb-1">
                          {uploadFile ? uploadFile.name : 'Click to upload a file'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">PDF, DOC, TXT, CSV, XLS, XLSX</p>
                      </label>
                    </div>

                    {uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-full">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">{uploadProgress}% uploaded</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!uploadFile || loading}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md"
                    >
                      {loading ? 'Uploading...' : 'Upload Document'}
                    </button>
                  </form>
                )}

                {/* Scrape URL Tab */}
                {activeTab === 'scrape' && (
                  <form onSubmit={handleUrlScrape}>
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-black dark:text-white mb-1">Scrape Website Content</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Enter a URL to extract content from web pages, FAQs, or documentation.</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/faq"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!url || scrapingUrl}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md"
                    >
                      {scrapingUrl ? 'Scraping...' : 'Scrape Content'}
                    </button>
                  </form>
                )}

                {/* Paste Text Tab */}
                {activeTab === 'text' && (
                  <form onSubmit={handleTextSubmit}>
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-black dark:text-white mb-1">Paste Text Content</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Directly paste FAQs, product information, or any text content.</p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={textTitle}
                        onChange={(e) => setTextTitle(e.target.value)}
                        placeholder="e.g., Product FAQs"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Content</label>
                      <textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        placeholder="Paste your content here..."
                        rows={10}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none resize-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!pastedText || !textTitle || loading}
                      className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md"
                    >
                      {loading ? 'Adding...' : 'Add Content'}
                    </button>
                  </form>
                )}

                {/* Instruction Tab */}
                {activeTab === 'instruction' && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-black dark:text-white mb-1">Configure Bot Instructions</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Define what your bot does, how it behaves, and what it should avoid.</p>
                      </div>
                      {!isEditingInstructions && (
                        <button
                          onClick={() => setIsEditingInstructions(true)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Edit
                        </button>
                      )}
                    </div>

                    {/* Success Message */}
                    {instructionsSaved && (
                      <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 dark:border-green-700 rounded-lg flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Instructions saved successfully!</span>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">What does the bot do?</label>
                      <textarea
                        value={botPurpose}
                        onChange={(e) => setBotPurpose(e.target.value)}
                        disabled={!isEditingInstructions}
                        placeholder="E.g., Help customers with product inquiries, process orders, provide support..."
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">How should the bot behave?</label>
                      <textarea
                        value={botBehavior}
                        onChange={(e) => setBotBehavior(e.target.value)}
                        disabled={!isEditingInstructions}
                        placeholder="E.g., Be friendly and professional, use casual language, respond quickly, always greet users..."
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">What should the bot avoid?</label>
                      <textarea
                        value={botAvoid}
                        onChange={(e) => setBotAvoid(e.target.value)}
                        disabled={!isEditingInstructions}
                        placeholder="E.g., Don't discuss competitors, avoid making promises about delivery times, don't share personal data..."
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none resize-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {isEditingInstructions && (
                      <button
                        onClick={handleSaveInstructions}
                        disabled={savingInstruction}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm hover:shadow-md"
                      >
                        {savingInstruction ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                            Saving...
                          </span>
                        ) : (
                          'Save Instructions'
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Documents List */}
          <div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
              <h3 className="text-base font-bold text-black dark:text-white mb-4">Your Documents</h3>

              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">📚</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No documents yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add your first document to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-black dark:text-white text-sm">{doc.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{doc.type}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {doc.source !== 'upload' && (
                            <button
                              onClick={() => viewDocument(doc)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                              title="View document"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          )}
                          {doc.content && doc.source !== 'upload' && (
                            <button
                              onClick={() => editDocument(doc)}
                              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                              title="Edit document"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteModal(doc)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                            title="Delete document"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Next Steps */}
            {documents.length > 0 && (
              <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 p-6 rounded-xl">
                <h4 className="font-bold text-base text-black dark:text-white mb-2">Ready to Automate!</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">Your AI has knowledge now. Launch a template to start automating.</p>
                <Link
                  href="/templates"
                  className="block w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold text-center transition-all rounded-lg shadow-sm hover:shadow-md"
                >
                  Browse Templates
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && docToDelete && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setDeleteModalOpen(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-bold text-white">Delete Document</h2>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="text-white hover:text-gray-200 text-2xl font-light"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      Are you sure you want to delete this document?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-semibold">{docToDelete.title}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      This action cannot be undone. The document will be permanently removed from your knowledge base.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteDocument}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View/Edit Document Modal */}
        {viewModalOpen && selectedDoc && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setViewModalOpen(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {isEditing ? 'Edit Document' : 'View Document'}
                </h2>
                <div className="flex items-center gap-3">
                  {!isEditing && selectedDoc.source !== 'upload' && (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setViewModalOpen(false);
                      setIsEditing(false);
                    }}
                    className="text-white hover:text-gray-200 text-2xl font-light"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none transition-all"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-black dark:text-white">{selectedDoc.title}</p>
                  )}
                </div>

                {/* Type */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{selectedDoc.type}</p>
                </div>

                {/* Content based on document type */}
                {selectedDoc.type === 'url' ? (
                  /* URL Documents */
                  <>
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Source URL</label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none transition-all"
                        />
                      ) : (
                        <p className="text-sm text-blue-600 dark:text-blue-400 break-all">{selectedDoc.metadata?.originalUrl}</p>
                      )}
                      {isEditing && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Changing the URL will re-scrape the website and update the content automatically</p>
                      )}
                    </div>

                    {/* Scraped content preview */}
                    {selectedDoc.content && (
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Scraped Content ({selectedDoc.metadata?.pagesScraped || 1} pages)
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg max-h-96 overflow-y-auto">
                          <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">{selectedDoc.content.substring(0, 5000)}{selectedDoc.content.length > 5000 ? '...' : ''}</pre>
                        </div>
                      </div>
                    )}
                  </>
                ) : selectedDoc.source === 'upload' ? (
                  /* Uploaded Files - Show editable content or preview */
                  <>
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">File Information</label>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Filename:</span>
                          <span className="text-sm font-medium text-black dark:text-white">{selectedDoc.metadata?.filename}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                          <span className="text-sm font-medium text-black dark:text-white">{selectedDoc.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
                          <span className="text-sm font-medium text-black dark:text-white">
                            {selectedDoc.metadata?.size ? `${(selectedDoc.metadata.size / 1024).toFixed(2)} KB` : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* File Preview/Download */}
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Preview</label>
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                        {selectedDoc.metadata?.mimetype === 'application/pdf' ? (
                          /* PDF Preview */
                          <div className="bg-gray-100 dark:bg-gray-900 p-8 text-center">
                            <div className="text-6xl mb-4">📄</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">PDF Document</p>
                            <a
                              href={`${API_URL}/api/knowledge/file/${selectedDoc.id}?brandId=${brandId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Open PDF
                            </a>
                          </div>
                        ) : selectedDoc.metadata?.mimetype === 'text/plain' || selectedDoc.metadata?.mimetype === 'text/csv' ? (
                          /* Text/CSV Preview - would need to fetch content */
                          <div className="bg-gray-100 dark:bg-gray-900 p-8 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              {selectedDoc.metadata?.mimetype === 'text/csv' ? 'CSV File' : 'Text File'}
                            </p>
                            <a
                              href={`${API_URL}/api/knowledge/file/${selectedDoc.id}?brandId=${brandId}`}
                              download
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download File
                            </a>
                          </div>
                        ) : selectedDoc.metadata?.mimetype?.includes('word') ? (
                          /* Word Document */
                          <div className="bg-gray-100 dark:bg-gray-900 p-8 text-center">
                            <div className="text-6xl mb-4">📘</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Word Document</p>
                            <a
                              href={`${API_URL}/api/knowledge/file/${selectedDoc.id}?brandId=${brandId}`}
                              download
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download Document
                            </a>
                          </div>
                        ) : selectedDoc.metadata?.mimetype?.includes('excel') || selectedDoc.metadata?.mimetype?.includes('spreadsheet') ? (
                          /* Excel File */
                          <div className="bg-gray-100 dark:bg-gray-900 p-8 text-center">
                            <div className="text-6xl mb-4">📊</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Excel Spreadsheet</p>
                            <a
                              href={`${API_URL}/api/knowledge/file/${selectedDoc.id}?brandId=${brandId}`}
                              download
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download Spreadsheet
                            </a>
                          </div>
                        ) : (
                          /* Generic File */
                          <div className="bg-gray-100 dark:bg-gray-900 p-8 text-center">
                            <div className="text-6xl mb-4">📎</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">File</p>
                            <a
                              href={`${API_URL}/api/knowledge/file/${selectedDoc.id}?brandId=${brandId}`}
                              download
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-all"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download File
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Text Content Documents */
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Content</label>
                    {isEditing ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={15}
                        placeholder="Enter document content..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none resize-none transition-all"
                      />
                    ) : selectedDoc.content ? (
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">{selectedDoc.content}</pre>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No content available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex items-center justify-end border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3">
                  {isEditing && (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editTitle || (selectedDoc.type === 'url' && !editUrl) || loading}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (selectedDoc.type === 'url' && editUrl !== selectedDoc.metadata?.originalUrl ? 'Re-scraping...' : 'Saving...') : 'Save Changes'}
                      </button>
                    </>
                  )}
                  {!isEditing && (
                    <button
                      onClick={() => setViewModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      </div>
    </ProtectedRoute>
  );
}
