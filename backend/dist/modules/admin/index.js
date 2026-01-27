import prisma from '../../lib/prisma.js';
// Admin emails that can access admin routes
const ADMIN_EMAILS = [
    'gianniskon12@gmail.com',
    'sotiris040197@gmail.com',
];
const adminModule = async (fastify) => {
    // Middleware to check if user is admin
    const requireAdmin = async (request, reply) => {
        try {
            await request.jwtVerify();
            const { email } = request.user;
            if (!ADMIN_EMAILS.includes(email)) {
                return reply.status(403).send({
                    success: false,
                    error: 'Admin access required',
                });
            }
        }
        catch (error) {
            return reply.status(401).send({
                success: false,
                error: 'Authentication required',
            });
        }
    };
    // ============================================
    // GET ALL USERS
    // ============================================
    fastify.get('/users', { preHandler: requireAdmin }, async (request, reply) => {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    workspaces: {
                        include: {
                            workspace: {
                                select: {
                                    id: true,
                                    name: true,
                                    plan: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            // Transform data for frontend
            const transformedUsers = users.map((user) => ({
                id: user.id,
                email: user.email,
                name: user.name,
                status: user.status || 'active',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                workspace: user.workspaces[0]?.workspace?.name || 'No workspace',
                plan: user.workspaces[0]?.workspace?.plan || 'free',
            }));
            return reply.send({
                success: true,
                users: transformedUsers,
            });
        }
        catch (error) {
            fastify.log.error('Error fetching users:', error);
            return reply.status(500).send({
                success: false,
                error: 'Failed to fetch users',
            });
        }
    });
    // ============================================
    // GET SINGLE USER
    // ============================================
    fastify.get('/users/:id', { preHandler: requireAdmin }, async (request, reply) => {
        const { id } = request.params;
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    workspaces: {
                        include: {
                            workspace: {
                                include: {
                                    channels: true,
                                    flows: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'User not found',
                });
            }
            const workspace = user.workspaces[0]?.workspace;
            return reply.send({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    status: user.status || 'active',
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    workspace: workspace?.name || 'No workspace',
                    plan: workspace?.plan || 'free',
                    channelsCount: workspace?.channels?.length || 0,
                    flowsCount: workspace?.flows?.length || 0,
                    integrations: workspace?.channels?.map((c) => c.type) || [],
                },
            });
        }
        catch (error) {
            fastify.log.error('Error fetching user:', error);
            return reply.status(500).send({
                success: false,
                error: 'Failed to fetch user',
            });
        }
    });
    // ============================================
    // UPDATE USER STATUS (block, suspend, activate)
    // ============================================
    fastify.patch('/users/:id/status', { preHandler: requireAdmin }, async (request, reply) => {
        const { id } = request.params;
        const { status } = request.body;
        if (!['active', 'blocked', 'suspended'].includes(status)) {
            return reply.status(400).send({
                success: false,
                error: 'Invalid status. Must be: active, blocked, or suspended',
            });
        }
        try {
            const user = await prisma.user.update({
                where: { id },
                data: { status },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                },
            });
            return reply.send({
                success: true,
                message: `User ${status === 'active' ? 'activated' : status} successfully`,
                user,
            });
        }
        catch (error) {
            fastify.log.error('Error updating user status:', error);
            return reply.status(500).send({
                success: false,
                error: 'Failed to update user status',
            });
        }
    });
    // ============================================
    // DELETE USER
    // ============================================
    fastify.delete('/users/:id', { preHandler: requireAdmin }, async (request, reply) => {
        const { id } = request.params;
        try {
            // Check if user exists
            const user = await prisma.user.findUnique({
                where: { id },
            });
            if (!user) {
                return reply.status(404).send({
                    success: false,
                    error: 'User not found',
                });
            }
            // Don't allow deleting admin users
            if (ADMIN_EMAILS.includes(user.email)) {
                return reply.status(403).send({
                    success: false,
                    error: 'Cannot delete admin users',
                });
            }
            // Delete user (cascades to workspace members)
            await prisma.user.delete({
                where: { id },
            });
            return reply.send({
                success: true,
                message: 'User deleted successfully',
            });
        }
        catch (error) {
            fastify.log.error('Error deleting user:', error);
            return reply.status(500).send({
                success: false,
                error: 'Failed to delete user',
            });
        }
    });
    // ============================================
    // GET ADMIN STATS
    // ============================================
    fastify.get('/stats', { preHandler: requireAdmin }, async (request, reply) => {
        try {
            const [totalUsers, activeUsers, blockedUsers, totalWorkspaces, totalFlows, totalChannels,] = await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { status: 'active' } }),
                prisma.user.count({ where: { status: 'blocked' } }),
                prisma.workspace.count(),
                prisma.flow.count(),
                prisma.channel.count(),
            ]);
            return reply.send({
                success: true,
                stats: {
                    totalUsers,
                    activeUsers,
                    blockedUsers,
                    totalWorkspaces,
                    totalFlows,
                    totalChannels,
                },
            });
        }
        catch (error) {
            fastify.log.error('Error fetching stats:', error);
            return reply.status(500).send({
                success: false,
                error: 'Failed to fetch stats',
            });
        }
    });
};
export default adminModule;
//# sourceMappingURL=index.js.map