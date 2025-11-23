import { FastifyPluginAsync } from 'fastify';
import facebookSyncService from '../../services/facebook-sync.service.js';

const syncModule: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/inbox/sync
   * Manually trigger Facebook conversation sync
   */
  fastify.post('/sync', async (request, reply) => {
    try {
      // Run sync in background
      facebookSyncService.syncAllConversations().catch((error) => {
        fastify.log.error('Background sync error:', error);
      });

      return {
        success: true,
        message: 'Sync started in background',
      };
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });
};

export default syncModule;
