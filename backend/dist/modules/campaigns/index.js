import prisma from '../../lib/prisma.js';
import CHANNEL_CAMPAIGN_RULES, { getChannelRules, isCampaignTypeSupported, validateMessageForChannel, } from '../../config/campaign-rules.js';
const campaignsModule = async (fastify) => {
    // ============================================
    // CAMPAIGN TYPES
    // ============================================
    const CAMPAIGN_TYPES = {
        evergreen: {
            id: 'evergreen',
            name: 'Evergreen Campaign',
            description: 'Automated sequences that run continuously for each subscriber',
            icon: 'refresh',
            features: ['Timed sequences', 'Drip series', 'Welcome series'],
            examples: ['Welcome series', '5-day challenge', 'Newsletter onboarding']
        },
        broadcast: {
            id: 'broadcast',
            name: 'Broadcast Campaign',
            description: 'One-time messages sent to all contacts or a filtered segment',
            icon: 'megaphone',
            features: ['Immediate send', 'Scheduled send', 'Segment targeting'],
            examples: ['Promotions', 'Announcements', 'Updates']
        }
    };
    const CAMPAIGN_STATUSES = {
        draft: { label: 'Draft', color: 'gray' },
        active: { label: 'Active', color: 'green' },
        paused: { label: 'Paused', color: 'yellow' },
        scheduled: { label: 'Scheduled', color: 'blue' },
        completed: { label: 'Completed', color: 'purple' }
    };
    // Get campaign types and statuses
    fastify.get('/types', async () => {
        return {
            success: true,
            types: Object.values(CAMPAIGN_TYPES),
            statuses: CAMPAIGN_STATUSES
        };
    });
    // ============================================
    // CHANNEL RULES
    // ============================================
    // Get all channel rules
    fastify.get('/channel-rules', async () => {
        return {
            success: true,
            rules: CHANNEL_CAMPAIGN_RULES,
        };
    });
    // Get rules for a specific channel type
    fastify.get('/channel-rules/:channelType', async (request, reply) => {
        const { channelType } = request.params;
        const rules = getChannelRules(channelType);
        if (!rules) {
            return reply.status(404).send({
                success: false,
                error: `No rules found for channel type: ${channelType}`,
            });
        }
        return { success: true, rules };
    });
    // Validate a message against channel constraints
    fastify.post('/validate-message', async (request, reply) => {
        const { channelType, message } = request.body;
        if (!channelType || !message) {
            return reply.status(400).send({
                success: false,
                error: 'channelType and message are required',
            });
        }
        const validation = validateMessageForChannel(channelType, message);
        return { success: true, validation };
    });
    // ============================================
    // CAMPAIGNS CRUD
    // ============================================
    // Get all campaigns for a workspace
    fastify.get('/', async (request, reply) => {
        const { workspaceId, type, status, channelId } = request.query;
        try {
            const where = {};
            if (workspaceId)
                where.workspaceId = workspaceId;
            if (type)
                where.type = type;
            if (status)
                where.status = status;
            if (channelId)
                where.channelId = channelId;
            const campaigns = await prisma.campaign.findMany({
                where,
                include: {
                    channel: true,
                    _count: {
                        select: {
                            subscribers: true,
                            messages: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            // Enrich with type metadata
            const enrichedCampaigns = campaigns.map((campaign) => ({
                ...campaign,
                typeInfo: CAMPAIGN_TYPES[campaign.type],
                statusInfo: CAMPAIGN_STATUSES[campaign.status],
            }));
            return { success: true, campaigns: enrichedCampaigns };
        }
        catch (error) {
            fastify.log.error('Error fetching campaigns:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Get a single campaign by ID
    fastify.get('/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            const campaign = await prisma.campaign.findUnique({
                where: { id },
                include: {
                    channel: true,
                    messages: {
                        orderBy: { stepIndex: 'asc' },
                    },
                    _count: {
                        select: {
                            subscribers: true,
                        },
                    },
                },
            });
            if (!campaign) {
                return reply.status(404).send({ success: false, error: 'Campaign not found' });
            }
            // Get channel rules if channel is set
            const channelRules = campaign.channel
                ? getChannelRules(campaign.channel.type)
                : null;
            return {
                success: true,
                campaign: {
                    ...campaign,
                    typeInfo: CAMPAIGN_TYPES[campaign.type],
                    statusInfo: CAMPAIGN_STATUSES[campaign.status],
                    channelRules: channelRules,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error fetching campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Create a new campaign
    fastify.post('/', async (request, reply) => {
        const { workspaceId, channelId, name, description, type, editorType, flowId, settings, } = request.body;
        if (!workspaceId || !name || !type) {
            return reply.status(400).send({
                success: false,
                error: 'workspaceId, name, and type are required',
            });
        }
        if (!channelId) {
            return reply.status(400).send({
                success: false,
                error: 'channelId is required. Please select a channel for this campaign.',
            });
        }
        if (!CAMPAIGN_TYPES[type]) {
            return reply.status(400).send({
                success: false,
                error: 'Invalid campaign type. Must be "evergreen" or "broadcast"',
            });
        }
        try {
            // Ensure workspace exists (upsert to handle frontend-only brands)
            await prisma.workspace.upsert({
                where: { id: workspaceId },
                update: {},
                create: {
                    id: workspaceId,
                    name: workspaceId,
                },
            });
            // Get the channel to validate against its rules
            const channel = await prisma.channel.findUnique({
                where: { id: channelId },
            });
            if (!channel) {
                return reply.status(404).send({
                    success: false,
                    error: 'Channel not found',
                });
            }
            // Validate campaign type against channel rules
            const channelRules = getChannelRules(channel.type);
            if (channelRules && !isCampaignTypeSupported(channel.type, type)) {
                return reply.status(400).send({
                    success: false,
                    error: `${channelRules.name} does not support ${type} campaigns. Supported types: ${channelRules.supportedCampaignTypes.join(', ')}`,
                });
            }
            const campaign = await prisma.campaign.create({
                data: {
                    workspaceId,
                    channelId,
                    name,
                    description: description || null,
                    type,
                    editorType: editorType || 'simple',
                    flowId: flowId || null,
                    settings: settings ? JSON.stringify(settings) : '{}',
                },
                include: {
                    channel: true,
                },
            });
            return {
                success: true,
                campaign: {
                    ...campaign,
                    typeInfo: CAMPAIGN_TYPES[campaign.type],
                    statusInfo: CAMPAIGN_STATUSES[campaign.status],
                    channelRules: channelRules,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error creating campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Update a campaign
    fastify.put('/:id', async (request, reply) => {
        const { id } = request.params;
        const { name, description, channelId, editorType, flowId, settings, scheduledAt, } = request.body;
        try {
            const campaign = await prisma.campaign.update({
                where: { id },
                data: {
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    ...(channelId !== undefined && { channelId }),
                    ...(editorType && { editorType }),
                    ...(flowId !== undefined && { flowId }),
                    ...(settings && { settings: JSON.stringify(settings) }),
                    ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
                },
                include: {
                    channel: true,
                    messages: {
                        orderBy: { stepIndex: 'asc' },
                    },
                },
            });
            return {
                success: true,
                campaign: {
                    ...campaign,
                    typeInfo: CAMPAIGN_TYPES[campaign.type],
                    statusInfo: CAMPAIGN_STATUSES[campaign.status],
                },
            };
        }
        catch (error) {
            fastify.log.error('Error updating campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Delete a campaign
    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params;
        try {
            await prisma.campaign.delete({
                where: { id },
            });
            return { success: true };
        }
        catch (error) {
            fastify.log.error('Error deleting campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Duplicate a campaign
    fastify.post('/:id/duplicate', async (request, reply) => {
        const { id } = request.params;
        try {
            const original = await prisma.campaign.findUnique({
                where: { id },
                include: {
                    messages: true,
                },
            });
            if (!original) {
                return reply.status(404).send({ success: false, error: 'Campaign not found' });
            }
            // Create duplicate campaign
            const duplicate = await prisma.campaign.create({
                data: {
                    workspaceId: original.workspaceId,
                    channelId: original.channelId,
                    name: `${original.name} (Copy)`,
                    description: original.description,
                    type: original.type,
                    editorType: original.editorType,
                    flowId: original.flowId,
                    settings: original.settings,
                    status: 'draft',
                },
            });
            // Duplicate messages
            if (original.messages.length > 0) {
                await prisma.campaignMessage.createMany({
                    data: original.messages.map((msg) => ({
                        campaignId: duplicate.id,
                        stepIndex: msg.stepIndex,
                        delayMinutes: msg.delayMinutes,
                        content: msg.content,
                        mediaUrl: msg.mediaUrl,
                        mediaType: msg.mediaType,
                        buttons: msg.buttons,
                    })),
                });
            }
            const result = await prisma.campaign.findUnique({
                where: { id: duplicate.id },
                include: {
                    channel: true,
                    messages: {
                        orderBy: { stepIndex: 'asc' },
                    },
                },
            });
            return { success: true, campaign: result };
        }
        catch (error) {
            fastify.log.error('Error duplicating campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // ============================================
    // CAMPAIGN STATUS ACTIONS
    // ============================================
    // Activate a campaign
    fastify.post('/:id/activate', async (request, reply) => {
        const { id } = request.params;
        try {
            const campaign = await prisma.campaign.findUnique({
                where: { id },
                include: { messages: true },
            });
            if (!campaign) {
                return reply.status(404).send({ success: false, error: 'Campaign not found' });
            }
            // Check if campaign has at least one message
            if (campaign.messages.length === 0) {
                return reply.status(400).send({
                    success: false,
                    error: 'Campaign must have at least one message before activating',
                });
            }
            const updated = await prisma.campaign.update({
                where: { id },
                data: { status: 'active' },
                include: { channel: true },
            });
            return {
                success: true,
                campaign: {
                    ...updated,
                    typeInfo: CAMPAIGN_TYPES[updated.type],
                    statusInfo: CAMPAIGN_STATUSES.active,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error activating campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Pause a campaign
    fastify.post('/:id/pause', async (request, reply) => {
        const { id } = request.params;
        try {
            const campaign = await prisma.campaign.update({
                where: { id },
                data: { status: 'paused' },
                include: { channel: true },
            });
            return {
                success: true,
                campaign: {
                    ...campaign,
                    typeInfo: CAMPAIGN_TYPES[campaign.type],
                    statusInfo: CAMPAIGN_STATUSES.paused,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error pausing campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Resume a paused campaign
    fastify.post('/:id/resume', async (request, reply) => {
        const { id } = request.params;
        try {
            const campaign = await prisma.campaign.update({
                where: { id },
                data: { status: 'active' },
                include: { channel: true },
            });
            return {
                success: true,
                campaign: {
                    ...campaign,
                    typeInfo: CAMPAIGN_TYPES[campaign.type],
                    statusInfo: CAMPAIGN_STATUSES.active,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error resuming campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Schedule a broadcast campaign
    fastify.post('/:id/schedule', async (request, reply) => {
        const { id } = request.params;
        const { scheduledAt } = request.body;
        if (!scheduledAt) {
            return reply.status(400).send({
                success: false,
                error: 'scheduledAt is required',
            });
        }
        try {
            const campaign = await prisma.campaign.update({
                where: { id },
                data: {
                    status: 'scheduled',
                    scheduledAt: new Date(scheduledAt),
                },
                include: { channel: true },
            });
            return {
                success: true,
                campaign: {
                    ...campaign,
                    typeInfo: CAMPAIGN_TYPES[campaign.type],
                    statusInfo: CAMPAIGN_STATUSES.scheduled,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error scheduling campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Complete a campaign
    fastify.post('/:id/complete', async (request, reply) => {
        const { id } = request.params;
        try {
            const campaign = await prisma.campaign.update({
                where: { id },
                data: { status: 'completed' },
                include: { channel: true },
            });
            return {
                success: true,
                campaign: {
                    ...campaign,
                    typeInfo: CAMPAIGN_TYPES[campaign.type],
                    statusInfo: CAMPAIGN_STATUSES.completed,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error completing campaign:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // ============================================
    // CAMPAIGN MESSAGES
    // ============================================
    // Get all messages for a campaign
    fastify.get('/:id/messages', async (request, reply) => {
        const { id } = request.params;
        try {
            const messages = await prisma.campaignMessage.findMany({
                where: { campaignId: id },
                orderBy: { stepIndex: 'asc' },
            });
            return { success: true, messages };
        }
        catch (error) {
            fastify.log.error('Error fetching campaign messages:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Add a message to a campaign
    fastify.post('/:id/messages', async (request, reply) => {
        const { id } = request.params;
        const { content, delayMinutes, mediaUrl, mediaType, buttons, } = request.body;
        if (!content) {
            return reply.status(400).send({
                success: false,
                error: 'content is required',
            });
        }
        try {
            // Get campaign with channel to validate message
            const campaign = await prisma.campaign.findUnique({
                where: { id },
                include: { channel: true },
            });
            if (!campaign) {
                return reply.status(404).send({ success: false, error: 'Campaign not found' });
            }
            // Validate message against channel constraints
            if (campaign.channel) {
                const validation = validateMessageForChannel(campaign.channel.type, {
                    content,
                    mediaUrl,
                    mediaType,
                    buttons,
                });
                if (!validation.valid) {
                    return reply.status(400).send({
                        success: false,
                        error: 'Message validation failed',
                        validationErrors: validation.errors,
                    });
                }
            }
            // Get the next step index
            const lastMessage = await prisma.campaignMessage.findFirst({
                where: { campaignId: id },
                orderBy: { stepIndex: 'desc' },
            });
            const nextStepIndex = lastMessage ? lastMessage.stepIndex + 1 : 0;
            const message = await prisma.campaignMessage.create({
                data: {
                    campaignId: id,
                    stepIndex: nextStepIndex,
                    content,
                    delayMinutes: delayMinutes || 0,
                    mediaUrl: mediaUrl || null,
                    mediaType: mediaType || null,
                    buttons: buttons ? JSON.stringify(buttons) : '[]',
                },
            });
            return { success: true, message };
        }
        catch (error) {
            fastify.log.error('Error adding campaign message:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Update a campaign message
    fastify.put('/:id/messages/:messageId', async (request, reply) => {
        const { messageId } = request.params;
        const { content, delayMinutes, mediaUrl, mediaType, buttons, } = request.body;
        try {
            const message = await prisma.campaignMessage.update({
                where: { id: messageId },
                data: {
                    ...(content && { content }),
                    ...(delayMinutes !== undefined && { delayMinutes }),
                    ...(mediaUrl !== undefined && { mediaUrl }),
                    ...(mediaType !== undefined && { mediaType }),
                    ...(buttons && { buttons: JSON.stringify(buttons) }),
                },
            });
            return { success: true, message };
        }
        catch (error) {
            fastify.log.error('Error updating campaign message:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Delete a campaign message
    fastify.delete('/:id/messages/:messageId', async (request, reply) => {
        const { id, messageId } = request.params;
        try {
            await prisma.campaignMessage.delete({
                where: { id: messageId },
            });
            // Re-index remaining messages
            const remainingMessages = await prisma.campaignMessage.findMany({
                where: { campaignId: id },
                orderBy: { stepIndex: 'asc' },
            });
            for (let i = 0; i < remainingMessages.length; i++) {
                if (remainingMessages[i].stepIndex !== i) {
                    await prisma.campaignMessage.update({
                        where: { id: remainingMessages[i].id },
                        data: { stepIndex: i },
                    });
                }
            }
            return { success: true };
        }
        catch (error) {
            fastify.log.error('Error deleting campaign message:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Reorder campaign messages
    fastify.post('/:id/messages/reorder', async (request, reply) => {
        const { id } = request.params;
        const { messageIds } = request.body;
        if (!messageIds || !Array.isArray(messageIds)) {
            return reply.status(400).send({
                success: false,
                error: 'messageIds array is required',
            });
        }
        try {
            // Update each message with its new index
            for (let i = 0; i < messageIds.length; i++) {
                await prisma.campaignMessage.update({
                    where: { id: messageIds[i] },
                    data: { stepIndex: i },
                });
            }
            const messages = await prisma.campaignMessage.findMany({
                where: { campaignId: id },
                orderBy: { stepIndex: 'asc' },
            });
            return { success: true, messages };
        }
        catch (error) {
            fastify.log.error('Error reordering campaign messages:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // ============================================
    // CAMPAIGN SUBSCRIBERS
    // ============================================
    // Get subscribers for a campaign
    fastify.get('/:id/subscribers', async (request, reply) => {
        const { id } = request.params;
        const { status, limit, offset } = request.query;
        try {
            const where = { campaignId: id };
            if (status)
                where.status = status;
            const subscribers = await prisma.campaignSubscriber.findMany({
                where,
                include: {
                    contact: true,
                },
                orderBy: { subscribedAt: 'desc' },
                take: limit ? parseInt(limit) : 50,
                skip: offset ? parseInt(offset) : 0,
            });
            const total = await prisma.campaignSubscriber.count({ where });
            return { success: true, subscribers, total };
        }
        catch (error) {
            fastify.log.error('Error fetching campaign subscribers:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Add a subscriber to a campaign
    fastify.post('/:id/subscribers', async (request, reply) => {
        const { id } = request.params;
        const { contactId } = request.body;
        if (!contactId) {
            return reply.status(400).send({
                success: false,
                error: 'contactId is required',
            });
        }
        try {
            // Check if already subscribed
            const existing = await prisma.campaignSubscriber.findUnique({
                where: {
                    campaignId_contactId: { campaignId: id, contactId },
                },
            });
            if (existing) {
                return reply.status(400).send({
                    success: false,
                    error: 'Contact is already subscribed to this campaign',
                });
            }
            const subscriber = await prisma.campaignSubscriber.create({
                data: {
                    campaignId: id,
                    contactId,
                },
                include: {
                    contact: true,
                },
            });
            return { success: true, subscriber };
        }
        catch (error) {
            fastify.log.error('Error adding campaign subscriber:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Bulk add subscribers to a campaign
    fastify.post('/:id/subscribers/bulk', async (request, reply) => {
        const { id } = request.params;
        const { contactIds } = request.body;
        if (!contactIds || !Array.isArray(contactIds)) {
            return reply.status(400).send({
                success: false,
                error: 'contactIds array is required',
            });
        }
        try {
            // Get existing subscribers
            const existing = await prisma.campaignSubscriber.findMany({
                where: {
                    campaignId: id,
                    contactId: { in: contactIds },
                },
                select: { contactId: true },
            });
            const existingIds = new Set(existing.map((s) => s.contactId));
            const newContactIds = contactIds.filter((cId) => !existingIds.has(cId));
            if (newContactIds.length > 0) {
                await prisma.campaignSubscriber.createMany({
                    data: newContactIds.map((contactId) => ({
                        campaignId: id,
                        contactId,
                    })),
                });
            }
            return {
                success: true,
                added: newContactIds.length,
                skipped: existingIds.size,
            };
        }
        catch (error) {
            fastify.log.error('Error bulk adding subscribers:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // Remove a subscriber from a campaign
    fastify.delete('/:id/subscribers/:subscriberId', async (request, reply) => {
        const { subscriberId } = request.params;
        try {
            await prisma.campaignSubscriber.delete({
                where: { id: subscriberId },
            });
            return { success: true };
        }
        catch (error) {
            fastify.log.error('Error removing campaign subscriber:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
    // ============================================
    // CAMPAIGN ANALYTICS
    // ============================================
    // Get campaign analytics summary
    fastify.get('/:id/analytics', async (request, reply) => {
        const { id } = request.params;
        try {
            const campaign = await prisma.campaign.findUnique({
                where: { id },
                select: {
                    totalSent: true,
                    totalDelivered: true,
                },
            });
            if (!campaign) {
                return reply.status(404).send({ success: false, error: 'Campaign not found' });
            }
            const subscriberStats = await prisma.campaignSubscriber.groupBy({
                by: ['status'],
                where: { campaignId: id },
                _count: true,
            });
            const stats = {
                totalSent: campaign.totalSent,
                totalDelivered: campaign.totalDelivered,
                deliveryRate: campaign.totalSent > 0
                    ? ((campaign.totalDelivered / campaign.totalSent) * 100).toFixed(1)
                    : 0,
                subscribers: subscriberStats.reduce((acc, stat) => {
                    acc[stat.status] = stat._count;
                    return acc;
                }, {}),
            };
            return { success: true, analytics: stats };
        }
        catch (error) {
            fastify.log.error('Error fetching campaign analytics:', error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    });
};
export default campaignsModule;
//# sourceMappingURL=index.js.map