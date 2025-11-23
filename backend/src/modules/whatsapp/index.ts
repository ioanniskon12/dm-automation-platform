export default async function (fastify: any) {
  fastify.get('/templates', async () => ({ templates: [] }));
  fastify.post('/templates', async (request: any) => ({ template: { id: `tpl_${Date.now()}` } }));
}
