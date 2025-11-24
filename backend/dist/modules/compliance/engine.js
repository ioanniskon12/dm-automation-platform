/**
 * Compliance Engine
 * Enforces platform-specific messaging policies and provides fallback strategies
 */
export class ComplianceEngine {
    // Track message counts per user (in-memory for prototype, use Redis in production)
    messageCounts = new Map();
    /**
     * Check if a message can be sent according to channel policies
     */
    async checkPolicy(context, messageType) {
        switch (context.channel) {
            case 'instagram':
                return this.checkInstagramPolicy(context, messageType);
            case 'messenger':
                return this.checkMessengerPolicy(context, messageType);
            case 'whatsapp':
                return this.checkWhatsAppPolicy(context, messageType);
            case 'telegram':
                return this.checkTelegramPolicy(context, messageType);
            case 'twitter':
                return this.checkTwitterPolicy(context, messageType);
            default:
                return { allowed: true };
        }
    }
    /**
     * Instagram Policy:
     * - Can only send messages within 24 hours of last user message
     * - Only one private reply per comment
     * - Must be follower for story replies
     */
    async checkInstagramPolicy(context, messageType) {
        // Check 24-hour window
        if (context.lastInboundAt) {
            const hoursSinceLastMessage = this.getHoursSince(context.lastInboundAt);
            if (hoursSinceLastMessage > 24) {
                return {
                    allowed: false,
                    reason: 'Outside 24-hour messaging window',
                    fallback: 'hold',
                };
            }
        }
        else {
            // No previous inbound message
            return {
                allowed: false,
                reason: 'No prior conversation - user must message first',
                fallback: 'hold',
            };
        }
        // Check follower status for certain message types
        if (messageType === 'story_reply' && !context.isFollower) {
            return {
                allowed: false,
                reason: 'User must be a follower for story replies',
                fallback: 'error',
            };
        }
        return { allowed: true };
    }
    /**
     * Facebook Messenger Policy:
     * - Can send messages within 24 hours of last user message
     * - After 24h, can only send certain message tags (shipping updates, etc.)
     */
    async checkMessengerPolicy(context, messageType) {
        // Similar to Instagram 24-hour policy
        if (context.lastInboundAt) {
            const hoursSinceLastMessage = this.getHoursSince(context.lastInboundAt);
            if (hoursSinceLastMessage > 24) {
                return {
                    allowed: false,
                    reason: 'Outside 24-hour messaging window',
                    fallback: 'hold',
                };
            }
        }
        else {
            return {
                allowed: false,
                reason: 'No prior conversation',
                fallback: 'hold',
            };
        }
        return { allowed: true };
    }
    /**
     * WhatsApp Policy:
     * - Can send free-form messages within 24 hours of last user message
     * - After 24h, MUST use approved message templates
     * - Templates have category restrictions (marketing, utility, auth)
     */
    async checkWhatsAppPolicy(context, messageType) {
        // Check 24-hour session window
        if (context.lastInboundAt) {
            const hoursSinceLastMessage = this.getHoursSince(context.lastInboundAt);
            if (hoursSinceLastMessage > 24 && messageType === 'message') {
                // Outside 24h window - must use template
                return {
                    allowed: false,
                    reason: 'Outside 24-hour window - WhatsApp template required',
                    fallback: 'template',
                };
            }
        }
        else if (messageType === 'message') {
            // No previous conversation - must use template
            return {
                allowed: false,
                reason: 'No active session - WhatsApp template required',
                fallback: 'template',
            };
        }
        // If messageType is already 'template', allow it
        if (messageType === 'template') {
            return { allowed: true };
        }
        return { allowed: true };
    }
    /**
     * Telegram Policy:
     * - Rate limits: 30 messages/second per bot
     * - Group rate limit: 20 messages/minute
     * - No 24-hour restrictions (more flexible)
     */
    async checkTelegramPolicy(context, messageType) {
        // Check rate limits
        const key = `telegram:${context.userId}`;
        const rateLimit = this.getRateLimit(key, 30, 1000); // 30 per second
        if (!rateLimit.allowed) {
            return {
                allowed: false,
                reason: 'Rate limit exceeded',
                fallback: 'hold',
            };
        }
        return { allowed: true };
    }
    /**
     * Twitter / X Policy:
     * - Rate limits: 1,000 DMs per day per user
     * - No 24-hour window restrictions
     * - Relaxed policies compared to Instagram/Messenger
     */
    async checkTwitterPolicy(context, messageType) {
        // Check daily rate limits
        const key = `twitter:${context.userId}:daily`;
        const dailyLimit = this.getRateLimit(key, 1000, 86400000); // 1000 per day
        if (!dailyLimit.allowed) {
            return {
                allowed: false,
                reason: 'Daily DM limit exceeded (1,000 messages per day)',
                fallback: 'hold',
            };
        }
        // Twitter doesn't have 24-hour restrictions like Instagram/Facebook
        return { allowed: true };
    }
    /**
     * Get hours since a date
     */
    getHoursSince(date) {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        return diff / (1000 * 60 * 60);
    }
    /**
     * Rate limiting logic
     */
    getRateLimit(key, maxCount, windowMs) {
        const now = new Date();
        const record = this.messageCounts.get(key);
        if (!record || now > record.resetAt) {
            // New window
            this.messageCounts.set(key, {
                count: 1,
                resetAt: new Date(now.getTime() + windowMs),
            });
            return { allowed: true };
        }
        if (record.count >= maxCount) {
            const resetIn = record.resetAt.getTime() - now.getTime();
            return { allowed: false, resetIn };
        }
        record.count++;
        return { allowed: true };
    }
    /**
     * Get policy status for UI display
     */
    async getPolicyStatus(context) {
        const decision = await this.checkPolicy(context, 'message');
        if (decision.allowed) {
            return { canSend: true };
        }
        let suggestedAction = '';
        let timeRemaining;
        if (decision.fallback === 'template') {
            suggestedAction = 'Use a WhatsApp template instead';
        }
        else if (decision.fallback === 'hold') {
            if (context.lastInboundAt) {
                const hoursSince = this.getHoursSince(context.lastInboundAt);
                if (hoursSince < 24) {
                    timeRemaining = Math.ceil((24 - hoursSince) * 60); // minutes
                    suggestedAction = `Wait ${timeRemaining} minutes or wait for user to message`;
                }
                else {
                    suggestedAction = 'Wait for user to message first';
                }
            }
            else {
                suggestedAction = 'User must initiate conversation first';
            }
        }
        return {
            canSend: false,
            reason: decision.reason,
            suggestedAction,
            timeRemaining,
        };
    }
    /**
     * Validate WhatsApp template before sending
     */
    validateWhatsAppTemplate(template, variables) {
        const errors = [];
        // Check if all required variables are provided
        if (template.variables) {
            for (const varName of template.variables) {
                if (!variables[varName]) {
                    errors.push(`Missing required variable: ${varName}`);
                }
            }
        }
        // Check template status
        if (template.status !== 'approved') {
            errors.push(`Template status is ${template.status}, must be approved`);
        }
        // Check category restrictions
        if (template.category === 'marketing') {
            // Marketing templates have stricter rules
            // Add specific validations here
        }
        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        };
    }
    /**
     * Auto-select best WhatsApp template for a given context
     */
    async selectWhatsAppTemplate(context, intent, availableTemplates) {
        // Filter approved templates
        const approved = availableTemplates.filter(t => t.status === 'approved');
        // Match by category and intent
        let candidates = approved.filter(t => {
            if (intent === 'cart' || intent === 'notification') {
                return t.category === 'utility';
            }
            else if (intent === 'welcome') {
                return t.category === 'utility' || t.category === 'marketing';
            }
            else {
                return true;
            }
        });
        if (candidates.length === 0) {
            return null;
        }
        // Return first match (in production, use more sophisticated matching)
        return candidates[0];
    }
    /**
     * Check if message violates content policies
     */
    async checkContentPolicy(text, channel) {
        const violations = [];
        // Check for common policy violations
        const lowercaseText = text.toLowerCase();
        // Prohibited content patterns
        if (lowercaseText.includes('gambling') || lowercaseText.includes('casino')) {
            violations.push('Gambling content not allowed');
        }
        if (lowercaseText.includes('crypto') && channel === 'whatsapp') {
            violations.push('Cryptocurrency promotions restricted on WhatsApp');
        }
        // Length checks
        if (text.length > 4096 && channel === 'telegram') {
            violations.push('Message exceeds Telegram 4096 character limit');
        }
        if (text.length > 1000 && channel === 'instagram') {
            violations.push('Message exceeds Instagram recommended length');
        }
        return {
            allowed: violations.length === 0,
            violations: violations.length > 0 ? violations : undefined,
        };
    }
}
export default new ComplianceEngine();
//# sourceMappingURL=engine.js.map