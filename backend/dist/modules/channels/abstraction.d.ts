import type { ChannelType, MessageButton } from '../../../shared/types.js';
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
    listOptions?: Array<{
        id: string;
        title: string;
        description?: string;
    }>;
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
export declare class ChannelAbstraction {
    /**
     * Send a message through any channel
     * Automatically adapts message format to channel capabilities
     */
    sendMessage(channel: ChannelType, channelId: string, userId: string, message: NormalizedMessage): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    /**
     * Get capabilities for each channel
     */
    getChannelCapabilities(channel: ChannelType): ChannelCapabilities;
    /**
     * Adapt message to channel capabilities
     * Removes unsupported features, truncates text, etc.
     */
    private adaptMessage;
    /**
     * Instagram sender
     */
    private sendInstagram;
    /**
     * Messenger sender
     */
    private sendMessenger;
    /**
     * WhatsApp sender
     */
    private sendWhatsApp;
    /**
     * Telegram sender
     */
    private sendTelegram;
    /**
     * Twitter / X sender
     */
    private sendTwitter;
    /**
     * Format Instagram message
     */
    private formatInstagramMessage;
    /**
     * Format Messenger message
     */
    private formatMessengerMessage;
    /**
     * Normalize inbound message from any channel
     */
    normalizeInboundMessage(channel: ChannelType, rawPayload: any): {
        userId: string;
        text?: string;
        media?: any;
        type: 'message' | 'postback' | 'story_mention' | 'comment';
        timestamp: Date;
    };
    private normalizeInstagramInbound;
    private normalizeMessengerInbound;
    private normalizeWhatsAppInbound;
    private normalizeTelegramInbound;
    private normalizeTwitterInbound;
}
declare const _default: ChannelAbstraction;
export default _default;
//# sourceMappingURL=abstraction.d.ts.map