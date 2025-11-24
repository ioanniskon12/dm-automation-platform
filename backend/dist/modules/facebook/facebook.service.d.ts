export declare class FacebookService {
    /**
     * Get App ID from environment
     */
    private get appId();
    /**
     * Get App Secret from environment
     */
    private get appSecret();
    /**
     * Get Redirect URI from environment
     */
    private get redirectUri();
    /**
     * Generate OAuth URL for Facebook Login
     */
    getOAuthURL(state?: string): string;
    /**
     * Exchange authorization code for access token
     */
    getAccessToken(code: string): Promise<{
        access_token: string;
        token_type: string;
        expires_in?: number;
    }>;
    /**
     * Get long-lived user access token
     */
    getLongLivedToken(shortLivedToken: string): Promise<{
        access_token: string;
        token_type: string;
        expires_in: number;
    }>;
    /**
     * Get user's Facebook Pages
     */
    getUserPages(accessToken: string): Promise<any[]>;
    /**
     * Get Page Access Token (long-lived)
     */
    getPageAccessToken(pageId: string, userAccessToken: string): Promise<string>;
    /**
     * Subscribe page to webhooks
     */
    subscribePageToWebhooks(pageId: string, pageAccessToken: string): Promise<boolean>;
    /**
     * Send message via Messenger
     */
    sendMessage(pageAccessToken: string, recipientId: string, message: string): Promise<any>;
    /**
     * Send Instagram Direct Message
     */
    sendInstagramMessage(pageAccessToken: string, recipientId: string, message: string): Promise<any>;
    /**
     * Get user profile information
     */
    getUserProfile(accessToken: string): Promise<any>;
    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(signature: string, body: string): boolean;
}
declare const _default: FacebookService;
export default _default;
//# sourceMappingURL=facebook.service.d.ts.map