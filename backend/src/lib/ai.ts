import OpenAI from 'openai';

export class AIService {
  private client: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  async processMessage(text: string, config: any, context: Record<string, any>): Promise<{text: string}> {
    if (!this.client) {
      return { text };
    }

    // Process with AI based on config.type
    switch (config.type) {
      case 'answer':
        return { text: await this.answer(text, config.scopeDocs, config.prompt) };
      case 'rewrite':
        return { text: await this.rewrite(text, config.prompt) };
      case 'classify':
        // Return classification, but for simplicity return original text
        return { text };
      default:
        return { text };
    }
  }

  private async answer(query: string, scopeDocs?: string[], prompt?: string): Promise<string> {
    if (!this.client) return query;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt || 'You are a helpful assistant.' },
        { role: 'user', content: query },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || query;
  }

  private async rewrite(text: string, prompt?: string): Promise<string> {
    if (!this.client) return text;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: prompt || 'Rewrite the following text to be more professional.' },
        { role: 'user', content: text },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content || text;
  }

  async extractField(text: string, fieldType: string): Promise<any> {
    if (!this.client) return text;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: `Extract ${fieldType} from the text. Return ONLY the extracted value, nothing else.` 
        },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
    });

    return completion.choices[0].message.content;
  }
}

export default new AIService();
