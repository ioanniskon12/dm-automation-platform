export default async function (fastify) {
    fastify.get('/templates', async () => ({ templates: [] }));
    fastify.post('/templates', async (request) => ({ template: { id: `tpl_${Date.now()}` } }));
}
//# sourceMappingURL=index.js.map