import type { PolicyContext, PolicyDecision, ChannelType } from '../../../shared/types.js';
/**
 * Compliance Engine
 * Enforces platform-specific messaging policies and provides fallback strategies
 */
export declare class ComplianceEngine {
    private messageCounts;
    /**
     * Check if a message can be sent according to channel policies
     */
    checkPolicy(context: PolicyContext, messageType: 'message' | 'template'): Promise<PolicyDecision>;
    /**
     * Instagram Policy:
     * - Can only send messages within 24 hours of last user message
     * - Only one private reply per comment
     * - Must be follower for story replies
     */
    private checkInstagramPolicy;
    /**
     * Facebook Messenger Policy:
     * - Can send messages within 24 hours of last user message
     * - After 24h, can only send certain message tags (shipping updates, etc.)
     */
    private checkMessengerPolicy;
    /**
     * WhatsApp Policy:
     * - Can send free-form messages within 24 hours of last user message
     * - After 24h, MUST use approved message templates
     * - Templates have category restrictions (marketing, utility, auth)
     */
    private checkWhatsAppPolicy;
    /**
     * Telegram Policy:
     * - Rate limits: 30 messages/second per bot
     * - Group rate limit: 20 messages/minute
     * - No 24-hour restrictions (more flexible)
     */
    private checkTelegramPolicy;
    /**
     * Twitter / X Policy:
     * - Rate limits: 1,000 DMs per day per user
     * - No 24-hour window restrictions
     * - Relaxed policies compared to Instagram/Messenger
     */
    private checkTwitterPolicy;
    /**
     * Get hours since a date
     */
    private getHoursSince;
    /**
     * Rate limiting logic
     */
    private getRateLimit;
    /**
     * Get policy status for UI display
     */
    getPolicyStatus(context: PolicyContext): Promise<{
        canSend: boolean;
        reason?: string;
        suggestedAction?: string;
        timeRemaining?: number;
    }>;
    /**
     * Validate WhatsApp template before sending
     */
    validateWhatsAppTemplate(template: any, variables: Record<string, string>): {
        valid: boolean;
        errors?: string[];
    };
    /**
     * Auto-select best WhatsApp template for a given context
     */
    selectWhatsAppTemplate(context: PolicyContext, intent: 'welcome' | 'cart' | 'support' | 'notification' | 'general', availableTemplates: any[]): Promise<any | null>;
    /**
     * Check if message violates content policies
     */
    checkContentPolicy(text: string, channel: ChannelType): Promise<{
        allowed: boolean;
        violations?: string[];
    }>;
}
declare const _default: ComplianceEngine;
export default _default;
//# sourceMappingURL=engine.d.ts.map