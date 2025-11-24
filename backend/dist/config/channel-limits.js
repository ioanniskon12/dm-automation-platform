// Channel-specific capabilities and limitations
// Based on official API documentation as of 2025
export const CHANNEL_LIMITS = {
    messenger: {
        name: 'Facebook Messenger',
        supportsText: true,
        supportsImages: true,
        supportsVideos: true,
        supportsAudio: true,
        supportsDocuments: true,
        maxTextLength: 2000,
        maxFileSize: {
            image: 25 * 1024 * 1024, // 25MB
            video: 25 * 1024 * 1024, // 25MB
            audio: 25 * 1024 * 1024, // 25MB
            document: 25 * 1024 * 1024, // 25MB
        },
        supportedFormats: {
            image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
            video: ['mp4', 'mov', 'avi', 'mkv'],
            audio: ['mp3', 'aac', 'm4a', 'wav', 'ogg'],
            document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        },
    },
    instagram: {
        name: 'Instagram Direct',
        supportsText: true,
        supportsImages: true,
        supportsVideos: true,
        supportsAudio: true,
        supportsDocuments: false,
        maxTextLength: 1000,
        maxFileSize: {
            image: 8 * 1024 * 1024, // 8MB
            video: 25 * 1024 * 1024, // 25MB
            audio: 25 * 1024 * 1024, // 25MB
        },
        supportedFormats: {
            image: ['jpg', 'jpeg', 'png', 'bmp', 'ico'],
            video: ['mp4', 'mov', 'ogg', 'avi', 'webm'],
            audio: ['aac', 'm4a', 'wav', 'mp4'],
        },
        additionalRestrictions: [
            'Videos limited to 15 seconds',
            'Rate limit: 200 messages per conversation per hour',
        ],
    },
    whatsapp: {
        name: 'WhatsApp Business',
        supportsText: true,
        supportsImages: true,
        supportsVideos: true,
        supportsAudio: true,
        supportsDocuments: true,
        maxTextLength: 4096,
        maxFileSize: {
            image: 5 * 1024 * 1024, // 5MB
            video: 16 * 1024 * 1024, // 16MB
            audio: 16 * 1024 * 1024, // 16MB
            document: 100 * 1024 * 1024, // 100MB
        },
        supportedFormats: {
            image: ['jpg', 'jpeg', 'png'],
            video: ['mp4', '3gpp'],
            audio: ['aac', 'mp4', 'mpeg', 'amr', 'ogg'],
            document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        },
        additionalRestrictions: [
            'Template messages required for initial contact',
            'Template media headers must be < 15MB',
        ],
    },
    telegram: {
        name: 'Telegram',
        supportsText: true,
        supportsImages: true,
        supportsVideos: true,
        supportsAudio: true,
        supportsDocuments: true,
        maxTextLength: 4096,
        maxFileSize: {
            image: 10 * 1024 * 1024, // 10MB (photo as image)
            video: 50 * 1024 * 1024, // 50MB
            audio: 50 * 1024 * 1024, // 50MB
            document: 50 * 1024 * 1024, // 50MB (standard API), 2GB with local server
        },
        supportedFormats: {
            image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
            video: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
            audio: ['mp3', 'm4a', 'ogg', 'wav'],
            document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'txt', 'any'],
        },
        additionalRestrictions: [
            'Video messages limited to 1 minute (rounded square format)',
            'Photos sent as documents can be larger (up to 50MB)',
            'Local server supports up to 2GB files',
        ],
    },
    sms: {
        name: 'SMS',
        supportsText: true,
        supportsImages: false,
        supportsVideos: false,
        supportsAudio: false,
        supportsDocuments: false,
        maxTextLength: 1600, // Standard SMS is 160 chars, but modern systems support concatenation
        maxFileSize: {},
        supportedFormats: {},
        additionalRestrictions: [
            'Text only',
            'Standard SMS: 160 characters per segment',
            'Extended SMS: Up to 1600 characters (split into multiple segments)',
            'No media support',
        ],
    },
    mms: {
        name: 'MMS',
        supportsText: true,
        supportsImages: true,
        supportsVideos: true,
        supportsAudio: true,
        supportsDocuments: false,
        maxTextLength: 1600,
        maxFileSize: {
            image: 300 * 1024, // 300KB recommended for best compatibility
            video: 300 * 1024, // 300KB recommended
            audio: 300 * 1024, // 300KB recommended
        },
        supportedFormats: {
            image: ['jpg', 'jpeg', 'png', 'gif'],
            video: ['mp4', '3gpp'],
            audio: ['mp3', 'amr', 'wav'],
        },
        additionalRestrictions: [
            'Recommended: Keep files under 300KB for best delivery',
            'Maximum supported by most carriers: 500KB-1MB',
            'Carrier-specific limits: AT&T 1MB, Verizon 1.7MB, T-Mobile 3MB',
            'Some carriers may not support MMS',
        ],
    },
};
// Helper function to get channel limits
export function getChannelLimits(channelType) {
    const limits = CHANNEL_LIMITS[channelType.toLowerCase()];
    if (!limits) {
        throw new Error(`Unsupported channel type: ${channelType}`);
    }
    return limits;
}
// Helper function to validate file for channel
export function validateFileForChannel(channelType, fileType, fileSize, fileName) {
    const limits = getChannelLimits(channelType);
    // Check if channel supports this file type
    const supportsMap = {
        image: limits.supportsImages,
        video: limits.supportsVideos,
        audio: limits.supportsAudio,
        document: limits.supportsDocuments,
    };
    if (!supportsMap[fileType]) {
        return {
            valid: false,
            error: `${limits.name} does not support ${fileType} files`,
        };
    }
    // Check file size
    const maxSize = limits.maxFileSize[fileType];
    if (maxSize && fileSize > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
        return {
            valid: false,
            error: `File size (${fileSizeMB}MB) exceeds ${limits.name} limit of ${maxSizeMB}MB for ${fileType} files`,
        };
    }
    // Check file format
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    const supportedFormats = limits.supportedFormats[fileType];
    if (supportedFormats && fileExt && !supportedFormats.includes(fileExt) && !supportedFormats.includes('any')) {
        return {
            valid: false,
            error: `File format '.${fileExt}' is not supported by ${limits.name}. Supported formats: ${supportedFormats.join(', ')}`,
        };
    }
    return { valid: true };
}
// Helper function to validate text length
export function validateTextForChannel(channelType, text) {
    const limits = getChannelLimits(channelType);
    if (!limits.supportsText) {
        return {
            valid: false,
            error: `${limits.name} does not support text messages`,
        };
    }
    if (limits.maxTextLength && text.length > limits.maxTextLength) {
        return {
            valid: false,
            error: `Text length (${text.length}) exceeds ${limits.name} limit of ${limits.maxTextLength} characters`,
        };
    }
    // Special warnings for SMS
    if (channelType.toLowerCase() === 'sms' && text.length > 160) {
        const segments = Math.ceil(text.length / 153); // After first segment, 153 chars per segment
        return {
            valid: true,
            warning: `Message will be split into ${segments} SMS segments`,
        };
    }
    return { valid: true };
}
//# sourceMappingURL=channel-limits.js.map