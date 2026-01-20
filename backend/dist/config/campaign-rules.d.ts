/**
 * Channel-specific campaign rules and constraints
 * Based on platform requirements for WhatsApp, Messenger, Instagram, and SMS
 */
export interface ChannelCampaignRules {
    id: string;
    name: string;
    icon: string;
    color: string;
    hasMessagingWindow: boolean;
    messagingWindowHours: number;
    requiresTemplateApproval: boolean;
    templateCategories?: string[];
    rateLimit: {
        messagesPerHour: number;
        messagesPerDay: number;
        broadcastLimit?: number;
    };
    messageConstraints: {
        maxLength: number;
        supportsMedia: boolean;
        supportedMediaTypes: string[];
        maxMediaSize: number;
        supportsButtons: boolean;
        maxButtons: number;
        supportsCarousel: boolean;
    };
    compliance: {
        requiresOptIn: boolean;
        requiresOptOutOption: boolean;
        optOutKeywords: string[];
        restrictedHours?: {
            start: number;
            end: number;
        };
        requiresBusinessVerification: boolean;
    };
    supportedCampaignTypes: ('evergreen' | 'broadcast')[];
    features: {
        supportsScheduledMessages: boolean;
        supportsMessageTags: boolean;
        messageTags?: string[];
        supportsSponsoredMessages: boolean;
        supportsRecurringNotifications: boolean;
    };
    warnings: string[];
}
export declare const CHANNEL_CAMPAIGN_RULES: Record<string, ChannelCampaignRules>;
/**
 * Get campaign rules for a specific channel
 */
export declare const getChannelRules: (channelType: string) => ChannelCampaignRules | null;
/**
 * Check if a campaign type is supported by a channel
 */
export declare const isCampaignTypeSupported: (channelType: string, campaignType: "evergreen" | "broadcast") => boolean;
/**
 * Validate message content against channel constraints
 */
export declare const validateMessageForChannel: (channelType: string, message: {
    content: string;
    mediaUrl?: string;
    mediaType?: string;
    buttons?: any[];
}) => {
    valid: boolean;
    errors: string[];
};
export default CHANNEL_CAMPAIGN_RULES;
//# sourceMappingURL=campaign-rules.d.ts.map