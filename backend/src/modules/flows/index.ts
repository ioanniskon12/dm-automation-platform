// In-memory storage for saved flows (in production, this would be a database)
const savedFlows: any[] = [];

export default async function (fastify: any) {
  // Get all flows
  fastify.get('/', async (request: any) => {
    return { flows: savedFlows };
  });

  // Get single flow
  fastify.get('/:id', async (request: any) => {
    const { id } = request.params;
    const flow = savedFlows.find(f => f.id === id);
    if (flow) {
      return { success: true, flow };
    }
    return { success: false, error: 'Flow not found' };
  });

  // Create flow
  fastify.post('/', async (request: any) => {
    const { name, nodes, edges } = request.body;
    return {
      flow: {
        id: `flow_${Date.now()}`,
        name,
        nodes: nodes || [],
        edges: edges || []
      }
    };
  });

  // Save flow (alias for create)
  fastify.post('/save', async (request: any) => {
    const { name, nodes, edges, categories } = request.body;
    console.log('Saving flow:', name, `with ${nodes?.length || 0} nodes and ${edges?.length || 0} edges in categories:`, categories);

    // Create a single flow with all categories
    const newFlow = {
      id: `flow_${Date.now()}`,
      name,
      nodes: nodes || [],
      edges: edges || [],
      categories: categories || ['My Flows'],
      icon: '⚡',
      color: 'from-indigo-500 to-purple-500',
      description: `Custom flow: ${name}`,
      features: [
        `${nodes?.length || 0} nodes`,
        `${edges?.length || 0} connections`,
        'Custom built'
      ],
      createdAt: new Date().toISOString()
    };

    // Add to savedFlows array
    savedFlows.push(newFlow);

    return {
      success: true,
      flow: newFlow
    };
  });

  // Update flow
  fastify.put('/:id', async (request: any) => {
    const { id } = request.params;
    const { name, nodes, edges } = request.body;
    return { flow: { id, name, nodes, edges } };
  });

  // Delete flow
  fastify.delete('/:id', async (request: any) => {
    const { id } = request.params;
    const index = savedFlows.findIndex(flow => flow.id === id);
    if (index !== -1) {
      savedFlows.splice(index, 1);
    }
    return { success: true, message: 'Flow deleted', id };
  });

  // Publish flow
  fastify.post('/:id/publish', async (request: any) => {
    const { id } = request.params;
    return { flow: { id, isPublished: true } };
  });

  // Simulate flow
  fastify.post('/:id/simulate', async (request: any) => {
    const { id } = request.params;
    const { triggerData, userContext } = request.body;
    return {
      simulation: {
        flowId: id,
        steps: ['trigger', 'message', 'condition'],
        status: 'completed'
      }
    };
  });

  // Delete category from all flows
  fastify.delete('/categories/:category', async (request: any) => {
    const { category } = request.params;
    const decodedCategory = decodeURIComponent(category);

    // Update all flows to remove this category
    savedFlows.forEach(flow => {
      if (flow.categories && Array.isArray(flow.categories)) {
        flow.categories = flow.categories.filter(cat => cat !== decodedCategory);
        // If no categories left, add to "My Flows" as default
        if (flow.categories.length === 0) {
          flow.categories = ['My Flows'];
        }
      }
    });

    return {
      success: true,
      message: `Category "${decodedCategory}" deleted from all flows`,
      category: decodedCategory
    };
  });
}
