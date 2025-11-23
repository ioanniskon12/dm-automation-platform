// In-memory storage for bot instructions per brand (in production, this would use the database)
const brandInstructions = new Map<string, any>();

// Helper function to get or create brand instructions
const getBrandInstructions = (brandId: string) => {
  if (!brandInstructions.has(brandId)) {
    brandInstructions.set(brandId, {
      purpose: '',
      behavior: '',
      avoid: ''
    });
  }
  return brandInstructions.get(brandId);
};

export default async function (fastify: any) {
  // GET /api/bot-instructions - Fetch bot instructions
  fastify.get('/', async (request: any, reply: any) => {
    const { brandId } = request.query;

    if (!brandId) {
      return reply.code(400).send({
        success: false,
        error: 'brandId is required'
      });
    }

    console.log(`Fetching bot instructions for brand ${brandId}`);
    return {
      success: true,
      instructions: getBrandInstructions(brandId)
    };
  });

  // POST /api/bot-instructions - Save bot instructions
  fastify.post('/', async (request: any, reply: any) => {
    try {
      const { brandId } = request.query;
      const { purpose, behavior, avoid } = request.body;

      if (!brandId) {
        return reply.code(400).send({
          success: false,
          error: 'brandId is required'
        });
      }

      console.log(`Saving bot instructions for brand ${brandId}`);

      // Update instructions
      const instructions = {
        purpose: purpose || '',
        behavior: behavior || '',
        avoid: avoid || ''
      };

      brandInstructions.set(brandId, instructions);

      return {
        success: true,
        message: 'Instructions saved successfully',
        instructions: instructions
      };
    } catch (error: any) {
      console.error('Error saving instructions:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to save instructions'
      });
    }
  });

  // PUT /api/bot-instructions - Update bot instructions (alias for POST)
  fastify.put('/', async (request: any, reply: any) => {
    try {
      const { brandId } = request.query;
      const { purpose, behavior, avoid } = request.body;

      if (!brandId) {
        return reply.code(400).send({
          success: false,
          error: 'brandId is required'
        });
      }

      console.log(`Updating bot instructions for brand ${brandId}`);

      // Update instructions
      const instructions = {
        purpose: purpose || '',
        behavior: behavior || '',
        avoid: avoid || ''
      };

      brandInstructions.set(brandId, instructions);

      return {
        success: true,
        message: 'Instructions updated successfully',
        instructions: instructions
      };
    } catch (error: any) {
      console.error('Error updating instructions:', error);
      return reply.code(500).send({
        success: false,
        error: error.message || 'Failed to update instructions'
      });
    }
  });
}
