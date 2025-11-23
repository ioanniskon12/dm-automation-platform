import type { ChannelType, MessageConfig, MessageButton } from '../../../shared/types.js';

/**
 * Channel Abstraction Layer
 * Normalizes message sending across all platforms
 * Hides platform-specific differences from the rest of the application
 */

export interface NormalizedMessage {
  text?: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
  };
  buttons?: MessageButton[];
  quickReplies?: string[];
  listOptions?: Array<{ id: string; title: string; description?: string }>;
}

export interface ChannelCapabilities {
  supportsButtons: boolean;
  supportsQuickReplies: boolean;
  supportsLists: boolean;
  supportsInlineKeyboard: boolean;
  supportsMedia: boolean;
  maxTextLength: number;
  maxButtons: number;
}

export class ChannelAbstraction {
  /**
   * Send a message through any channel
   * Automatically adapts message format to channel capabilities
   */
  async sendMessage(
    channel: ChannelType,
    channelId: string,
    userId: string,
    message: NormalizedMessage
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Get channel capabilities
      const capabilities = this.getChannelCapabilities(channel);

      // Adapt message to channel
      const adaptedMessage = this.adaptMessage(message, capabilities);

      // Route to appropriate sender
      switch (channel) {
        case 'instagram':
          return await this.sendInstagram(channelId, userId, adaptedMessage);

        case 'messenger':
          return await this.sendMessenger(channelId, userId, adaptedMessage);

        case 'whatsapp':
          return await this.sendWhatsApp(channelId, userId, adaptedMessage);

        case 'telegram':
          return await this.sendTelegram(channelId, userId, adaptedMessage);

        case 'twitter':
          return await this.sendTwitter(channelId, userId, adaptedMessage);

        default:
          return {
            success: false,
            error: `Unsupported channel: ${channel}`,
          };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get capabilities for each channel
   */
  getChannelCapabilities(channel: ChannelType): ChannelCapabilities {
    switch (channel) {
      case 'instagram':
        return {
          supportsButtons: true,
          supportsQuickReplies: true,
          supportsLists: false,
          supportsInlineKeyboard: false,
          supportsMedia: true,
          maxTextLength: 1000,
          maxButtons: 4,
        };

      case 'messenger':
        return {
          supportsButtons: true,
          supportsQuickReplies: true,
          supportsLists: true,
          supportsInlineKeyboard: false,
          supportsMedia: true,
          maxTextLength: 2000,
          maxButtons: 3,
        };

      case 'whatsapp':
        return {
          supportsButtons: true,
          supportsQuickReplies: false,
          supportsLists: true,
          supportsInlineKeyboard: false,
          supportsMedia: true,
          maxTextLength: 4096,
          maxButtons: 3,
        };

      case 'telegram':
        return {
          supportsButtons: true,
          supportsQuickReplies: false,
          supportsLists: false,
          supportsInlineKeyboard: true,
          supportsMedia: true,
          maxTextLength: 4096,
          maxButtons: 8,
        };

      case 'twitter':
        return {
          supportsButtons: true,
          supportsQuickReplies: true,
          supportsLists: false,
          supportsInlineKeyboard: false,
          supportsMedia: true,
          maxTextLength: 10000, // DM character limit
          maxButtons: 4,
        };

      default:
        return {
          supportsButtons: false,
          supportsQuickReplies: false,
          supportsLists: false,
          supportsInlineKeyboard: false,
          supportsMedia: false,
          maxTextLength: 500,
          maxButtons: 0,
        };
    }
  }

  /**
   * Adapt message to channel capabilities
   * Removes unsupported features, truncates text, etc.
   */
  private adaptMessage(
    message: NormalizedMessage,
    capabilities: ChannelCapabilities
  ): NormalizedMessage {
    const adapted: NormalizedMessage = { ...message };

    // Truncate text if needed
    if (adapted.text && adapted.text.length > capabilities.maxTextLength) {
      adapted.text = adapted.text.substring(0, capabilities.maxTextLength - 3) + '...';
    }

    // Remove buttons if not supported
    if (!capabilities.supportsButtons) {
      delete adapted.buttons;
    } else if (adapted.buttons && adapted.buttons.length > capabilities.maxButtons) {
      adapted.buttons = adapted.buttons.slice(0, capabilities.maxButtons);
    }

    // Remove quick replies if not supported
    if (!capabilities.supportsQuickReplies) {
      delete adapted.quickReplies;
    }

    // Remove lists if not supported
    if (!capabilities.supportsLists) {
      delete adapted.listOptions;
    }

    // Remove media if not supported
    if (!capabilities.supportsMedia) {
      delete adapted.media;
    }

    return adapted;
  }

  /**
   * Instagram sender
   */
  private async sendInstagram(
    channelId: string,
    userId: string,
    message: NormalizedMessage
  ): Promise<{ success: boolean; messageId?: string }> {
    // In production, call Instagram Graph API
    console.log('[Instagram] Sending message:', { channelId, userId, message });

    // Simulated for prototype
    return {
      success: true,
      messageId: `ig_${Date.now()}`,
    };

    /* Production implementation:
    const response = await axios.post(
      `https://graph.instagram.com/v18.0/${userId}/messages`,
      {
        recipient: { id: userId },
        message: this.formatInstagramMessage(message),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      success: true,
      messageId: response.data.message_id,
    };
    */
  }

  /**
   * Messenger sender
   */
  private async sendMessenger(
    channelId: string,
    userId: string,
    message: NormalizedMessage
  ): Promise<{ success: boolean; messageId?: string }> {
    console.log('[Messenger] Sending message:', { channelId, userId, message });

    return {
      success: true,
      messageId: `msg_${Date.now()}`,
    };

    /* Production implementation:
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/me/messages`,
      {
        recipient: { id: userId },
        message: this.formatMessengerMessage(message),
      },
      {
        params: { access_token: accessToken },
      }
    );

    return {
      success: true,
      messageId: response.data.message_id,
    };
    */
  }

  /**
   * WhatsApp sender
   */
  private async sendWhatsApp(
    channelId: string,
    userId: string,
    message: NormalizedMessage
  ): Promise<{ success: boolean; messageId?: string }> {
    console.log('[WhatsApp] Sending message:', { channelId, userId, message });

    return {
      success: true,
      messageId: `wa_${Date.now()}`,
    };

    /* Production implementation:
    const phoneNumberId = 'YOUR_PHONE_NUMBER_ID';
    
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: userId, // Phone number in international format
        type: 'text',
        text: {
          body: message.text,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      messageId: response.data.messages[0].id,
    };
    */
  }

  /**
   * Telegram sender
   */
  private async sendTelegram(
    channelId: string,
    userId: string,
    message: NormalizedMessage
  ): Promise<{ success: boolean; messageId?: string }> {
    console.log('[Telegram] Sending message:', { channelId, userId, message });

    return {
      success: true,
      messageId: `tg_${Date.now()}`,
    };

    /* Production implementation:
    const botToken = 'YOUR_BOT_TOKEN';
    
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: userId,
        text: message.text,
        reply_markup: message.buttons
          ? {
              inline_keyboard: [
                message.buttons.map(btn => ({
                  text: btn.text,
                  callback_data: btn.payload || btn.text,
                })),
              ],
            }
          : undefined,
      }
    );

    return {
      success: true,
      messageId: response.data.result.message_id.toString(),
    };
    */
  }

  /**
   * Twitter / X sender
   */
  private async sendTwitter(
    channelId: string,
    userId: string,
    message: NormalizedMessage
  ): Promise<{ success: boolean; messageId?: string }> {
    console.log('[Twitter] Sending message:', { channelId, userId, message });

    return {
      success: true,
      messageId: `tw_${Date.now()}`,
    };

    /* Production implementation:
    const response = await axios.post(
      `https://api.twitter.com/2/dm_conversations/with/${userId}/messages`,
      {
        text: message.text,
        attachments: message.media
          ? [
              {
                media_id: await this.uploadTwitterMedia(message.media.url),
              },
            ]
          : undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      messageId: response.data.data.dm_event_id,
    };
    */
  }

  /**
   * Format Instagram message
   */
  private formatInstagramMessage(message: NormalizedMessage): any {
    const formatted: any = {};

    if (message.text) {
      formatted.text = message.text;
    }

    if (message.buttons && message.buttons.length > 0) {
      formatted.quick_replies = message.buttons.map(btn => ({
        content_type: 'text',
        title: btn.text,
        payload: btn.payload || btn.text,
      }));
    }

    return formatted;
  }

  /**
   * Format Messenger message
   */
  private formatMessengerMessage(message: NormalizedMessage): any {
    const formatted: any = {};

    if (message.text) {
      formatted.text = message.text;
    }

    if (message.buttons && message.buttons.length > 0) {
      formatted.attachment = {
        type: 'template',
        payload: {
          template_type: 'button',
          text: message.text || 'Choose an option:',
          buttons: message.buttons.map(btn => ({
            type: btn.url ? 'web_url' : 'postback',
            title: btn.text,
            url: btn.url,
            payload: btn.payload || btn.text,
          })),
        },
      };
      delete formatted.text;
    }

    return formatted;
  }

  /**
   * Normalize inbound message from any channel
   */
  normalizeInboundMessage(channel: ChannelType, rawPayload: any): {
    userId: string;
    text?: string;
    media?: any;
    type: 'message' | 'postback' | 'story_mention' | 'comment';
    timestamp: Date;
  } {
    switch (channel) {
      case 'instagram':
        return this.normalizeInstagramInbound(rawPayload);

      case 'messenger':
        return this.normalizeMessengerInbound(rawPayload);

      case 'whatsapp':
        return this.normalizeWhatsAppInbound(rawPayload);

      case 'telegram':
        return this.normalizeTelegramInbound(rawPayload);

      case 'twitter':
        return this.normalizeTwitterInbound(rawPayload);

      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }

  private normalizeInstagramInbound(payload: any): any {
    // Parse Instagram webhook payload
    return {
      userId: payload.sender?.id || '',
      text: payload.message?.text || '',
      type: 'message',
      timestamp: new Date(payload.timestamp),
    };
  }

  private normalizeMessengerInbound(payload: any): any {
    return {
      userId: payload.sender?.id || '',
      text: payload.message?.text || '',
      type: payload.postback ? 'postback' : 'message',
      timestamp: new Date(payload.timestamp),
    };
  }

  private normalizeWhatsAppInbound(payload: any): any {
    return {
      userId: payload.from || '',
      text: payload.text?.body || '',
      type: 'message',
      timestamp: new Date(parseInt(payload.timestamp) * 1000),
    };
  }

  private normalizeTelegramInbound(payload: any): any {
    return {
      userId: payload.from?.id?.toString() || '',
      text: payload.text || '',
      type: payload.callback_query ? 'postback' : 'message',
      timestamp: new Date(payload.date * 1000),
    };
  }

  private normalizeTwitterInbound(payload: any): any {
    return {
      userId: payload.sender_id || payload.message_create?.sender_id || '',
      text: payload.message_data?.text || payload.message_create?.message_data?.text || '',
      type: 'message',
      timestamp: new Date(parseInt(payload.created_timestamp) || Date.now()),
    };
  }
}

export default new ChannelAbstraction();
