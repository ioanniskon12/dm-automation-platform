import prisma from '../../lib/prisma.js';

const CHANNEL_TYPES = ['instagram', 'facebook', 'whatsapp', 'telegram', 'sms', 'tiktok'];

// Helper: build the brand response shape the frontend expects
function buildBrand(workspace: any, channels: any[]) {
  const settings = (() => {
    try { return JSON.parse(workspace.settings || '{}'); } catch { return {}; }
  })();

  // Build full channel list (all types), merging connected ones from DB
  const channelMap = new Map(channels.map((ch: any) => [ch.type, ch]));
  const allChannels = CHANNEL_TYPES.map((type, i) => {
    const ch = channelMap.get(type);
    return {
      id: ch ? ch.id : `${workspace.id}-ch-${type}`,
      type,
      status: ch ? ch.status : 'disconnected',
      accountName: ch ? (JSON.parse(ch.meta || '{}').username || ch.externalId || null) : null,
      connectedAt: ch ? ch.updatedAt?.toISOString() : null,
    };
  });

  return {
    id: workspace.id,
    name: workspace.name,
    avatar: settings.avatar || null,
    userId: 'demo-user',
    createdAt: workspace.createdAt.toISOString(),
    channels: allChannels,
  };
}

export default async function brandsModule(fastify: any) {
  // GET /api/brands - list all brands
  fastify.get('/', async (_req: any, reply: any) => {
    try {
      const workspaces = await prisma.workspace.findMany({
        include: { channels: true },
        orderBy: { createdAt: 'asc' },
      });
      const brands = workspaces.map((ws: any) => buildBrand(ws, ws.channels));
      return reply.send({ success: true, brands });
    } catch (error: any) {
      fastify.log.error('Error fetching brands:', error);
      return reply.status(500).send({ success: false, error: 'Failed to fetch brands' });
    }
  });

  // POST /api/brands - create a brand (= workspace)
  fastify.post('/', async (request: any, reply: any) => {
    const { name, avatar } = request.body || {};

    if (!name?.trim()) {
      return reply.status(400).send({ success: false, error: 'Brand name is required' });
    }

    try {
      const settings = JSON.stringify({ avatar: avatar || null });
      const workspace = await prisma.workspace.create({
        data: { name: name.trim(), settings },
        include: { channels: true },
      });
      return reply.status(201).send({ success: true, brand: buildBrand(workspace, workspace.channels) });
    } catch (error: any) {
      fastify.log.error('Error creating brand:', error);
      return reply.status(500).send({ success: false, error: 'Failed to create brand' });
    }
  });

  // GET /api/brands/:id
  fastify.get('/:id', async (request: any, reply: any) => {
    const { id } = request.params;
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id },
        include: { channels: true },
      });
      if (!workspace) return reply.status(404).send({ success: false, error: 'Brand not found' });
      return reply.send({ success: true, brand: buildBrand(workspace, workspace.channels) });
    } catch (error: any) {
      fastify.log.error('Error fetching brand:', error);
      return reply.status(500).send({ success: false, error: 'Failed to fetch brand' });
    }
  });

  // PUT /api/brands/:id - update brand
  fastify.put('/:id', async (request: any, reply: any) => {
    const { id } = request.params;
    const { name, avatar } = request.body || {};

    try {
      const existing = await prisma.workspace.findUnique({ where: { id } });
      if (!existing) return reply.status(404).send({ success: false, error: 'Brand not found' });

      const existingSettings = (() => {
        try { return JSON.parse(existing.settings || '{}'); } catch { return {}; }
      })();

      const updatedSettings = JSON.stringify({
        ...existingSettings,
        ...(avatar !== undefined ? { avatar } : {}),
      });

      const workspace = await prisma.workspace.update({
        where: { id },
        data: {
          ...(name?.trim() ? { name: name.trim() } : {}),
          settings: updatedSettings,
        },
        include: { channels: true },
      });

      return reply.send({ success: true, brand: buildBrand(workspace, workspace.channels) });
    } catch (error: any) {
      fastify.log.error('Error updating brand:', error);
      return reply.status(500).send({ success: false, error: 'Failed to update brand' });
    }
  });

  // DELETE /api/brands/:id
  fastify.delete('/:id', async (request: any, reply: any) => {
    const { id } = request.params;
    try {
      const existing = await prisma.workspace.findUnique({ where: { id } });
      if (!existing) return reply.status(404).send({ success: false, error: 'Brand not found' });
      await prisma.workspace.delete({ where: { id } });
      return reply.send({ success: true, message: 'Brand deleted successfully' });
    } catch (error: any) {
      fastify.log.error('Error deleting brand:', error);
      return reply.status(500).send({ success: false, error: 'Failed to delete brand' });
    }
  });

  // GET /api/brands/:id/channels
  fastify.get('/:id/channels', async (request: any, reply: any) => {
    const { id } = request.params;
    try {
      const workspace = await prisma.workspace.findUnique({
        where: { id },
        include: { channels: true },
      });
      if (!workspace) return reply.status(404).send({ success: false, error: 'Brand not found' });
      const brand = buildBrand(workspace, workspace.channels);
      return reply.send({ success: true, brand: { id: brand.id, name: brand.name }, channels: brand.channels });
    } catch (error: any) {
      fastify.log.error('Error fetching channels:', error);
      return reply.status(500).send({ success: false, error: 'Failed to fetch channels' });
    }
  });

  // POST /api/brands/:id/channels - connect a channel
  fastify.post('/:id/channels', async (request: any, reply: any) => {
    const { id } = request.params;
    const { channelType, accountName } = request.body || {};

    if (!channelType) {
      return reply.status(400).send({ success: false, error: 'Channel type is required' });
    }

    try {
      const workspace = await prisma.workspace.findUnique({ where: { id } });
      if (!workspace) return reply.status(404).send({ success: false, error: 'Brand not found' });

      const existing = await prisma.channel.findFirst({
        where: { workspaceId: id, type: channelType },
      });

      let channel;
      if (existing) {
        channel = await prisma.channel.update({
          where: { id: existing.id },
          data: {
            status: 'connected',
            externalId: accountName || existing.externalId,
            meta: JSON.stringify({ username: accountName || channelType }),
          },
        });
      } else {
        channel = await prisma.channel.create({
          data: {
            workspaceId: id,
            type: channelType,
            externalId: accountName || `${channelType}_account`,
            status: 'connected',
            meta: JSON.stringify({ username: accountName || channelType }),
          },
        });
      }

      return reply.send({
        success: true,
        channel: {
          id: channel.id,
          type: channel.type,
          status: channel.status,
          accountName: accountName || null,
          connectedAt: channel.updatedAt?.toISOString(),
        },
      });
    } catch (error: any) {
      fastify.log.error('Error connecting channel:', error);
      return reply.status(500).send({ success: false, error: 'Failed to connect channel' });
    }
  });

  // DELETE /api/brands/:id/channels - disconnect a channel
  fastify.delete('/:id/channels', async (request: any, reply: any) => {
    const { id } = request.params;
    const { channelId, channelType } = request.body || {};

    try {
      const where: any = { workspaceId: id };
      if (channelId) where.id = channelId;
      else if (channelType) where.type = channelType;
      else return reply.status(400).send({ success: false, error: 'channelId or channelType required' });

      await prisma.channel.updateMany({
        where,
        data: {
          status: 'disconnected',
          meta: JSON.stringify({ username: null }),
        },
      });

      return reply.send({ success: true, message: 'Channel disconnected' });
    } catch (error: any) {
      fastify.log.error('Error disconnecting channel:', error);
      return reply.status(500).send({ success: false, error: 'Failed to disconnect channel' });
    }
  });
}
