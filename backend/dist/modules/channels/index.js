// Channels Module - Mock Implementation for Demo
// In-memory storage for connected channels
const connectedChannels = {};
// Mock account data for each platform
const mockAccounts = {
    instagram: { username: '@business_demo', followers: '12.5K' },
    messenger: { username: 'Demo Business Page', pageId: '1234567890' },
    whatsapp: { phoneNumber: '+1 (555) 123-4567', businessName: 'Demo Business' },
    telegram: { username: '@demo_business_bot', botToken: 'mock_token' },
};
export default async function (fastify) {
    // Get all connected channels
    fastify.get('/', async () => {
        return {
            success: true,
            channels: connectedChannels,
        };
    });
    // Connect a channel (mock OAuth flow)
    fastify.post('/connect', async (request) => {
        const { platform } = request.body;
        if (!platform || !mockAccounts[platform]) {
            return {
                success: false,
                error: 'Invalid platform',
            };
        }
        // Simulate OAuth flow with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Store connected channel
        connectedChannels[platform] = {
            connected: true,
            connectedAt: new Date().toISOString(),
            ...mockAccounts[platform],
        };
        // Generate mock inbox data for this platform
        try {
            await fetch('http://localhost:3001/api/inbox/generate-mock-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform }),
            });
            fastify.log.info(`Generated mock inbox data for ${platform}`);
        }
        catch (error) {
            fastify.log.error(`Failed to generate mock inbox data: ${error}`);
        }
        fastify.log.info(`Mock channel connected: ${platform}`);
        return {
            success: true,
            platform,
            channel: connectedChannels[platform],
            message: `Successfully connected ${platform}`,
        };
    });
    // Disconnect a channel
    fastify.post('/disconnect', async (request) => {
        const { platform } = request.body;
        if (connectedChannels[platform]) {
            delete connectedChannels[platform];
            fastify.log.info(`Channel disconnected: ${platform}`);
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