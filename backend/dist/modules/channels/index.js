// Channels Module
import prisma from '../../lib/prisma.js';
// In-memory storage for mock connected channels (fallback)
const connectedChannels = {};
// Mock account data for each platform
const mockAccounts = {
    instagram: { username: '@business_demo', followers: '12.5K' },
    messenger: { username: 'Demo Business Page', pageId: '1234567890' },
    whatsapp: { phoneNumber: '+1 (555) 123-4567', businessName: 'Demo Business' },
    telegram: { username: '@demo_business_bot', botToken: 'mock_token' },
};
export default async function (fastify) {
    // Get all connected channels - from database first, then fallback to mock
    fastify.get('/', async (request) => {
        const { workspaceId } = request.query;
        try {
            // Try to get channels from database
            const where = {};
            if (workspaceId) {
                where.workspaceId = workspaceId;
            }
            const dbChannels = await prisma.channel.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });
            if (dbChannels.length > 0) {
                // Format channels with parsed meta and name field
                const formattedChannels = dbChannels.map(channel => {
                    let meta = {};
                    try {
                        meta = JSON.parse(channel.meta || '{}');
                    }
                    catch (e) {
                        // Ignore JSON parse errors
                    }
                    return {
                        ...channel,
                        meta,
                        name: meta.username || meta.businessName || meta.pageName || channel.type,
                    };
                });
                return {
                    success: true,
                    channels: formattedChannels,
                };
            }
            // Fallback to in-memory mock channels (converted to array format)
            const mockChannelsList = Object.entries(connectedChannels).map(([type, data]) => ({
                id: type,
                type,
                name: data.businessName || data.username || data.pageName || type,
                status: 'connected',
                ...data,
            }));
            return {
                success: true,
                channels: mockChannelsList,
            };
        }
        catch (error) {
            fastify.log.error('Error fetching channels:', error);
            // Fallback to mock on error
            const mockChannelsList = Object.entries(connectedChannels).map(([type, data]) => ({
                id: type,
                type,
                name: data.businessName || data.username || data.pageName || type,
                status: 'connected',
                ...data,
            }));
            return {
                success: true,
                channels: mockChannelsList,
            };
        }
    });
    // Connect a channel (mock OAuth flow)
    fastify.post('/connect', async (request) => {
        const { platform, workspaceId } = request.body;
        if (!platform || !mockAccounts[platform]) {
            return {
                success: false,
                error: 'Invalid platform',
            };
        }
        const wsId = workspaceId || 'brand-1';
        // Simulate OAuth flow with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = mockAccounts[platform];
        const externalId = mockData.username || mockData.phoneNumber || mockData.pageId || `mock_${platform}`;
        try {
            // Check if channel already exists
            const existingChannel = await prisma.channel.findFirst({
                where: {
                    workspaceId: wsId,
                    type: platform,
                },
            });
            let channel;
            if (existingChannel) {
                // Update existing channel to connected
                channel = await prisma.channel.update({
                    where: { id: existingChannel.id },
                    data: {
                        status: 'connected',
                        meta: JSON.stringify(mockData),
                        updatedAt: new Date(),
                    },
                });
            }
            else {
                // Create new channel in database
                channel = await prisma.channel.create({
                    data: {
                        workspaceId: wsId,
                        type: platform,
                        externalId: externalId,
                        status: 'connected',
                        meta: JSON.stringify(mockData),
                    },
                });
            }
            // Also store in memory for backwards compatibility
            connectedChannels[platform] = {
                connected: true,
                connectedAt: new Date().toISOString(),
                ...mockData,
            };
            fastify.log.info(`Channel connected and saved to database: ${platform}`);
            return {
                success: true,
                platform,
                channel: {
                    id: channel.id,
                    type: channel.type,
                    status: channel.status,
                    name: mockData.username || mockData.businessName || mockData.pageName || platform,
                    ...mockData,
                },
                message: `Successfully connected ${platform}`,
            };
        }
        catch (error) {
            fastify.log.error(`Error saving channel to database: ${error}`);
            // Fallback to in-memory storage
            connectedChannels[platform] = {
                connected: true,
                connectedAt: new Date().toISOString(),
                ...mockData,
            };
            return {
                success: true,
                platform,
                channel: connectedChannels[platform],
                message: `Successfully connected ${platform} (in-memory only)`,
            };
        }
    });
    // Disconnect a channel
    fastify.post('/disconnect', async (request) => {
        const { platform, workspaceId } = request.body;
        const wsId = workspaceId || 'brand-1';
        // Remove from in-memory storage
        if (connectedChannels[platform]) {
            delete connectedChannels[platform];
        }
        // Update database status
        try {
            await prisma.channel.updateMany({
                where: {
                    workspaceId: wsId,
                    type: platform,
                },
                data: {
                    status: 'disconnected',
                },
            });
            fastify.log.info(`Channel disconnected in database: ${platform}`);
        }
        catch (error) {
            fastify.log.error(`Error disconnecting channel in database: ${error}`);
        }
        return {
            success: true,
            platform,
            message: `Successfully disconnected ${platform}`,
        };
    });
    // Legacy endpoints for backwards compatibility
    fastify.post('/instagram/connect', async () => ({
        channel: { id: `ch_ig_${Date.now()}`, type: 'instagram', status: 'connected' },
    }));
    fastify.post('/messenger/connect', async () => ({
        channel: { id: `ch_msg_${Date.now()}`, type: 'messenger', status: 'connected' },
    }));
    fastify.post('/whatsapp/connect', async () => ({
        channel: { id: `ch_wa_${Date.now()}`, type: 'whatsapp', status: 'connected' },
    }));
    fastify.post('/telegram/connect', async () => ({
        channel: { id: `ch_tg_${Date.now()}`, type: 'telegram', status: 'connected' },
    }));
}
//# sourceMappingURL=index.js.map