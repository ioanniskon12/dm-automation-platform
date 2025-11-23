export default async function (fastify: any) {
  fastify.post('/check', async (request: any) => ({ allowed: true }));
}
