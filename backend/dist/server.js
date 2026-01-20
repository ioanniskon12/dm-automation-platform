// Load environment variables FIRST before any imports
import { config } from 'dotenv';
config();
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Modules (imported AFTER dotenv config)
import flowsModule from './modules/flows/index.js';
import channelsModule from './modules/channels/index.js';
import triggersModule from './modules/triggers/index.js';
import inboxModule from './modules/inbox/index.js';
import knowledgeModule from './modules/knowledge/index.js';
import botInstructionsModule from './modules/bot-instructions/index.js';
import analyticsModule from './modules/analytics/index.js';
import whatsappModule from './modules/whatsapp/index.js';
import complianceModule from './modules/compliance/index.js';
import templatesModule from './modules/templates/index.js';
import facebookModule from './modules/facebook/index.js';
import facebookSyncService from './services/facebook-sync.service.js';
import authModule from './modules/auth/index.js';
import tagsModule from './modules/tags/index.js';
import campaignsModule from './modules/campaigns/index.js';
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
// In-memory store for typing indicators
// Format: { 'threadId': { userId: 'externalId', timestamp: Date } }
const typingIndicators = new Map();
// Clean up old typing indicators every 5 seconds
setInterval(() => {
    const now = Date.now();
    for (const [threadId, data] of typingIndicators.entries()) {
        // Remove typing indicator if older than 10 seconds
        if (now - data.timestamp > 10000) {
            typingIndicators.delete(threadId);
        }
    }
}, 5000);
// Initialize Fastify
const fastify = Fastify({
    logger: true,
});
// Attach typing indicators to fastify instance for access in modules
fastify.typingIndicators = typingIndicators;
// Register plugins
const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
await fastify.register(cors, {
    origin: corsOrigins,
    credentials: true,
});
await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
});
await fastify.register(multipart, {
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
await fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../uploads'),
    prefix: '/uploads/',
});
// Health check
fastify.get('/health', async () => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };
});
// Register modules
await fastify.register(flowsModule, { prefix: '/api/flows' });
await fastify.register(channelsModule, { prefix: '/api/channels' });
await fastify.register(triggersModule, { prefix: '/api/triggers' });
await fastify.register(inboxModule, { prefix: '/api/inbox' });
await fastify.register(knowledgeModule, { prefix: '/api/knowledge' });
await fastify.register(botInstructionsModule, { prefix: '/api/bot-instructions' });
await fastify.register(analyticsModule, { prefix: '/api/analytics' });
await fastify.register(whatsappModule, { prefix: '/api/whatsapp' });
await fastify.register(complianceModule, { prefix: '/api/compliance' });
await fastify.register(templatesModule, { prefix: '/api/templates' });
await fastify.register(facebookModule, { prefix: '/api' });
await fastify.register(authModule, { prefix: '/api/auth' });
await fastify.register(tagsModule, { prefix: '/api/tags' });
await fastify.register(campaignsModule, { prefix: '/api/campaigns' });
// Webhook endpoints (public, no auth)
// Meta webhook verification (GET request for webhook setup)
fastify.get('/api/webhooks/meta', async (request, reply) => {
    const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = request.query;
    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
        fastify.log.info('Meta webhook verified successfully');
        return reply.status(200).send(challenge);
    }
    fastify.log.error('Meta webhook verification failed');
    return reply.status(403).send('Forbidden');
});
// Meta webhook handler (POST - receives messages from Instagram and Messenger)
fastify.post('/api/webhooks/meta', async (request, reply) => {
    try {
        const body = request.body;
        // Verify webhook signature
        const signature = request.headers['x-hub-signature-256'];
        // TODO: Implement signature verification using FacebookService
        fastify.log.info('Meta webhook received:', JSON.stringify(body, null, 2));
        // Process webhook events
        if (body.object === 'page' || body.object === 'instagram') {
            for (const entry of body.entry || []) {
                const pageId = entry.id;
                // Handle messaging events
                for (const event of entry.messaging || []) {
                    if (event.message) {
                        // Skip echo messages (messages sent by your page/bot)
                        if (event.message.is_echo) {
                            fastify.log.info('Skipping echo message (sent by page)');
                            continue;
                        }
                        // LOG EVERYTHING to see what Facebook sends
                        console.log('📥 FULL MESSAGE EVENT:', JSON.stringify(event.message, null, 2));
                        fastify.log.info('Message received:', {
                            sender: event.sender.id,
                            text: event.message.text,
                            timestamp: event.timestamp,
                            attachments: event.message.attachments,
                        });
                        try {
                            // Import Prisma dynamically to avoid circular dependencies
                            const { default: prisma } = await import('./lib/prisma.js');
                            console.log(`🔍 Looking for channel with pageId: ${pageId}, type: ${body.object === 'instagram' ? 'instagram' : 'messenger'}`);
                            // Find the channel for this page
                            const channel = await prisma.channel.findFirst({
                                where: {
                                    externalId: pageId,
                                    type: body.object === 'instagram' ? 'instagram' : 'messenger',
                                },
                                include: { workspace: true },
                            });
                            console.log(`📡 Channel found:`, channel ? `✅ ${channel.name}` : '❌ NO CHANNEL FOUND');
                            if (channel) {
                                // Get or create user contact
                                let userContact = await prisma.userContact.findUnique({
                                    where: {
                                        channelId_externalId: {
                                            channelId: channel.id,
                                            externalId: event.sender.id,
                                        },
                                    },
                                });
                                // Fetch user profile from Facebook if this is a new contact
                                if (!userContact) {
                                    try {
                                        // Import axios and get page access token
                                        const axios = (await import('axios')).default;
                                        const pageAccessToken = channel.tokens.pageAccessToken;
                                        // Fetch user profile from Facebook Graph API
                                        const profileResponse = await axios.get(`https://graph.facebook.com/v18.0/${event.sender.id}`, {
                                            params: {
                                                fields: 'name,profile_pic',
                                                access_token: pageAccessToken,
                                            },
                                        });
                                        const profile = profileResponse.data;
                                        userContact = await prisma.userContact.create({
                                            data: {
                                                workspaceId: channel.workspaceId,
                                                channelId: channel.id,
                                                externalId: event.sender.id,
                                                name: profile.name || event.sender.id,
                                                fields: {
                                                    profilePicture: profile.profile_pic,
                                                },
                                            },
                                        });
                                        fastify.log.info(`✅ Fetched user profile: ${profile.name}`);
                                    }
                                    catch (profileError) {
                                        fastify.log.warn(`Could not fetch user profile: ${profileError.message}`);
                                        // Create user contact without profile data
                                        userContact = await prisma.userContact.create({
                                            data: {
                                                workspaceId: channel.workspaceId,
                                                channelId: channel.id,
                                                externalId: event.sender.id,
                                                name: event.sender.id,
                                            },
                                        });
                                    }
                                }
                                // Create or update inbox thread
                                let thread = await prisma.inboxThread.findFirst({
                                    where: {
                                        channelId: channel.id,
                                        userId: userContact.id,
                                    },
                                });
                                const messageText = event.message.text || '[Media]';
                                const messageTimestamp = new Date(event.timestamp);
                                if (thread) {
                                    // Update existing thread
                                    thread = await prisma.inboxThread.update({
                                        where: { id: thread.id },
                                        data: {
                                            lastMessage: messageText,
                                            lastMessageAt: messageTimestamp,
                                            unreadCount: { increment: 1 },
                                        },
                                    });
                                }
                                else {
                                    // Create new thread
                                    thread = await prisma.inboxThread.create({
                                        data: {
                                            workspaceId: channel.workspaceId,
                                            channelId: channel.id,
                                            userId: userContact.id,
                                            lastMessage: messageText,
                                            lastMessageAt: messageTimestamp,
                                            unreadCount: 1,
                                            status: 'open',
                                        },
                                    });
                                }
                                // Create event record
                                await prisma.event.create({
                                    data: {
                                        workspaceId: channel.workspaceId,
                                        channelId: channel.id,
                                        userId: userContact.id,
                                        type: 'message_in',
                                        payload: {
                                            messageId: event.message.mid,
                                            text: event.message.text,
                                            attachments: event.message.attachments,
                                            timestamp: event.timestamp,
                                        },
                                        timestamp: messageTimestamp,
                                    },
                                });
                                fastify.log.info(`✅ Saved message to database - Thread: ${thread.id}`);
                            }
                            else {
                                fastify.log.warn(`No channel found for page ${pageId}`);
                            }
                        }
                        catch (dbError) {
                            fastify.log.error('Error saving message to database:', dbError);
                        }
                    }
                    // Handle typing indicators
                    if (event.sender && event.sender.id) {
                        try {
                            const { default: prisma } = await import('./lib/prisma.js');
                            // Find the channel for this page
                            const channel = await prisma.channel.findFirst({
                                where: {
                                    externalId: pageId,
                                    type: body.object === 'instagram' ? 'instagram' : 'messenger',
                                },
                            });
                            if (channel) {
                                // Find user contact
                                const userContact = await prisma.userContact.findUnique({
                                    where: {
                                        channelId_externalId: {
                                            channelId: channel.id,
                                            externalId: event.sender.id,
                                        },
                                    },
                                });
                                if (userContact) {
                                    // Find thread
                                    const thread = await prisma.inboxThread.findFirst({
                                        where: {
                                            channelId: channel.id,
                                            userId: userContact.id,
                                        },
                                    });
                                    if (thread) {
                                        // Check for typing indicator - Facebook sends this in sender_action field
                                        // or we can infer typing from message events with is_echo: false
                                        if (event.sender_action === 'typing_on' || (event.message && !event.message.is_echo)) {
                                            typingIndicators.set(thread.id, {
                                                userId: event.sender.id,
                                                timestamp: Date.now(),
                                            });
                                            fastify.log.info(`👤 User ${userContact.name} is typing in thread ${thread.id}`);
                                        }
                                        else if (event.sender_action === 'typing_off') {
                                            typingIndicators.delete(thread.id);
                                            fastify.log.info(`👤 User ${userContact.name} stopped typing in thread ${thread.id}`);
                                        }
                                    }
                                }
                            }
                        }
                        catch (typingError) {
                            fastify.log.warn('Error handling typing indicator:', typingError.message);
                        }
                    }
                }
                // Handle Instagram-specific events
                if (body.object === 'instagram') {
                    fastify.log.info('Instagram event:', entry);
                }
            }
        }
        return reply.status(200).send({ status: 'received' });
    }
    catch (error) {
        fastify.log.error('Error processing webhook:', error);
        return reply.status(500).send({ error: 'Internal server error' });
    }
});
fastify.post('/api/webhooks/whatsapp', async (request, reply) => {
    // WhatsApp webhook handler
    fastify.log.info('WhatsApp webhook received', request.body);
    return { status: 'received' };
});
fastify.post('/api/webhooks/telegram', async (request, reply) => {
    // Telegram webhook handler
    fastify.log.info('Telegram webhook received', request.body);
    return { status: 'received' };
});
// Global error handler
fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(error.statusCode || 500).send({
        error: error.name,
        message: error.message,
        statusCode: error.statusCode || 500,
    });
});
// Start server
async function start() {
    try {
        await fastify.listen({ port: PORT, host: HOST });
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀  DM Automation Platform API                         ║
║                                                           ║
║   Server:     http://${HOST}:${PORT}                   ║
║   Health:     http://${HOST}:${PORT}/health            ║
║   Webhooks:   http://${HOST}:${PORT}/api/webhooks      ║
║                                                           ║
║   Status:     ✅ Running                                  ║
║   Env:        ${process.env.NODE_ENV || 'development'}                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
        // Facebook sync as backup (webhooks are primary, sync catches missed messages)
        const SYNC_INTERVAL = 10 * 1000; // 10 seconds backup sync
        setInterval(() => {
            fastify.log.info('🔄 Running backup Facebook sync...');
            facebookSyncService.syncAllConversations().catch((error) => {
                fastify.log.error('Backup sync error:', error);
            });
        }, SYNC_INTERVAL);
        // Run initial sync after 10 seconds
        setTimeout(() => {
            fastify.log.info('🔄 Running initial Facebook sync...');
            facebookSyncService.syncAllConversations().catch((error) => {
                fastify.log.error('Initial sync error:', error);
            });
        }, 10000);
        fastify.log.info('✅ Webhooks enabled for instant messaging + 10s backup sync');
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
// Handle graceful shutdown
process.on('SIGTERM', async () => {
    fastify.log.info('SIGTERM signal received: closing HTTP server');
    await fastify.close();
    process.exit(0);
});
process.on('SIGINT', async () => {
    fastify.log.info('SIGINT signal received: closing HTTP server');
    await fastify.close();
    process.exit(0);
});
start();
//# sourceMappingURL=server.js.map