import { FastifyPluginAsync } from 'fastify';
import prisma from '../../lib/prisma.js';

const tagsModule: FastifyPluginAsync = async (fastify) => {
  // ============================================
  // TAG CATEGORIES
  // ============================================

  // Get all tag categories for a workspace
  fastify.get('/categories/:workspaceId', async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };

    try {
      const categories = await prisma.tagCategory.findMany({
        where: { workspaceId },
        include: {
          tags: true,
        },
        orderBy: { name: 'asc' },
      });

      return { success: true, categories };
    } catch (error: any) {
      fastify.log.error('Error fetching tag categories:', error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Create a new tag category
  fastify.post('/categories', async (request, reply) => {
    const { workspaceId, name, color } = request.body as {
      workspaceId: string;
      name: string;
      color?: string;
    };

    if (!workspaceId || !name) {
      return reply.status(400).send({ success: false, error: 'workspaceId and name are required' });
    }

    try {
      // Check if category already exists
      const existing = await prisma.tagCategory.findUnique({
        where: {
          workspaceId_name: { workspaceId, name },
        },
      });

      if (existing) {
        return reply.status(400).send({ success: false, error: 'Category already exists' });
      }

      const category = await prisma.tagCategory.create({
        data: {
          workspaceId,
          name,
          color: color || '#6366f1',
        },
      });

      return { success: true, category };
    } catch (error: any) {
      fastify.log.error('Error creating tag category:', error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update a tag category
  fastify.put('/categories/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, color } = request.body as { name?: string; color?: string };

    try {
      const category = await prisma.tagCategory.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(color && { color }),
        },
      });

      return { success: true, category };
    } catch (error: any) {
      fastify.log.error('Error updating tag category:', error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete a tag category
  fastify.delete('/categories/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.tagCategory.delete({
        where: { id },
      });

      return { success: true };
    } catch (error: any) {
      fastify.log.error('Error deleting tag category:', error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // ============================================
  // TAGS
  // ============================================

  // Get all tags for a workspace
  fastify.get('/:workspaceId', async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };

    try {
      const tags = await prisma.tag.findMany({
        where: { workspaceId },
        include: {
          category: true,
        },
        orderBy: [
          { category: { name: 'asc' } },
          { name: 'asc' },
        ],
      });

      return { success: true, tags };
    } catch (error: any) {
      fastify.log.error('Error fetching tags:', error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Create a new tag
  fastify.post('/', async (request, reply) => {
    const { workspaceId, name, categoryId, color } = request.body as {
      workspaceId: string;
      name: string;
      categoryId?: string;
      color?: string;
    };

    if (!workspaceId || !name) {
      return reply.status(400).send({ success: false, error: 'workspaceId and name are required' });
    }

    try {
      // Check if tag already exists
      const existing = await prisma.tag.findUnique({
        where: {
          workspaceId_name: { workspaceId, name },
        },
      });

      if (existing) {
        return reply.status(400).send({ success: false, error: 'Tag already exists' });
      }

      const tag = await prisma.tag.create({
        data: {
          workspaceId,
          name,
          categoryId: categoryId || null,
          color: color || '#8b5cf6',
        },
        include: {
          category: true,
        },
      });

      return { success: true, tag };
    } catch (error: any) {
      fastify.log.error('Error creating tag:', error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update a tag
  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, categoryId, color } = request.body as {
      name?: string;
      categoryId?: string | null;
      color?: string;
    };

    try {
      const tag = await prisma.tag.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(categoryId !== undefined && { categoryId }),
          ...(color && { color }),
        },
        include: {
          category: true,
        },
      });

      return { success: true, tag };
    } catch (error: any) {
      fastify.log.error('Error updating tag:', error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete a tag
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.tag.delete({
        where: { id },
      });

      return { success: true };
    } catch (error: any) {
      fastify.log.error('Error deleting tag:', error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
};

export default tagsModule;
