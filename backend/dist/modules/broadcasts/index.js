// Broadcasts Module - One-time mass messaging using dedicated Broadcast model
import prisma from '../../lib/prisma.js';
export default async function (fastify) {
    // Get all broadcasts with filtering
    fastify.get('/', async (request) => {
        const { workspaceId, status, channel } = request.query;
        try {
            const where = {};
            if (workspaceId) {
                where.workspaceId = workspaceId;
            }
            // Filter by status tab
            if (status && status !== 'all') {
                if (status === 'drafts') {
                    where.status = 'draft';
                }
                else if (status === 'scheduled') {
                    where.status = 'scheduled';
                }
                else if (status === 'history' || status === 'sent') {
                    where.status = { in: ['sent', 'sending', 'failed', 'cancelled'] };
                }
                else {
                    where.status = status;
                }
            }
            if (channel && channel !== 'all') {
                where.channel = channel;
            }
            const broadcasts = await prisma.broadcast.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    jobs: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                },
            });
            // Calculate stats for tabs - filter by channel if specified
            const statsWhere = { workspaceId: workspaceId || undefined };
            if (channel && channel !== 'all') {
                statsWhere.channel = channel;
            }
            const allBroadcasts = await prisma.broadcast.findMany({
                where: statsWhere,
                select: { status: true },
            });
            const stats = {
                drafts: allBroadcasts.filter(b => b.status === 'draft').length,
                scheduled: allBroadcasts.filter(b => b.status === 'scheduled').length,
                history: allBroadcasts.filter(b => ['sent', 'sending', 'failed', 'cancelled'].includes(b.status)).length,
            };
            // Format broadcasts for frontend
            const formattedBroadcasts = broadcasts.map(broadcast => {
                let contentBlocks = [];
                let audienceFilters = {};
                try {
                    contentBlocks = JSON.parse(broadcast.contentJson || '[]');
                    audienceFilters = JSON.parse(broadcast.audienceFilterJson || '{}');
                }
                catch (e) {
                    // Ignore JSON parse errors
                }
                const latestJob = broadcast.jobs[0];
                return {
                    id: broadcast.id,
                    name: broadcast.name,
                    channel: broadcast.channel,
                    status: broadcast.status,
                    scheduleAt: broadcast.scheduleAt,
                    timezone: broadcast.timezone,
                    contentBlocks,
                    audienceFilters,
                    audienceEstimate: broadcast.audienceEstimate,
                    stats: {
                        targeted: broadcast.totalTargeted,
                        sent: broadcast.totalSent,
                        delivered: broadcast.totalDelivered,
                        read: broadcast.totalRead,
                        clicked: broadcast.totalClicked,
                        failed: broadcast.totalFailed,
                    },
                    latestJob: latestJob ? {
                        id: latestJob.id,
                        status: latestJob.status,
                        startedAt: latestJob.startedAt,
                        finishedAt: latestJob.finishedAt,
                    } : null,
                    createdBy: broadcast.createdBy,
                    createdAt: broadcast.createdAt,
                    updatedAt: broadcast.updatedAt,
                };
            });
            return {
                success: true,
                broadcasts: formattedBroadcasts,
                stats,
            };
        }
        catch (error) {
            fastify.log.error('Error fetching broadcasts:', error);
            return {
                success: false,
                error: error.message,
                broadcasts: [],
                stats: { drafts: 0, scheduled: 0, history: 0 },
            };
        }
    });
    // Get single broadcast with full details
    fastify.get('/:id', async (request) => {
        const { id } = request.params;
        try {
            const broadcast = await prisma.broadcast.findUnique({
                where: { id },
                include: {
                    jobs: {
                        orderBy: { createdAt: 'desc' },
                    },
                    recipientLogs: {
                        take: 100,
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
            if (!broadcast) {
                return {
                    success: false,
                    error: 'Broadcast not found',
                };
            }
            let contentBlocks = [];
            let audienceFilters = {};
            try {
                contentBlocks = JSON.parse(broadcast.contentJson || '[]');
                audienceFilters = JSON.parse(broadcast.audienceFilterJson || '{}');
            }
            catch (e) { }
            return {
                success: true,
                broadcast: {
                    ...broadcast,
                    contentBlocks,
                    audienceFilters,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error fetching broadcast:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Create broadcast
    fastify.post('/', async (request) => {
        const { workspaceId, name, channel, contentBlocks, audienceFilters, audienceEstimate, status, scheduleAt, timezone, createdBy, } = request.body;
        try {
            const broadcast = await prisma.broadcast.create({
                data: {
                    workspaceId: workspaceId || 'brand-1',
                    name: name || 'Untitled Broadcast',
                    channel: channel || 'instagram',
                    status: status || 'draft',
                    contentJson: JSON.stringify(contentBlocks || []),
                    audienceFilterJson: JSON.stringify(audienceFilters || {}),
                    audienceEstimate: audienceEstimate || 0,
                    scheduleAt: scheduleAt ? new Date(scheduleAt) : null,
                    timezone: timezone || 'UTC',
                    createdBy: createdBy || null,
                },
            });
            fastify.log.info(`Broadcast created: ${broadcast.id}`);
            return {
                success: true,
                broadcast,
            };
        }
        catch (error) {
            fastify.log.error('Error creating broadcast:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Update broadcast
    fastify.put('/:id', async (request) => {
        const { id } = request.params;
        const { name, channel, contentBlocks, audienceFilters, audienceEstimate, status, scheduleAt, timezone, } = request.body;
        try {
            const existing = await prisma.broadcast.findUnique({ where: { id } });
            if (!existing) {
                return { success: false, error: 'Broadcast not found' };
            }
            // Only allow updates if broadcast is in draft or scheduled status
            if (!['draft', 'scheduled'].includes(existing.status)) {
                return {
                    success: false,
                    error: 'Cannot edit a broadcast that has already been sent'
                };
            }
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (channel !== undefined)
                updateData.channel = channel;
            if (contentBlocks !== undefined)
                updateData.contentJson = JSON.stringify(contentBlocks);
            if (audienceFilters !== undefined)
                updateData.audienceFilterJson = JSON.stringify(audienceFilters);
            if (audienceEstimate !== undefined)
                updateData.audienceEstimate = audienceEstimate;
            if (status !== undefined)
                updateData.status = status;
            if (scheduleAt !== undefined)
                updateData.scheduleAt = scheduleAt ? new Date(scheduleAt) : null;
            if (timezone !== undefined)
                updateData.timezone = timezone;
            const broadcast = await prisma.broadcast.update({
                where: { id },
                data: updateData,
            });
            return {
                success: true,
                broadcast,
            };
        }
        catch (error) {
            fastify.log.error('Error updating broadcast:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Delete broadcast
    fastify.delete('/:id', async (request) => {
        const { id } = request.params;
        try {
            const existing = await prisma.broadcast.findUnique({ where: { id } });
            if (!existing) {
                return { success: false, error: 'Broadcast not found' };
            }
            // Only allow deletion if not currently sending
            if (existing.status === 'sending') {
                return {
                    success: false,
                    error: 'Cannot delete a broadcast that is currently sending'
                };
            }
            await prisma.broadcast.delete({
                where: { id },
            });
            return {
                success: true,
                message: 'Broadcast deleted',
            };
        }
        catch (error) {
            fastify.log.error('Error deleting broadcast:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Duplicate broadcast
    fastify.post('/:id/duplicate', async (request) => {
        const { id } = request.params;
        try {
            const original = await prisma.broadcast.findUnique({ where: { id } });
            if (!original) {
                return { success: false, error: 'Broadcast not found' };
            }
            const duplicate = await prisma.broadcast.create({
                data: {
                    workspaceId: original.workspaceId,
                    name: `${original.name} (Copy)`,
                    channel: original.channel,
                    status: 'draft',
                    contentJson: original.contentJson,
                    audienceFilterJson: original.audienceFilterJson,
                    audienceEstimate: original.audienceEstimate,
                    timezone: original.timezone,
                    createdBy: original.createdBy,
                },
            });
            return {
                success: true,
                broadcast: duplicate,
            };
        }
        catch (error) {
            fastify.log.error('Error duplicating broadcast:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Get audience preview with eligibility statistics
    fastify.post('/audience-preview', async (request) => {
        const { workspaceId, channel, filters } = request.body;
        try {
            // Build where clause for contacts
            const where = {
                broadcastOptOut: false, // Exclude users who opted out
            };
            if (workspaceId) {
                where.workspaceId = workspaceId;
            }
            // Find channel ID if channel type provided
            if (channel) {
                const channelRecord = await prisma.channel.findFirst({
                    where: {
                        workspaceId: workspaceId || 'brand-1',
                        type: channel,
                        status: 'connected',
                    },
                });
                if (channelRecord) {
                    where.channelId = channelRecord.id;
                }
            }
            // Apply filters
            if (filters) {
                // Last interaction filter (for Instagram 24-hour window)
                if (filters.lastInteraction) {
                    const now = new Date();
                    let hours = 24;
                    if (filters.lastInteraction === '24h')
                        hours = 24;
                    else if (filters.lastInteraction === '7d')
                        hours = 24 * 7;
                    else if (filters.lastInteraction === '30d')
                        hours = 24 * 30;
                    const cutoffDate = new Date(now.getTime() - hours * 60 * 60 * 1000);
                    where.lastInAt = { gte: cutoffDate };
                }
                // Tags filter
                if (filters.tags && filters.tags.length > 0) {
                    // Tags are stored as JSON array string, so we need to use contains
                    where.OR = filters.tags.map((tag) => ({
                        tags: { contains: tag },
                    }));
                }
                // Custom field filters
                if (filters.customFields) {
                    for (const [key, value] of Object.entries(filters.customFields)) {
                        if (value) {
                            where.fields = { contains: `"${key}":"${value}"` };
                        }
                    }
                }
                // Opt-in status (isFollower for Instagram)
                if (filters.optedIn !== undefined) {
                    where.isFollower = filters.optedIn;
                }
                // Subscribed after date
                if (filters.subscribedAfter) {
                    where.createdAt = { gte: new Date(filters.subscribedAfter) };
                }
            }
            // Get total contacts matching filters
            const totalContacts = await prisma.userContact.count({ where });
            // For Instagram/Messenger, calculate eligible (within 24-hour window)
            let eligibleContacts = totalContacts;
            let ineligibleContacts = 0;
            let eligibilityBreakdown = {};
            if (channel === 'instagram' || channel === 'messenger') {
                const now = new Date();
                const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                // Count contacts within 24-hour window
                const eligibleWhere = {
                    ...where,
                    lastInAt: { gte: twentyFourHoursAgo },
                };
                eligibleContacts = await prisma.userContact.count({ where: eligibleWhere });
                ineligibleContacts = totalContacts - eligibleContacts;
                eligibilityBreakdown = {
                    within24Hours: eligibleContacts,
                    outside24Hours: ineligibleContacts,
                    reason: 'Platform requires user interaction within 24 hours',
                };
            }
            // Get sample contacts for preview
            const sampleContacts = await prisma.userContact.findMany({
                where,
                take: 5,
                select: {
                    id: true,
                    name: true,
                    handle: true,
                    externalId: true,
                    lastInAt: true,
                    isFollower: true,
                },
            });
            return {
                success: true,
                audience: {
                    total: totalContacts,
                    eligible: eligibleContacts,
                    ineligible: ineligibleContacts,
                    breakdown: eligibilityBreakdown,
                    sampleContacts,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error getting audience preview:', error);
            // Return mock data on error for demo purposes
            return {
                success: true,
                audience: {
                    total: Math.floor(Math.random() * 1000) + 100,
                    eligible: Math.floor(Math.random() * 500) + 50,
                    ineligible: Math.floor(Math.random() * 200) + 10,
                    breakdown: {
                        within24Hours: Math.floor(Math.random() * 500) + 50,
                        outside24Hours: Math.floor(Math.random() * 200) + 10,
                        reason: 'Platform requires user interaction within 24 hours',
                    },
                    sampleContacts: [],
                },
            };
        }
    });
    // Send broadcast immediately
    fastify.post('/:id/send', async (request) => {
        const { id } = request.params;
        try {
            const broadcast = await prisma.broadcast.findUnique({ where: { id } });
            if (!broadcast) {
                return { success: false, error: 'Broadcast not found' };
            }
            if (broadcast.status !== 'draft' && broadcast.status !== 'scheduled') {
                return {
                    success: false,
                    error: 'Broadcast has already been sent or is currently sending'
                };
            }
            // Create a job for this send
            const job = await prisma.broadcastJob.create({
                data: {
                    broadcastId: id,
                    status: 'processing',
                    startedAt: new Date(),
                    totalTargeted: broadcast.audienceEstimate,
                },
            });
            // Update broadcast status
            await prisma.broadcast.update({
                where: { id },
                data: {
                    status: 'sending',
                    totalTargeted: broadcast.audienceEstimate,
                },
            });
            // Simulate sending (in production, this would queue actual messages)
            const audienceCount = broadcast.audienceEstimate || 0;
            // Process in background
            setTimeout(async () => {
                try {
                    const sent = audienceCount;
                    const delivered = Math.floor(audienceCount * 0.95);
                    const read = Math.floor(delivered * 0.6);
                    const clicked = Math.floor(read * 0.15);
                    const failed = audienceCount - sent;
                    // Update job
                    await prisma.broadcastJob.update({
                        where: { id: job.id },
                        data: {
                            status: 'completed',
                            finishedAt: new Date(),
                            totalAttempted: audienceCount,
                            totalSent: sent,
                            totalDelivered: delivered,
                            totalFailed: failed,
                        },
                    });
                    // Update broadcast with stats
                    await prisma.broadcast.update({
                        where: { id },
                        data: {
                            status: 'sent',
                            totalSent: sent,
                            totalDelivered: delivered,
                            totalRead: read,
                            totalClicked: clicked,
                            totalFailed: failed,
                        },
                    });
                    fastify.log.info(`Broadcast ${id} sent to ${audienceCount} recipients`);
                }
                catch (e) {
                    fastify.log.error('Error completing broadcast:', e);
                    // Mark as failed
                    await prisma.broadcastJob.update({
                        where: { id: job.id },
                        data: {
                            status: 'failed',
                            finishedAt: new Date(),
                            errorSummary: e.message,
                        },
                    });
                    await prisma.broadcast.update({
                        where: { id },
                        data: { status: 'failed' },
                    });
                }
            }, 5000);
            return {
                success: true,
                message: 'Broadcast is being sent',
                jobId: job.id,
            };
        }
        catch (error) {
            fastify.log.error('Error sending broadcast:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Schedule broadcast
    fastify.post('/:id/schedule', async (request) => {
        const { id } = request.params;
        const { scheduleAt, timezone } = request.body;
        try {
            const broadcast = await prisma.broadcast.findUnique({ where: { id } });
            if (!broadcast) {
                return { success: false, error: 'Broadcast not found' };
            }
            if (broadcast.status !== 'draft') {
                return {
                    success: false,
                    error: 'Only draft broadcasts can be scheduled'
                };
            }
            if (!scheduleAt) {
                return { success: false, error: 'Schedule time is required' };
            }
            const scheduleDate = new Date(scheduleAt);
            if (scheduleDate <= new Date()) {
                return {
                    success: false,
                    error: 'Schedule time must be in the future'
                };
            }
            const updated = await prisma.broadcast.update({
                where: { id },
                data: {
                    status: 'scheduled',
                    scheduleAt: scheduleDate,
                    timezone: timezone || 'UTC',
                },
            });
            return {
                success: true,
                broadcast: updated,
            };
        }
        catch (error) {
            fastify.log.error('Error scheduling broadcast:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Cancel scheduled broadcast
    fastify.post('/:id/cancel', async (request) => {
        const { id } = request.params;
        try {
            const broadcast = await prisma.broadcast.findUnique({ where: { id } });
            if (!broadcast) {
                return { success: false, error: 'Broadcast not found' };
            }
            if (broadcast.status === 'sending') {
                return {
                    success: false,
                    error: 'Cannot cancel a broadcast that is currently sending'
                };
            }
            if (broadcast.status === 'sent') {
                return {
                    success: false,
                    error: 'Cannot cancel a broadcast that has already been sent'
                };
            }
            const updated = await prisma.broadcast.update({
                where: { id },
                data: {
                    status: broadcast.status === 'scheduled' ? 'cancelled' : 'draft',
                    scheduleAt: null,
                },
            });
            return {
                success: true,
                broadcast: updated,
                message: broadcast.status === 'scheduled' ? 'Broadcast cancelled' : 'Broadcast returned to draft',
            };
        }
        catch (error) {
            fastify.log.error('Error cancelling broadcast:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Handle "Stop" keyword - unsubscribe user from broadcasts
    fastify.post('/unsubscribe', async (request) => {
        const { userId, channelId, externalId, workspaceId } = request.body;
        try {
            let userContact;
            // Find user by ID or by channel + externalId
            if (userId) {
                userContact = await prisma.userContact.findUnique({
                    where: { id: userId },
                });
            }
            else if (channelId && externalId) {
                userContact = await prisma.userContact.findUnique({
                    where: {
                        channelId_externalId: {
                            channelId,
                            externalId,
                        },
                    },
                });
            }
            if (!userContact) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }
            // Update user to opt-out of broadcasts
            const updated = await prisma.userContact.update({
                where: { id: userContact.id },
                data: {
                    broadcastOptOut: true,
                    optOutAt: new Date(),
                },
            });
            fastify.log.info(`User ${userContact.id} opted out of broadcasts`);
            return {
                success: true,
                message: 'User unsubscribed from broadcasts',
                user: {
                    id: updated.id,
                    broadcastOptOut: updated.broadcastOptOut,
                    optOutAt: updated.optOutAt,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error unsubscribing user:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Re-subscribe user to broadcasts (opt back in)
    fastify.post('/resubscribe', async (request) => {
        const { userId } = request.body;
        try {
            if (!userId) {
                return { success: false, error: 'userId is required' };
            }
            const updated = await prisma.userContact.update({
                where: { id: userId },
                data: {
                    broadcastOptOut: false,
                    optOutAt: null,
                },
            });
            fastify.log.info(`User ${userId} re-subscribed to broadcasts`);
            return {
                success: true,
                message: 'User re-subscribed to broadcasts',
                user: {
                    id: updated.id,
                    broadcastOptOut: updated.broadcastOptOut,
                },
            };
        }
        catch (error) {
            fastify.log.error('Error re-subscribing user:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
    // Get broadcast report/analytics
    fastify.get('/:id/report', async (request) => {
        const { id } = request.params;
        try {
            const broadcast = await prisma.broadcast.findUnique({
                where: { id },
                include: {
                    jobs: {
                        orderBy: { createdAt: 'desc' },
                    },
                    recipientLogs: {
                        select: {
                            status: true,
                            skipReason: true,
                            sentAt: true,
                            deliveredAt: true,
                            readAt: true,
                            clickedAt: true,
                        },
                    },
                },
            });
            if (!broadcast) {
                return { success: false, error: 'Broadcast not found' };
            }
            // Calculate detailed stats from recipient logs
            const statusCounts = broadcast.recipientLogs.reduce((acc, log) => {
                acc[log.status] = (acc[log.status] || 0) + 1;
                return acc;
            }, {});
            const skipReasons = broadcast.recipientLogs
                .filter(log => log.skipReason)
                .reduce((acc, log) => {
                acc[log.skipReason] = (acc[log.skipReason] || 0) + 1;
                return acc;
            }, {});
            // Calculate delivery timeline (if we have timestamps)
            const deliveryTimeline = broadcast.recipientLogs
                .filter(log => log.sentAt)
                .map(log => ({
                sentAt: log.sentAt,
                deliveredAt: log.deliveredAt,
                readAt: log.readAt,
                clickedAt: log.clickedAt,
            }));
            return {
                success: true,
                report: {
                    broadcast: {
                        id: broadcast.id,
                        name: broadcast.name,
                        channel: broadcast.channel,
                        status: broadcast.status,
                        scheduleAt: broadcast.scheduleAt,
                        createdAt: broadcast.createdAt,
                    },
                    summary: {
                        targeted: broadcast.totalTargeted,
                        sent: broadcast.totalSent,
                        delivered: broadcast.totalDelivered,
                        read: broadcast.totalRead,
                        clicked: broadcast.totalClicked,
                        failed: broadcast.totalFailed,
                        deliveryRate: broadcast.totalSent > 0
                            ? ((broadcast.totalDelivered / broadcast.totalSent) * 100).toFixed(1)
                            : 0,
                        openRate: broadcast.totalDelivered > 0
                            ? ((broadcast.totalRead / broadcast.totalDelivered) * 100).toFixed(1)
                            : 0,
                        clickRate: broadcast.totalRead > 0
                            ? ((broadcast.totalClicked / broadcast.totalRead) * 100).toFixed(1)
                            : 0,
                    },
                    statusBreakdown: statusCounts,
                    skipReasons,
                    jobs: broadcast.jobs.map(job => ({
                        id: job.id,
                        status: job.status,
                        startedAt: job.startedAt,
                        finishedAt: job.finishedAt,
                        duration: job.startedAt && job.finishedAt
                            ? Math.round((new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)
                            : null,
                        stats: {
                            targeted: job.totalTargeted,
                            attempted: job.totalAttempted,
                            sent: job.totalSent,
                            delivered: job.totalDelivered,
                            failed: job.totalFailed,
                        },
                        errorSummary: job.errorSummary,
                    })),
                    deliveryTimeline: deliveryTimeline.slice(0, 100), // Limit for performance
                },
            };
        }
        catch (error) {
            fastify.log.error('Error fetching broadcast report:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    });
}
//# sourceMappingURL=index.js.map