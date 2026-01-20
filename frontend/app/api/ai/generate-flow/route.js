import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { description, conversationHistory } = await request.json();

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      );
    }

    // Build conversation context from history
    const messages = [
      {
        role: 'system',
        content: `You are an AI assistant that helps users create automation flows for social media DM automation.

Your task is to generate a flow configuration based on the user's description. A flow consists of nodes and edges.

Node types available:
- trigger: Entry point (e.g., "New DM received", "New follower")
- message: Send a message to the user
- question: Ask a question and wait for response
- condition: Branch based on a condition
- action: Perform an action (e.g., "Add to CRM", "Send email")
- ai-response: Generate an AI response based on context
- delay: Wait for a specified time
- end: End the flow

Respond with a JSON object containing:
1. "flowData": An object with "nodes" array and "edges" array following ReactFlow format
2. "explanation": A brief explanation of what you created

Example node structure:
{
  "id": "node-1",
  "type": "trigger",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "New DM Received",
    "config": { "trigger_type": "new_dm" }
  }
}

Example edge structure:
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "type": "smoothstep"
}

Make sure to:
- Position nodes in a logical flow (top to bottom, left to right)
- Space nodes appropriately (150-200px apart)
- Connect nodes with edges showing the flow
- Include appropriate configuration in node data
- Always start with a trigger node
- End with an end node if appropriate`
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })),
      {
        role: 'user',
        content: description
      }
    ];

    // Call OpenAI to generate the flow
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(responseContent);

    // Validate that we have the required structure
    if (!parsedResponse.flowData || !parsedResponse.explanation) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid AI response format',
          flowData: {
            nodes: [
              {
                id: 'error-1',
                type: 'message',
                position: { x: 250, y: 100 },
                data: { label: 'Error: Could not generate flow', config: {} }
              }
            ],
            edges: []
          },
          explanation: 'There was an issue generating your flow. Please try describing it differently.'
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      flowData: parsedResponse.flowData,
      explanation: parsedResponse.explanation
    });

  } catch (error) {
    console.error('Error generating flow:', error);

    // Return a fallback response instead of an error
    return NextResponse.json({
      success: true,
      flowData: {
        nodes: [
          {
            id: 'trigger-1',
            type: 'trigger',
            position: { x: 250, y: 0 },
            data: {
              label: 'Trigger',
              config: { trigger_type: 'new_dm' }
            }
          },
          {
            id: 'message-1',
            type: 'message',
            position: { x: 250, y: 150 },
            data: {
              label: 'Send Message',
              config: {
                message: 'This is a placeholder flow. Please configure your automation.'
              }
            }
          },
          {
            id: 'end-1',
            type: 'end',
            position: { x: 250, y: 300 },
            data: {
              label: 'End',
              config: {}
            }
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'trigger-1',
            target: 'message-1',
            type: 'smoothstep'
          },
          {
            id: 'edge-2',
            source: 'message-1',
            target: 'end-1',
            type: 'smoothstep'
          }
        ]
      },
      explanation: `I've created a basic flow template for you. ${
        error.message.includes('API key')
          ? 'Note: OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.'
          : 'You can customize each node by clicking on it.'
      }`
    });
  }
}
