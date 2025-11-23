// Inbox Module - Real Implementation with Database
import prisma from '../../lib/prisma.js';
import syncModule from './sync.js';
import { validateFileForChannel, validateTextForChannel } from '../../config/channel-limits.js';

export default async function (fastify: any) {
  // Register sync endpoint
  await fastify.register(syncModule);
  // Get all inbox threads
  fastify.get('/threads', async () => {
    try {
      const dbThreads = await prisma.inboxThread.findMany({
        include: {
          user: true,
          channel: true,
        },
        orderBy: {
          lastMessageAt: 'desc',
        },
      });

      // Transform database threads to frontend format
      const threads = dbThreads.map(thread => {
        const userFields = thread.user.fields as any;
        return {
          id: thread.id,
          platform: thread.channel.type,
          user: {
            name: thread.user.name || thread.user.externalId,
            username: thread.user.handle || thread.user.externalId,
            avatar: userFields?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.user.name || 'User')}&background=random`,
          },
          lastMessage: thread.lastMessage,
          timestamp: thread.lastMessageAt.toISOString(),
          unread: thread.unreadCount > 0,
        };
      });

      return {
        success: true,
        threads,
      };
    } catch (error: any) {
      fastify.log.error('Error fetching threads:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  });

  // Get messages for a specific thread
  fastify.get('/threads/:id', async (request: any) => {
    try {
      const { id } = request.params;

      const thread = await prisma.inboxThread.findUnique({
        where: { id },
        include: {
          user: true,
          channel: true,
        },
      });

      if (!thread) {
        return {
          success: false,
          error: 'Thread not found',
        };
      }

      // Get all events (messages) for this thread
      const events = await prisma.event.findMany({
        where: {
          channelId: thread.channelId,
          userId: thread.userId,
          type: {
            in: ['message_in', 'message_out'],
          },
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      // Transform events to messages with profile pictures
      const userFields = thread.user.fields as any;
      const messages = events.map((event, index) => ({
        id: index + 1,
        sender: event.type === 'message_in' ? 'user' : 'business',
        text: (event.payload as any)?.text || '[Media]',
        timestamp: event.timestamp.toISOString(),
        senderAvatar: event.type === 'message_in'
          ? (userFields?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.user.name || 'User')}&background=random`)
          : null, // Business messages don't need avatar
        senderName: event.type === 'message_in' ? thread.user.name : 'You',
        payload: event.payload, // Include full payload for media attachments
      }));
      // Check if user is typing
      const typingIndicators = (fastify as any).typingIndicators;
      const typingData = typingIndicators?.get(thread.id);
      const isTyping = typingData && (Date.now() - typingData.timestamp < 10000);

      const threadData = {
        id: thread.id,
        platform: thread.channel.type,
        user: {
          name: thread.user.name || thread.user.externalId,
          username: thread.user.handle || thread.user.externalId,
          avatar: userFields?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(thread.user.name || 'User')}&background=random`,
        },
        lastMessage: thread.lastMessage,
        timestamp: thread.lastMessageAt.toISOString(),
        unread: thread.unreadCount > 0,
        isTyping: isTyping || false,
        messages,
      };

      return {
        success: true,
        thread: threadData,
      };
    } catch (error: any) {
      fastify.log.error('Error fetching thread:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  });

  // Mark thread as read
  fastify.post('/:id/mark-read', async (request: any) => {
    try {
      const { id } = request.params;

      await prisma.inboxThread.update({
        where: { id },
        data: {
          unreadCount: 0,
        },
      });

      return {
        success: true,
        message: 'Thread marked as read',
      };
    } catch (error: any) {
      fastify.log.error('Error marking thread as read:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  });

  // Reply to a thread
  fastify.post('/:id/reply', async (request: any, reply: any) => {
    try {
      const { id } = request.params;

      const thread = await prisma.inboxThread.findUnique({
        where: { id },
        include: {
          channel: true,
          user: true,
        },
      });

      if (!thread) {
        return {
          success: false,
          error: 'Thread not found',
        };
      }

      // Get page access token
      const pageAccessToken = (thread.channel.tokens as any).pageAccessToken;

      if (!pageAccessToken) {
        return {
          success: false,
          error: 'No access token found for this channel',
        };
      }

      // Handle multipart form data (for file uploads)
      let messageText = '';
      let fileData = null;
      let fileName = '';
      let mimeType = '';

      const contentType = request.headers['content-type'] || '';

      if (contentType.includes('multipart/form-data')) {
        // Handle file upload
        const parts = request.parts();
        for await (const part of parts) {
          if (part.type === 'field' && part.fieldname === 'message') {
            messageText = (part as any).value;
          } else if (part.type === 'file' && part.fieldname === 'file') {
            // Read file into buffer
            const chunks = [];
            for await (const chunk of part.file) {
              chunks.push(chunk);
            }
            fileData = Buffer.concat(chunks);
            fileName = part.filename;
            mimeType = part.mimetype;
          }
        }
      } else {
        // Regular JSON body
        messageText = request.body?.message || '';
      }

      if (!messageText && !fileData) {
        return {
          success: false,
          error: 'Message or file is required',
        };
      }

      // Validate message based on channel limits
      const channelType = thread.channel.type;

      // Validate text if present
      if (messageText) {
        const textValidation = validateTextForChannel(channelType, messageText);
        if (!textValidation.valid) {
          return {
            success: false,
            error: textValidation.error,
          };
        }
        if (textValidation.warning) {
          fastify.log.warn(textValidation.warning);
        }
      }

      // Validate file if present
      if (fileData) {
        // Determine file type from MIME type
        let fileType: 'image' | 'video' | 'audio' | 'document';
        if (mimeType.startsWith('image/')) {
          fileType = 'image';
        } else if (mimeType.startsWith('video/')) {
          fileType = 'video';
        } else if (mimeType.startsWith('audio/')) {
          fileType = 'audio';
        } else {
          fileType = 'document';
        }

        const fileValidation = validateFileForChannel(
          channelType,
          fileType,
          fileData.length,
          fileName
        );

        if (!fileValidation.valid) {
          return {
            success: false,
            error: fileValidation.error,
          };
        }
      }

      // Send message via Facebook Messenger API
      try {
        const axios = (await import('axios')).default;
        const FormData = (await import('form-data')).default;

        let sendResponse;
        let attachmentUrl = null;

        if (fileData) {
          // Upload file to Facebook first
          const formData = new FormData();
          formData.append('recipient', JSON.stringify({ id: thread.user.externalId }));

          // Determine attachment type
          const attachmentType = mimeType.startsWith('image/') ? 'image' :
                                 mimeType.startsWith('video/') ? 'video' : 'file';

          formData.append('message', JSON.stringify({
            attachment: {
              type: attachmentType,
              payload: {
                is_reusable: true
              }
            }
          }));
          formData.append('filedata', fileData, {
            filename: fileName,
            contentType: mimeType,
          });

          sendResponse = await axios.post(
            'https://graph.facebook.com/v18.0/me/messages',
            formData,
            {
              params: {
                access_token: pageAccessToken,
              },
              headers: formData.getHeaders(),
            }
          );

          // Get attachment URL from response if available
          attachmentUrl = sendResponse.data.attachment_id;

          fastify.log.info(`✅ File sent via Facebook: ${sendResponse.data.message_id}`);

          // If there's also text, send it as a separate message
          if (messageText) {
            const textResponse = await axios.post(
              'https://graph.facebook.com/v18.0/me/messages',
              {
                recipient: { id: thread.user.externalId },
                message: { text: messageText },
                messaging_type: 'RESPONSE',
              },
              {
                params: {
                  access_token: pageAccessToken,
                },
              }
            );
            fastify.log.info(`✅ Text sent via Facebook: ${textResponse.data.message_id}`);
          }
        } else {
          // Send text-only message
          sendResponse = await axios.post(
            'https://graph.facebook.com/v18.0/me/messages',
            {
              recipient: { id: thread.user.externalId },
              message: { text: messageText },
              messaging_type: 'RESPONSE',
            },
            {
              params: {
                access_token: pageAccessToken,
              },
            }
          );

          fastify.log.info(`✅ Message sent via Facebook: ${sendResponse.data.message_id}`);
        }

        // Note: We don't save outgoing messages to database because:
        // 1. Frontend shows them optimistically (instant display)
        // 2. Prevents duplicate messages in UI
        // 3. Facebook has the record if we need to sync later

        // Update thread
        await prisma.inboxThread.update({
          where: { id },
          data: {
            lastMessage: messageText || '[Media]',
            lastMessageAt: new Date(),
            unreadCount: 0,
          },
        });

        return {
          success: true,
          message: 'Reply sent successfully',
          messageId: sendResponse.data.message_id,
        };
      } catch (sendError: any) {
        fastify.log.error('Error sending message via Facebook:', sendError.response?.data || sendError.message);
        return {
          success: false,
          error: sendError.response?.data?.error?.message || 'Failed to send message',
        };
      }
    } catch (error: any) {
      fastify.log.error('Error sending reply:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  });
}
