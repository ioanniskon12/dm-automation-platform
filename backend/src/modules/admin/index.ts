import { FastifyPluginAsync } from 'fastify';
import prisma from '../../lib/prisma.js';

// Admin emails from environment variable or fallback to hardcoded list
// Format: ADMIN_EMAILS=email1@example.com,email2@example.com
const getAdminEmails = (): string[] => {
  const envEmails = process.env.ADMIN_EMAILS;
  if (envEmails) {
    return envEmails.split(',').map((e) => e.trim().toLowerCase());
  }
  // Fallback to hardcoded admins
  return [
    'gianniskon12@gmail.com',
    'sotiris040197@gmail.com',
  ];
};

const adminModule: FastifyPluginAsync = async (fastify) => {
  // Middleware to check if user is admin - ALWAYS requires authentication
  const requireAdmin = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
      const { email } = request.user as { email: string };
      const adminEmails = getAdminEmails();

      if (!adminEmails.includes(email.toLowerCase())) {
        fastify.log.warn(`Admin access denied for: ${email}`);
        return reply.status(403).send({
          success: false,
          error: 'Admin access required',
        });
      }

      fastify.log.info(`Admin access granted for: ${email}`);
    } catch (error) {
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
    } catch (error: any) {
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
    const { id } = request.params as { id: string };

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
          integrations: workspace?.channels?.map((c: any) => c.type) || [],
        },
      });
    } catch (error: any) {
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
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };

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
    } catch (error: any) {
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
    const { id } = request.params as { id: string };

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
      const adminEmails = getAdminEmails();
      if (adminEmails.includes(user.email.toLowerCase())) {
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
    } catch (error: any) {
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
      const [
        totalUsers,
        activeUsers,
        blockedUsers,
        totalWorkspaces,
        totalFlows,
        totalChannels,
      ] = await Promise.all([
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
    } catch (error: any) {
      fastify.log.error('Error fetching stats:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch stats',
      });
    }
  });
};

export default adminModule;
