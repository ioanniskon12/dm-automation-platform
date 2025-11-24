export declare class FacebookSyncService {
    private stats;
    /**
     * Sync all conversations from Facebook Messenger
     * This fetches all conversations including message requests
     */
    syncAllConversations(): Promise<void>;
    private printSummary;
    /**
     * Sync conversations for a specific channel
     */
    private syncChannelConversations;
    /**
     * Process a single conversation
     */
    private processConversation;
}
declare const _default: FacebookSyncService;
export default _default;
//# sourceMappingURL=facebook-sync.service.d.ts.map