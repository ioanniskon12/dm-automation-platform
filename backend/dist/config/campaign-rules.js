/**
 * Channel-specific campaign rules and constraints
 * Based on platform requirements for WhatsApp, Messenger, Instagram, and SMS
 */
export const CHANNEL_CAMPAIGN_RULES = {
    whatsapp: {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'whatsapp',
        color: '#25D366',
        hasMessagingWindow: true,
        messagingWindowHours: 24,
        requiresTemplateApproval: true,
        templateCategories: ['marketing', 'utility', 'authentication'],
        rateLimit: {
            messagesPerHour: 1000,
            messagesPerDay: 1000, // Tier 1, increases with trust
            broadcastLimit: 1000, // Per 24 hours, tier-based
        },
        messageConstraints: {
            maxLength: 4096,
            supportsMedia: true,
            supportedMediaTypes: ['image', 'video', 'document', 'audio'],
            maxMediaSize: 16, // 16MB for documents, 5MB for images
            supportsButtons: true,
            maxButtons: 3,
            supportsCarousel: false,
        },
        compliance: {
            requiresOptIn: true,
            requiresOptOutOption: true,
            optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'CANCEL'],
            requiresBusinessVerification: true,
        },
        supportedCampaignTypes: ['evergreen', 'broadcast'],
        features: {
            supportsScheduledMessages: true,
            supportsMessageTags: false,
            supportsSponsoredMessages: false,
            supportsRecurringNotifications: false,
        },
        warnings: [
            'Messages outside 24-hour window require pre-approved templates',
            'Template messages are charged per message (as of July 2025)',
            'Quality rating affects delivery - maintain good engagement',
            'Max 2 marketing messages without reply before throttling',
        ],
    },
    messenger: {
        id: 'messenger',
        name: 'Messenger',
        icon: 'messenger',
        color: '#0084FF',
        hasMessagingWindow: true,
        messagingWindowHours: 24,
        requiresTemplateApproval: false,
        rateLimit: {
            messagesPerHour: 250,
            messagesPerDay: 5000,
        },
        messageConstraints: {
            maxLength: 2000,
            supportsMedia: true,
            supportedMediaTypes: ['image', 'video', 'audio', 'file'],
            maxMediaSize: 25,
            supportsButtons: true,
            maxButtons: 3,
            supportsCarousel: true,
        },
        compliance: {
            requiresOptIn: true,
            requiresOptOutOption: true,
            optOutKeywords: ['STOP', 'UNSUBSCRIBE'],
            requiresBusinessVerification: false,
        },
        supportedCampaignTypes: ['evergreen', 'broadcast'],
        features: {
            supportsScheduledMessages: true,
            supportsMessageTags: true,
            messageTags: [
                'CONFIRMED_EVENT_UPDATE',
                'POST_PURCHASE_UPDATE',
                'ACCOUNT_UPDATE',
                'HUMAN_AGENT',
            ],
            supportsSponsoredMessages: true,
            supportsRecurringNotifications: true,
        },
        warnings: [
            'Promotional messages only within 24-hour window',
            'Message tags for non-promotional updates only',
            'Sponsored messages require ad spend (~$20-40/1000)',
            'Recurring notifications require explicit opt-in',
        ],
    },
    instagram: {
        id: 'instagram',
        name: 'Instagram',
        icon: 'instagram',
        color: '#E4405F',
        hasMessagingWindow: true,
        messagingWindowHours: 24,
        requiresTemplateApproval: false,
        rateLimit: {
            messagesPerHour: 200, // Reduced from 5000 in 2024
            messagesPerDay: 1000,
        },
        messageConstraints: {
            maxLength: 1000,
            supportsMedia: true,
            supportedMediaTypes: ['image', 'video'],
            maxMediaSize: 8,
            supportsButtons: true,
            maxButtons: 3,
            supportsCarousel: false,
        },
        compliance: {
            requiresOptIn: true,
            requiresOptOutOption: true,
            optOutKeywords: ['STOP', 'UNSUBSCRIBE'],
            requiresBusinessVerification: false,
        },
        supportedCampaignTypes: ['evergreen', 'broadcast'],
        features: {
            supportsScheduledMessages: true,
            supportsMessageTags: true,
            messageTags: ['HUMAN_AGENT'],
            supportsSponsoredMessages: false,
            supportsRecurringNotifications: false,
        },
        warnings: [
            'Strict 200 DMs/hour rate limit (reduced in 2024)',
            'Can only broadcast to users who engaged in last 24 hours',
            'No bulk uploads - users must engage first',
            'Business account required for API access',
        ],
    },
    sms: {
        id: 'sms',
        name: 'SMS',
        icon: 'sms',
        color: '#4CAF50',
        hasMessagingWindow: false,
        messagingWindowHours: 0,
        requiresTemplateApproval: false, // But 10DLC campaign registration required
        rateLimit: {
            messagesPerHour: 3600, // Varies by 10DLC trust score
            messagesPerDay: 50000,
        },
        messageConstraints: {
            maxLength: 160, // Standard SMS, 70 for unicode
            supportsMedia: true, // MMS
            supportedMediaTypes: ['image', 'video'],
            maxMediaSize: 5,
            supportsButtons: false,
            maxButtons: 0,
            supportsCarousel: false,
        },
        compliance: {
            requiresOptIn: true,
            requiresOptOutOption: true,
            optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'],
            restrictedHours: { start: 8, end: 21 }, // 8 AM - 9 PM local time
            requiresBusinessVerification: true, // 10DLC registration
        },
        supportedCampaignTypes: ['evergreen', 'broadcast'],
        features: {
            supportsScheduledMessages: true,
            supportsMessageTags: false,
            supportsSponsoredMessages: false,
            supportsRecurringNotifications: false,
        },
        warnings: [
            '10DLC registration mandatory (since Feb 2025)',
            'TCPA: Written opt-in consent required',
            'One-to-one consent rule (Jan 2025)',
            'No messages before 8 AM or after 9 PM local time',
            'Fines: $500-$1,500 per violation',
            'Must include opt-out instructions',
        ],
    },
    telegram: {
        id: 'telegram',
        name: 'Telegram',
        icon: 'telegram',
        color: '#0088CC',
        hasMessagingWindow: false, // Telegram is more permissive
        messagingWindowHours: 0,
        requiresTemplateApproval: false,
        rateLimit: {
            messagesPerHour: 30, // Per user, to avoid spam
            messagesPerDay: 50, // Per user
            broadcastLimit: 30, // Messages per second to different users
        },
        messageConstraints: {
            maxLength: 4096,
            supportsMedia: true,
            supportedMediaTypes: ['image', 'video', 'audio', 'document', 'sticker'],
            maxMediaSize: 50, // 50MB for most files, 2GB for documents
            supportsButtons: true,
            maxButtons: 8, // Inline keyboard
            supportsCarousel: false,
        },
        compliance: {
            requiresOptIn: true, // User must start chat with bot
            requiresOptOutOption: true,
            optOutKeywords: ['/stop', '/unsubscribe'],
            requiresBusinessVerification: false,
        },
        supportedCampaignTypes: ['evergreen', 'broadcast'],
        features: {
            supportsScheduledMessages: true,
            supportsMessageTags: false,
            supportsSponsoredMessages: false,
            supportsRecurringNotifications: true,
        },
        warnings: [
            'Users must initiate chat with your bot first',
            'Respect rate limits to avoid bot blocking',
            'Group broadcasts limited to 30 messages/second',
        ],
    },
};
/**
 * Get campaign rules for a specific channel
 */
export const getChannelRules = (channelType) => {
    return CHANNEL_CAMPAIGN_RULES[channelType] || null;
};
/**
 * Check if a campaign type is supported by a channel
 */
export const isCampaignTypeSupported = (channelType, campaignType) => {
    const rules = getChannelRules(channelType);
    return rules?.supportedCampaignTypes.includes(campaignType) ?? false;
};
/**
 * Validate message content against channel constraints
 */
export const validateMessageForChannel = (channelType, message) => {
    const rules = getChannelRules(channelType);
    const errors = [];
    if (!rules) {
        return { valid: false, errors: ['Unknown channel type'] };
    }
    // Check message length
    if (message.content.length > rules.messageConstraints.maxLength) {
        errors.push(`Message exceeds ${rules.messageConstraints.maxLength} character limit for ${rules.name}`);
    }
    // Check media support
    if (message.mediaUrl && !rules.messageConstraints.supportsMedia) {
        errors.push(`${rules.name} does not support media attachments`);
    }
    // Check media type
    if (message.mediaType && !rules.messageConstraints.supportedMediaTypes.includes(message.mediaType)) {
        errors.push(`${rules.name} does not support ${message.mediaType}. Supported: ${rules.messageConstraints.supportedMediaTypes.join(', ')}`);
    }
    // Check buttons
    if (message.buttons && message.buttons.length > 0) {
        if (!rules.messageConstraints.supportsButtons) {
            errors.push(`${rules.name} does not support buttons`);
        }
        else if (message.buttons.length > rules.messageConstraints.maxButtons) {
            errors.push(`${rules.name} supports max ${rules.messageConstraints.maxButtons} buttons`);
        }
    }
    return { valid: errors.length === 0, errors };
};
export default CHANNEL_CAMPAIGN_RULES;
//# sourceMappingURL=campaign-rules.js.map