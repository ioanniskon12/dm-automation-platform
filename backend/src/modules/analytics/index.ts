export default async function (fastify: any) {
  fastify.get('/workspace', async () => ({ mau: 0, messagesSent: 0 }));
  fastify.get('/flow/:id', async () => ({ entries: 0, completions: 0 }));
}
