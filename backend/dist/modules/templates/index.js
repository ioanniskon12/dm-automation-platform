// Template flow definitions
const templateFlows = {
    'lead-qualification': {
        id: 'lead-qualification',
        name: 'Lead Qualification',
        nodes: [
            { id: '1', type: 'trigger', data: { label: 'New DM Received', triggerType: 'new_message' }, position: { x: 250, y: 50 } },
            { id: '2', type: 'ai', data: { label: 'Ask: What brings you here?', prompt: 'Ask the user what brings them to your business' }, position: { x: 250, y: 180 } },
            { id: '3', type: 'condition', data: { label: 'Interested in Product?', field: 'response', operator: 'contains', value: 'product' }, position: { x: 100, y: 350 } },
            { id: '4', type: 'action', data: { label: 'Send Product Info', actionType: 'send_message', message: 'Great! Here\'s our product information...' }, position: { x: 100, y: 500 } },
            { id: '5', type: 'action', data: { label: 'Route to Sales', actionType: 'notify_team', team: 'sales' }, position: { x: 400, y: 500 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
            { id: 'e3-5', source: '3', target: '5', label: 'No' },
        ],
    },
    'faq-automation': {
        id: 'faq-automation',
        name: 'FAQ Automation',
        nodes: [
            { id: '1', type: 'trigger', data: { label: 'New Message', triggerType: 'new_message' }, position: { x: 250, y: 50 } },
            { id: '2', type: 'ai', data: { label: 'AI Answer from Knowledge Base', prompt: 'Answer the user question using the knowledge base' }, position: { x: 250, y: 200 } },
            { id: '3', type: 'action', data: { label: 'Send AI Response', actionType: 'send_message' }, position: { x: 250, y: 350 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
        ],
    },
    'appointment-booking': {
        id: 'appointment-booking',
        name: 'Appointment Booking',
        nodes: [
            { id: '1', type: 'trigger', data: { label: 'Booking Request', triggerType: 'keyword', keyword: 'appointment' }, position: { x: 250, y: 50 } },
            { id: '2', type: 'ai', data: { label: 'Ask: Preferred Date?', prompt: 'Ask for their preferred appointment date' }, position: { x: 250, y: 180 } },
            { id: '3', type: 'ai', data: { label: 'Ask: Preferred Time?', prompt: 'Ask for their preferred time slot' }, position: { x: 250, y: 310 } },
            { id: '4', type: 'condition', data: { label: 'Slot Available?', field: 'availability', operator: 'equals', value: 'available' }, position: { x: 250, y: 440 } },
            { id: '5', type: 'action', data: { label: 'Confirm Booking', actionType: 'send_message', message: 'Appointment confirmed!' }, position: { x: 100, y: 590 } },
            { id: '6', type: 'action', data: { label: 'Send Calendar Invite', actionType: 'calendar_invite' }, position: { x: 100, y: 720 } },
            { id: '7', type: 'action', data: { label: 'Suggest Alternative', actionType: 'send_message', message: 'That slot is taken. How about...' }, position: { x: 400, y: 590 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5', label: 'Yes' },
            { id: 'e5-6', source: '5', target: '6' },
            { id: 'e4-7', source: '4', target: '7', label: 'No' },
        ],
    },
    'product-recommendations': {
        id: 'product-recommendations',
        name: 'Product Recommendations',
        nodes: [
            { id: '1', type: 'trigger', data: { label: 'Shopping Interest', triggerType: 'keyword', keyword: 'shop' }, position: { x: 250, y: 50 } },
            { id: '2', type: 'ai', data: { label: 'Ask: What are you looking for?', prompt: 'Ask about their preferences' }, position: { x: 250, y: 180 } },
            { id: '3', type: 'ai', data: { label: 'Recommend Products', prompt: 'Recommend 3 products based on their preferences' }, position: { x: 250, y: 310 } },
            { id: '4', type: 'action', data: { label: 'Show Product Catalog', actionType: 'send_message' }, position: { x: 250, y: 440 } },
            { id: '5', type: 'condition', data: { label: 'Interested?', field: 'response', operator: 'contains', value: 'yes' }, position: { x: 250, y: 570 } },
            { id: '6', type: 'action', data: { label: 'Send Order Link', actionType: 'send_message', message: 'Here\'s the link to order...' }, position: { x: 250, y: 700 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5' },
            { id: 'e5-6', source: '5', target: '6', label: 'Yes' },
        ],
    },
    'customer-support': {
        id: 'customer-support',
        name: 'Customer Support',
        nodes: [
            { id: '1', type: 'trigger', data: { label: 'Support Request', triggerType: 'keyword', keyword: 'help' }, position: { x: 250, y: 50 } },
            { id: '2', type: 'ai', data: { label: 'Understand Issue', prompt: 'Ask what issue they\'re experiencing' }, position: { x: 250, y: 180 } },
            { id: '3', type: 'ai', data: { label: 'AI Troubleshooting', prompt: 'Try to solve the issue using knowledge base' }, position: { x: 250, y: 310 } },
            { id: '4', type: 'condition', data: { label: 'Issue Resolved?', field: 'satisfaction', operator: 'equals', value: 'yes' }, position: { x: 250, y: 440 } },
            { id: '5', type: 'action', data: { label: 'Mark as Resolved', actionType: 'update_ticket', status: 'resolved' }, position: { x: 100, y: 590 } },
            { id: '6', type: 'action', data: { label: 'Escalate to Human', actionType: 'notify_team', team: 'support' }, position: { x: 400, y: 590 } },
            { id: '7', type: 'action', data: { label: 'Create Support Ticket', actionType: 'create_ticket' }, position: { x: 400, y: 720 } },
            { id: '8', type: 'action', data: { label: 'Ask for Feedback', actionType: 'send_message', message: 'Rate your experience (1-5)' }, position: { x: 100, y: 720 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5', label: 'Yes' },
            { id: 'e5-8', source: '5', target: '8' },
            { id: 'e4-6', source: '4', target: '6', label: 'No' },
            { id: 'e6-7', source: '6', target: '7' },
        ],
    },
    'feedback-collection': {
        id: 'feedback-collection',
        name: 'Feedback Collection',
        nodes: [
            { id: '1', type: 'trigger', data: { label: 'After Purchase', triggerType: 'event', event: 'purchase_complete' }, position: { x: 250, y: 50 } },
            { id: '2', type: 'action', data: { label: 'Wait 24 Hours', actionType: 'delay', duration: '24h' }, position: { x: 250, y: 180 } },
            { id: '3', type: 'ai', data: { label: 'Ask for Rating', prompt: 'Ask them to rate their experience 1-5' }, position: { x: 250, y: 310 } },
            { id: '4', type: 'ai', data: { label: 'Ask for Detailed Feedback', prompt: 'Ask what they liked or what could be improved' }, position: { x: 250, y: 440 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
        ],
    },
    'welcome-sequence': {
        id: 'welcome-sequence',
        name: 'Welcome Sequence',
        nodes: [
            { id: '1', type: 'trigger', data: { label: 'New Follower', triggerType: 'new_follower' }, position: { x: 250, y: 50 } },
            { id: '2', type: 'action', data: { label: 'Send Welcome', actionType: 'send_message', message: 'Thanks for following! 👋' }, position: { x: 250, y: 180 } },
            { id: '3', type: 'action', data: { label: 'Wait 1 Day', actionType: 'delay', duration: '1d' }, position: { x: 250, y: 310 } },
            { id: '4', type: 'action', data: { label: 'Share About Us', actionType: 'send_message', message: 'Here\'s what we do...' }, position: { x: 250, y: 440 } },
            { id: '5', type: 'action', data: { label: 'Wait 2 Days', actionType: 'delay', duration: '2d' }, position: { x: 250, y: 570 } },
            { id: '6', type: 'action', data: { label: 'Special Offer', actionType: 'send_message', message: 'As a new follower, here\'s 10% off!' }, position: { x: 250, y: 700 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5' },
            { id: 'e5-6', source: '5', target: '6' },
        ],
    },
    'abandoned-cart': {
        id: 'abandoned-cart',
        name: 'Abandoned Cart Recovery',
        nodes: [
            { id: '1', type: 'trigger', data: { label: 'Cart Abandoned', triggerType: 'event', event: 'cart_abandoned' }, position: { x: 250, y: 50 } },
            { id: '2', type: 'action', data: { label: 'Wait 1 Hour', actionType: 'delay', duration: '1h' }, position: { x: 250, y: 180 } },
            { id: '3', type: 'action', data: { label: 'Send Reminder', actionType: 'send_message', message: 'You left something in your cart!' }, position: { x: 250, y: 310 } },
            { id: '4', type: 'condition', data: { label: 'Purchased?', field: 'cart_status', operator: 'equals', value: 'completed' }, position: { x: 250, y: 440 } },
            { id: '5', type: 'action', data: { label: 'Wait 24 Hours', actionType: 'delay', duration: '24h' }, position: { x: 400, y: 570 } },
            { id: '6', type: 'action', data: { label: 'Offer 10% Discount', actionType: 'send_message', message: 'Complete your order with 10% off!' }, position: { x: 400, y: 700 } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5', label: 'No' },
            { id: 'e5-6', source: '5', target: '6' },
        ],
    },
};
export default async function (fastify) {
    // Launch a template
    fastify.post('/launch', async (request) => {
        const { templateId } = request.body;
        fastify.log.info(`Launching template: ${templateId}`);
        // For now, return success - in production, this would create a flow from a template
        return {
            success: true,
            templateId,
            flowId: `flow_${Date.now()}`,
            message: `Template ${templateId} launched successfully`
        };
    });
    // Get all templates
    fastify.get('/', async (request) => {
        const templates = [
            {
                id: 'lead-qualification',
                name: 'Lead Qualification',
                category: 'Sales',
                nodes: 5,
            },
            {
                id: 'faq-automation',
                name: 'FAQ Automation',
                category: 'Support',
                nodes: 3,
            },
            {
                id: 'appointment-booking',
                name: 'Appointment Booking',
                category: 'Sales',
                nodes: 7,
            },
            {
                id: 'product-recommendations',
                name: 'Product Recommendations',
                category: 'E-commerce',
                nodes: 6,
            },
            {
                id: 'customer-support',
                name: 'Customer Support',
                category: 'Support',
                nodes: 8,
            },
            {
                id: 'feedback-collection',
                name: 'Feedback Collection',
                category: 'Engagement',
                nodes: 4,
            },
            {
                id: 'welcome-sequence',
                name: 'Welcome Sequence',
                category: 'Engagement',
                nodes: 5,
            },
            {
                id: 'abandoned-cart',
                name: 'Abandoned Cart Recovery',
                category: 'E-commerce',
                nodes: 6,
            },
        ];
        return { templates };
    });
    // Get template by ID
    fastify.get('/:id', async (request) => {
        const { id } = request.params;
        const templateFlow = templateFlows[id];
        if (!templateFlow) {
            return {
                error: 'Template not found',
                template: {
                    id,
                    name: 'Unknown Template',
                    nodes: [],
                    edges: [],
                }
            };
        }
        return {
            success: true,
            template: templateFlow
        };
    });
}
//# sourceMappingURL=index.js.map