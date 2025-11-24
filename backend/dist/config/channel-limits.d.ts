export interface ChannelLimits {
    name: string;
    supportsText: boolean;
    supportsImages: boolean;
    supportsVideos: boolean;
    supportsAudio: boolean;
    supportsDocuments: boolean;
    maxTextLength?: number;
    maxFileSize: {
        image?: number;
        video?: number;
        audio?: number;
        document?: number;
    };
    supportedFormats: {
        image?: string[];
        video?: string[];
        audio?: string[];
        document?: string[];
    };
    additionalRestrictions?: string[];
}
export declare const CHANNEL_LIMITS: Record<string, ChannelLimits>;
export declare function getChannelLimits(channelType: string): ChannelLimits;
export declare function validateFileForChannel(channelType: string, fileType: 'image' | 'video' | 'audio' | 'document', fileSize: number, fileName: string): {
    valid: boolean;
    error?: string;
};
export declare function validateTextForChannel(channelType: string, text: string): {
    valid: boolean;
    error?: string;
    warning?: string;
};
//# sourceMappingURL=channel-limits.d.ts.map