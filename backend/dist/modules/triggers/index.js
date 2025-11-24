import prisma from '../../lib/prisma.js';
import { ALL_TRIGGERS, getTriggerType, getTriggersByChannel, validateTriggerConfig, matchesTrigger } from '../../config/trigger-types.js';
export default async function (fastify) {
    // Get all available trigger types (for dropdown/selection in UI)
    fastify.get('/types', async (request) => {
        const { channel } = request.query;
        if (channel) {
            const triggers = getTriggersByChannel(channel);
            return {
                success: true,
                triggerTypes: triggers
            };
        }
        return {
            success: true,
            triggerTypes: ALL_TRIGGERS
        };
    });
    // Get single trigger type details
    fastify.get('/types/:id', async (request) => {
        const { id } = request.params;
        const triggerType = getTriggerType(id);
        if (!triggerType) {
            return {
                success: false,
                error: 'Trigger type not found'
            };
        }
        return {
            success: true,
            triggerType
        };
    });
    // Get all triggers for a workspace
    fastify.get('/', async (request) => {
        try {
            const { workspaceId, channelId, flowId, enabled } = request.query;
            const where = {};
            // For now, use a default workspace if not provided
            if (workspaceId) {
                where.workspaceId = workspaceId;
            }
            if (channelId) {
                where.channelId = channelId;
            }
            if (flowId) {
                where.flowId = flowId;
            }
            if (enabled !== undefined) {
                where.enabled = enabled === 'true';
            }
            const triggers = await prisma.trigger.findMany({
                where,
                include: {
                    channel: true,
                    flow: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            // Enrich triggers with type metadata
            const enrichedTriggers = triggers.map(trigger => {
                const triggerType = getTriggerType(trigger.type);
                return {
                    ...trigger,
                    typeMetadata: triggerType
                };
            });
            return {
                success: true,
                triggers: enrichedTriggers
            };
        }
        catch (error) {
            fastify.log.error('Error fetching triggers:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });
    // Get single trigger
    fastify.get('/:id', async (request) => {
        try {
            const { id } = request.params;
            const trigger = await prisma.trigger.findUnique({
                where: { id },
                include: {
                    channel: true,
                    flow: true
                }
            });
            if (!trigger) {
                return {
                    success: false,
                    error: 'Trigger not found'
                };
            }
            const triggerType = getTriggerType(trigger.type);
            return {
                success: true,
                trigger: {
                    ...trigger,
                    typeMetadata: triggerType
                }
            };
        }
        catch (error) {
            fastify.log.error('Error fetching trigger:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });
    // Create new trigger
    fastify.post('/', async (request) => {
        try {
            const { workspaceId, channelId, flowId, type, config, enabled } = request.body;
            // Validate required fields
            if (!type || !flowId) {
                return {
                    success: false,
                    error: 'type and flowId are required'
                };
            }
            // Validate trigger type exists
            const triggerType = getTriggerType(type);
            if (!triggerType) {
                return {
                    success: false,
                    error: `Invalid trigger type: ${type}`
                };
            }
            // Validate trigger configuration
            const validation = validateTriggerConfig(type, config || {});
            if (!validation.valid) {
                return {
                    success: false,
                    error: 'Invalid trigger configuration',
                    errors: validation.errors
                };
            }
            // For now, use a default workspace if not provided
            // In production, this should come from auth context
            const finalWorkspaceId = workspaceId || 'default-workspace';
            // Create trigger
            const trigger = await prisma.trigger.create({
                data: {
                    workspaceId: finalWorkspaceId,
                    channelId,
                    flowId,
                    type,
                    config: config || {},
                    enabled: enabled !== undefined ? enabled : true
                },
                include: {
                    channel: true,
                    flow: true
                }
            });
            fastify.log.info(`✅ Created trigger: ${type} for flow ${flowId}`);
            return {
                success: true,
                trigger: {
                    ...trigger,
                    typeMetadata: triggerType
                }
            };
        }
        catch (error) {
            fastify.log.error('Error creating trigger:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });
    // Update trigger
    fastify.put('/:id', async (request) => {
        try {
            const { id } = request.params;
            const { config, enabled } = request.body;
            const existing = await prisma.trigger.findUnique({
                where: { id }
            });
            if (!existing) {
                return {
                    success: false,
                    error: 'Trigger not found'
                };
            }
            // If config is being updated, validate it
            if (config) {
                const validation = validateTriggerConfig(existing.type, config);
                if (!validation.valid) {
                    return {
                        success: false,
                        error: 'Invalid trigger configuration',
                        errors: validation.errors
                    };
                }
            }
            const trigger = await prisma.trigger.update({
                where: { id },
                data: {
                    ...(config && { config }),
                    ...(enabled !== undefined && { enabled })
                },
                include: {
                    channel: true,
                    flow: true
                }
            });
            const triggerType = getTriggerType(trigger.type);
            return {
                success: true,
                trigger: {
                    ...trigger,
                    typeMetadata: triggerType
                }
            };
        }
        catch (error) {
            fastify.log.error('Error updating trigger:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });
    // Delete trigger
    fastify.delete('/:id', async (request) => {
        try {
            const { id } = request.params;
            await prisma.trigger.delete({
                where: { id }
            });
            return {
                success: true,
                message: 'Trigger deleted'
            };
        }
        catch (error) {
            fastify.log.error('Error deleting trigger:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });
    // Toggle trigger enabled status
    fastify.post('/:id/toggle', async (request) => {
        try {
            const { id } = request.params;
            const existing = await prisma.trigger.findUnique({
                where: { id }
            });
            if (!existing) {
                return {
                    success: false,
                    error: 'Trigger not found'
                };
            }
            const trigger = await prisma.trigger.update({
                where: { id },
                data: {
                    enabled: !existing.enabled
                }
            });
            return {
                success: true,
                trigger,
                message: `Trigger ${trigger.enabled ? 'enabled' : 'disabled'}`
            };
        }
        catch (error) {
            fastify.log.error('Error toggling trigger:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });
    // Test if an event matches a trigger
    fastify.post('/match', async (request) => {
        try {
            const { triggerType, triggerConfig, event } = request.body;
            if (!triggerType || !event) {
                return {
                    success: false,
                    error: 'triggerType and event are required'
                };
            }
            const matches = matchesTrigger(triggerType, event, triggerConfig || {});
            return {
                success: true,
                matches
            };
        }
        catch (error) {
            fastify.log.error('Error testing trigger match:', error);
            return {
                success: false,
                error: error.message
            };
        }
    });
}
//# sourceMappingURL=index.js.map