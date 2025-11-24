// Trigger type definitions for all messaging channels
// Each trigger type defines when a flow should be executed

export interface TriggerTypeConfig {
  id: string;
  name: string;
  description: string;
  channel: 'messenger' | 'instagram' | 'whatsapp' | 'telegram' | 'all';
  icon: string;
  category: 'ads' | 'engagement' | 'messaging' | 'commerce' | 'general';

  // Configuration schema - what settings does this trigger need?
  configSchema: {
    field: string;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'boolean' | 'number' | 'keywords' | 'postId';
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
    defaultValue?: any;
    helpText?: string;
  }[];

  // Validation function for incoming events
  matches?: (event: any, triggerConfig: any) => boolean;

  // Additional metadata
  webhookEvents?: string[];  // Which webhook events trigger this
  requiresSetup?: string[];  // Setup requirements (e.g., ["Facebook Ad Campaign", "m.me link"])
  examples?: string[];       // Example use cases
}

// ============================================
// MESSENGER TRIGGERS
// ============================================

export const MESSENGER_TRIGGERS: TriggerTypeConfig[] = [
  {
    id: 'messenger_ad_click',
    name: 'Facebook Ads',
    description: 'Trigger fires when someone clicks a connected Facebook Ad that uses "Send Message" as its CTA',
    channel: 'messenger',
    icon: '📢',
    category: 'ads',

    configSchema: [
      {
        field: 'adCampaignId',
        label: 'Ad Campaign ID',
        type: 'text',
        placeholder: 'Enter Facebook Ad Campaign ID',
        required: false,
        helpText: 'Optional: Leave empty to trigger on any ad click, or specify a campaign ID'
      },
      {
        field: 'adId',
        label: 'Specific Ad ID',
        type: 'text',
        placeholder: 'Enter specific Ad ID',
        required: false,
        helpText: 'Optional: Target a specific ad within the campaign'
      }
    ],

    webhookEvents: ['messaging_referrals'],
    requiresSetup: [
      'Facebook Ad with "Send Message" CTA',
      'Ad connected to your Facebook Page'
    ],

    examples: [
      'Start a lead qualification flow when users click your ad',
      'Offer a discount code to ad clickers',
      'Collect email addresses from ad leads'
    ],

    matches: (event, config) => {
      // Check if this is a referral event from an ad
      if (event.referral && event.referral.source === 'ADS') {
        // If specific campaign/ad is configured, check it matches
        if (config.adCampaignId && event.referral.ad_id !== config.adCampaignId) {
          return false;
        }
        return true;
      }
      return false;
    }
  },

  {
    id: 'messenger_comment',
    name: 'Facebook Comments',
    description: 'Trigger activates when a user leaves a comment on a specific Facebook Page post',
    channel: 'messenger',
    icon: '💬',
    category: 'engagement',

    configSchema: [
      {
        field: 'postId',
        label: 'Post ID',
        type: 'postId',
        placeholder: 'Enter Facebook Post ID',
        required: true,
        helpText: 'The ID of the Facebook post to monitor for comments'
      },
      {
        field: 'keywords',
        label: 'Keyword Filter',
        type: 'keywords',
        placeholder: 'Enter keywords (e.g., "interested", "yes", "info")',
        required: false,
        helpText: 'Optional: Only trigger for comments containing these keywords'
      },
      {
        field: 'sendDM',
        label: 'Send DM Automatically',
        type: 'boolean',
        defaultValue: true,
        helpText: 'Send a Messenger DM when someone comments'
      }
    ],

    webhookEvents: ['feed_comment'],
    requiresSetup: [
      'Facebook Page with posts',
      'Comment monitoring enabled in Page settings'
    ],

    examples: [
      'Auto-reply to post comments with a DM',
      'Collect leads from engagement posts',
      'Send exclusive content to commenters'
    ],

    matches: (event, config) => {
      // Check if this is a comment on the specified post
      if (event.postId === config.postId) {
        // If keywords are specified, check if comment contains them
        if (config.keywords && config.keywords.length > 0) {
          const commentText = event.message?.text?.toLowerCase() || '';
          return config.keywords.some((keyword: string) =>
            commentText.includes(keyword.toLowerCase())
          );
        }
        return true;
      }
      return false;
    }
  },

  {
    id: 'messenger_message',
    name: 'Messenger Message',
    description: 'Fires when a user sends any message to the connected Facebook Page via Messenger',
    channel: 'messenger',
    icon: '💌',
    category: 'messaging',

    configSchema: [
      {
        field: 'triggerType',
        label: 'Trigger On',
        type: 'select',
        options: [
          { value: 'any', label: 'Any Message' },
          { value: 'keywords', label: 'Specific Keywords' },
          { value: 'intent', label: 'AI Intent Recognition' }
        ],
        defaultValue: 'any',
        required: true
      },
      {
        field: 'keywords',
        label: 'Keywords',
        type: 'keywords',
        placeholder: 'Enter keywords (e.g., "help", "support", "pricing")',
        required: false,
        helpText: 'Only trigger when message contains these keywords (case-insensitive)'
      },
      {
        field: 'intent',
        label: 'Intent',
        type: 'select',
        options: [
          { value: 'question', label: 'User has a question' },
          { value: 'complaint', label: 'User has a complaint' },
          { value: 'purchase', label: 'User wants to buy' },
          { value: 'support', label: 'User needs support' }
        ],
        required: false,
        helpText: 'Trigger based on detected user intent (requires AI)'
      },
      {
        field: 'excludeExisting',
        label: 'Only New Conversations',
        type: 'boolean',
        defaultValue: false,
        helpText: 'Only trigger for first-time messengers (new conversations)'
      }
    ],

    webhookEvents: ['messages'],

    examples: [
      'Auto-respond to all incoming messages',
      'Trigger support flow when users say "help"',
      'Start sales flow for purchase-related messages'
    ],

    matches: (event, config) => {
      // Don't trigger on echo messages (messages sent by the bot)
      if (event.message?.is_echo) {
        return false;
      }

      const messageText = event.message?.text?.toLowerCase() || '';

      // Check trigger type
      switch (config.triggerType) {
        case 'any':
          return true;

        case 'keywords':
          if (config.keywords && config.keywords.length > 0) {
            return config.keywords.some((keyword: string) =>
              messageText.includes(keyword.toLowerCase())
            );
          }
          return false;

        case 'intent':
          // Intent recognition would use AI here
          // For now, use simple keyword matching as fallback
          if (config.intent) {
            const intentKeywords: Record<string, string[]> = {
              question: ['?', 'how', 'what', 'when', 'where', 'why', 'who'],
              complaint: ['bad', 'terrible', 'awful', 'disappointed', 'unhappy', 'problem'],
              purchase: ['buy', 'purchase', 'price', 'cost', 'order', 'checkout'],
              support: ['help', 'support', 'issue', 'broken', 'not working']
            };
            const keywords = intentKeywords[config.intent] || [];
            return keywords.some(keyword => messageText.includes(keyword));
          }
          return false;

        default:
          return true;
      }
    }
  },

  {
    id: 'messenger_ref_url',
    name: 'Messenger Ref URL',
    description: 'Triggered when a user lands in Messenger through a special referral link (m.me link with ref parameter)',
    channel: 'messenger',
    icon: '🔗',
    category: 'messaging',

    configSchema: [
      {
        field: 'refParameter',
        label: 'Ref Parameter',
        type: 'text',
        placeholder: 'e.g., "summer_promo" or "lead_magnet"',
        required: true,
        helpText: 'The ref parameter in your m.me link (m.me/yourpage?ref=YOUR_REF)'
      },
      {
        field: 'linkUrl',
        label: 'Full Link (for reference)',
        type: 'text',
        placeholder: 'https://m.me/yourpage?ref=summer_promo',
        required: false,
        helpText: 'Generated link for your reference'
      }
    ],

    webhookEvents: ['messaging_referrals'],
    requiresSetup: [
      'Create m.me link with ref parameter',
      'Share link in emails, ads, or website'
    ],

    examples: [
      'Track different traffic sources (email, website, social)',
      'Segment users by where they came from',
      'Trigger different flows for different campaigns'
    ],

    matches: (event, config) => {
      // Check if this is a referral event with matching ref parameter
      if (event.referral && event.referral.ref === config.refParameter) {
        return true;
      }

      // Also check postback with ref (for "Get Started" button)
      if (event.postback && event.postback.referral?.ref === config.refParameter) {
        return true;
      }

      return false;
    }
  },

  {
    id: 'messenger_qr_code',
    name: 'QR Code',
    description: 'Starts an automation when someone scans a Messenger-connected QR code',
    channel: 'messenger',
    icon: '📱',
    category: 'general',

    configSchema: [
      {
        field: 'qrCodeId',
        label: 'QR Code ID',
        type: 'text',
        placeholder: 'Enter unique QR code identifier',
        required: true,
        helpText: 'Unique identifier for this QR code (embedded in the QR code data)'
      },
      {
        field: 'qrCodeName',
        label: 'QR Code Name',
        type: 'text',
        placeholder: 'e.g., "Event Booth", "Product Packaging"',
        required: false,
        helpText: 'Friendly name to identify where this QR code is used'
      },
      {
        field: 'trackLocation',
        label: 'Track Location',
        type: 'boolean',
        defaultValue: false,
        helpText: 'Save the location where QR code was scanned (if available)'
      }
    ],

    webhookEvents: ['messaging_referrals'],
    requiresSetup: [
      'Generate Messenger QR code with unique ref',
      'Print or display QR code at physical location'
    ],

    examples: [
      'Event booth lead capture',
      'Product packaging engagement',
      'Restaurant menu ordering',
      'Store window promotions'
    ],

    matches: (event, config) => {
      // QR codes are essentially ref URLs with a specific format
      // Check for QR code scan (referral with type MESSENGER_CODE)
      if (event.referral &&
          event.referral.type === 'OPEN_THREAD' &&
          event.referral.ref === config.qrCodeId) {
        return true;
      }

      return false;
    }
  },

  {
    id: 'messenger_shop_message',
    name: 'Facebook Shop Message',
    description: 'Activates when a user sends a message directly from a product or checkout area in the connected Facebook Shop',
    channel: 'messenger',
    icon: '🛒',
    category: 'commerce',

    configSchema: [
      {
        field: 'productId',
        label: 'Product ID',
        type: 'text',
        placeholder: 'Enter specific product ID (optional)',
        required: false,
        helpText: 'Leave empty to trigger on any shop message, or specify a product ID'
      },
      {
        field: 'messageType',
        label: 'Message Type',
        type: 'select',
        options: [
          { value: 'any', label: 'Any Shop Message' },
          { value: 'product_inquiry', label: 'Product Inquiry' },
          { value: 'order_tracking', label: 'Order Tracking' },
          { value: 'support', label: 'Support Request' }
        ],
        defaultValue: 'any',
        required: true
      },
      {
        field: 'autoTag',
        label: 'Auto-tag as',
        type: 'select',
        options: [
          { value: 'none', label: 'No tag' },
          { value: 'shop_customer', label: 'Shop Customer' },
          { value: 'potential_buyer', label: 'Potential Buyer' }
        ],
        defaultValue: 'shop_customer',
        helpText: 'Automatically tag users who message from shop'
      }
    ],

    webhookEvents: ['messages'],
    requiresSetup: [
      'Facebook Shop configured on Page',
      'Shop products published',
      'Messaging enabled in Shop settings'
    ],

    examples: [
      'Answer product questions automatically',
      'Provide order tracking information',
      'Offer personalized product recommendations',
      'Send cart abandonment reminders'
    ],

    matches: (event, config) => {
      // Check if message originated from Facebook Shop
      // This is indicated by metadata or referral data
      const isFromShop = event.message?.metadata?.includes('shop') ||
                         event.referral?.source === 'SHOP' ||
                         event.message?.quick_reply?.payload?.includes('shop');

      if (!isFromShop) {
        return false;
      }

      // If specific product ID is configured, check it
      if (config.productId && event.message?.metadata?.productId !== config.productId) {
        return false;
      }

      // Check message type if specified
      if (config.messageType && config.messageType !== 'any') {
        const messageText = event.message?.text?.toLowerCase() || '';
        const typeKeywords: Record<string, string[]> = {
          product_inquiry: ['price', 'available', 'stock', 'details', 'info'],
          order_tracking: ['order', 'tracking', 'delivery', 'shipped', 'status'],
          support: ['help', 'problem', 'issue', 'return', 'refund']
        };
        const keywords = typeKeywords[config.messageType] || [];
        if (!keywords.some(keyword => messageText.includes(keyword))) {
          return false;
        }
      }

      return true;
    }
  }
];

// ============================================
// INSTAGRAM TRIGGERS
// ============================================

export const INSTAGRAM_TRIGGERS: TriggerTypeConfig[] = [
  {
    id: 'instagram_message',
    name: 'Instagram Direct Message',
    description: 'Fires when a user sends a message to your Instagram account',
    channel: 'instagram',
    icon: '📷',
    category: 'messaging',

    configSchema: [
      {
        field: 'triggerType',
        label: 'Trigger On',
        type: 'select',
        options: [
          { value: 'any', label: 'Any Message' },
          { value: 'keywords', label: 'Specific Keywords' }
        ],
        defaultValue: 'any',
        required: true
      },
      {
        field: 'keywords',
        label: 'Keywords',
        type: 'keywords',
        placeholder: 'Enter keywords',
        required: false
      }
    ],

    webhookEvents: ['messages'],

    examples: [
      'Auto-respond to Instagram DMs',
      'Qualify leads from Instagram',
      'Provide customer support via Instagram'
    ]
  },

  {
    id: 'instagram_comment',
    name: 'Instagram Comment',
    description: 'Triggers when someone comments on your Instagram post',
    channel: 'instagram',
    icon: '💬',
    category: 'engagement',

    configSchema: [
      {
        field: 'postId',
        label: 'Post ID',
        type: 'postId',
        placeholder: 'Enter Instagram Post ID',
        required: false,
        helpText: 'Leave empty to monitor all posts'
      },
      {
        field: 'keywords',
        label: 'Keyword Filter',
        type: 'keywords',
        required: false
      }
    ],

    webhookEvents: ['comments'],

    examples: [
      'Auto-reply to comments with DM',
      'Engage with post commenters',
      'Convert engagement into conversations'
    ]
  },

  {
    id: 'instagram_story_reply',
    name: 'Instagram Story Reply',
    description: 'Triggers when someone replies to your Instagram Story',
    channel: 'instagram',
    icon: '📖',
    category: 'engagement',

    configSchema: [
      {
        field: 'storySelection',
        label: 'Story Selection',
        type: 'select',
        options: [
          { value: 'all', label: 'All Stories' },
          { value: 'specific', label: 'Specific Story' }
        ],
        defaultValue: 'all',
        required: true,
        helpText: 'Monitor all stories or a specific story'
      },
      {
        field: 'selectedStoryId',
        label: 'Story ID',
        type: 'text',
        placeholder: 'Enter Story ID',
        required: false,
        helpText: 'Required if monitoring specific story'
      },
      {
        field: 'triggerType',
        label: 'Trigger Type',
        type: 'select',
        options: [
          { value: 'any', label: 'Any Reply' },
          { value: 'keywords', label: 'Specific Keywords' }
        ],
        defaultValue: 'any',
        required: true
      },
      {
        field: 'triggerKeywords',
        label: 'Keywords',
        type: 'keywords',
        placeholder: 'Enter keywords',
        required: false,
        helpText: 'Only trigger when reply contains these keywords'
      },
      {
        field: 'replyDelay',
        label: 'Reply Delay (seconds)',
        type: 'number',
        defaultValue: 0,
        required: false,
        helpText: 'Wait before triggering automation'
      },
      {
        field: 'autoReact',
        label: 'Auto-react to Story Reply',
        type: 'boolean',
        defaultValue: false,
        helpText: 'Automatically react with ❤️ when someone replies'
      }
    ],

    webhookEvents: ['story_reply'],

    examples: [
      'Auto-reply to story responses',
      'Collect feedback from story viewers',
      'Drive engagement from story interactions'
    ]
  },

  {
    id: 'instagram_post_share',
    name: 'Instagram Post or Reel Share',
    description: 'Triggers when someone shares your post or reel via DM',
    channel: 'instagram',
    icon: '🔄',
    category: 'engagement',

    configSchema: [
      {
        field: 'postSelection',
        label: 'Post Selection',
        type: 'select',
        options: [
          { value: 'any', label: 'Any Post/Reel' },
          { value: 'specific', label: 'Specific Post/Reel' },
          { value: 'scheduled', label: 'Scheduled Content' }
        ],
        defaultValue: 'any',
        required: true
      },
      {
        field: 'postId',
        label: 'Post/Reel ID',
        type: 'text',
        placeholder: 'Enter Post or Reel ID',
        required: false,
        helpText: 'Required if monitoring specific post/reel'
      },
      {
        field: 'shareDelay',
        label: 'Response Delay (seconds)',
        type: 'number',
        defaultValue: 0,
        required: false,
        helpText: 'Wait before triggering automation'
      }
    ],

    webhookEvents: ['share'],

    examples: [
      'Thank users for sharing your content',
      'Reward viral content sharers',
      'Track content performance through shares'
    ]
  },

  {
    id: 'instagram_ref_url',
    name: 'Instagram Ref URL',
    description: 'Triggers when someone clicks a special Instagram link with ref parameter',
    channel: 'instagram',
    icon: '🔗',
    category: 'messaging',

    configSchema: [
      {
        field: 'refParameter',
        label: 'Ref Parameter',
        type: 'text',
        placeholder: 'e.g., "summer_promo" or "bio_link"',
        required: true,
        helpText: 'Custom ref parameter in your Instagram link'
      },
      {
        field: 'linkUrl',
        label: 'Full Link (for reference)',
        type: 'text',
        placeholder: 'https://ig.me/m/yourpage?ref=summer_promo',
        required: false,
        helpText: 'Generated link for your reference'
      }
    ],

    webhookEvents: ['messaging_referrals'],
    requiresSetup: [
      'Create Instagram link with ref parameter',
      'Share link in bio, ads, or external sites'
    ],

    examples: [
      'Track different traffic sources',
      'Segment users by campaign origin',
      'Trigger different flows for different link sources'
    ]
  },

  {
    id: 'instagram_ads',
    name: 'Instagram Ads',
    description: 'Triggers when someone clicks an Instagram Ad with "Send Message" CTA',
    channel: 'instagram',
    icon: '📢',
    category: 'ads',

    configSchema: [
      {
        field: 'adCampaignId',
        label: 'Ad Campaign ID',
        type: 'text',
        placeholder: 'Enter Instagram Ad Campaign ID',
        required: false,
        helpText: 'Optional: Leave empty to trigger on any ad click'
      },
      {
        field: 'adId',
        label: 'Specific Ad ID',
        type: 'text',
        placeholder: 'Enter specific Ad ID',
        required: false,
        helpText: 'Optional: Target a specific ad within the campaign'
      }
    ],

    webhookEvents: ['messaging_referrals'],
    requiresSetup: [
      'Instagram Ad with "Send Message" CTA',
      'Ad connected to your Instagram Business account'
    ],

    examples: [
      'Start lead qualification from ad clicks',
      'Offer discounts to ad responders',
      'Collect customer information from ads'
    ],

    matches: (event, config) => {
      if (event.referral && event.referral.source === 'ADS') {
        if (config.adCampaignId && event.referral.ad_id !== config.adCampaignId) {
          return false;
        }
        return true;
      }
      return false;
    }
  },

  {
    id: 'instagram_live_comment',
    name: 'Instagram Live Comments',
    description: 'Triggers when someone comments during your Instagram Live broadcast',
    channel: 'instagram',
    icon: '🎥',
    category: 'engagement',

    configSchema: [
      {
        field: 'liveVideoId',
        label: 'Live Video ID',
        type: 'text',
        placeholder: 'Auto-detected during live',
        required: false,
        helpText: 'Leave empty to monitor current live session'
      },
      {
        field: 'keywords',
        label: 'Keyword Filter',
        type: 'keywords',
        placeholder: 'Enter keywords to detect',
        required: false,
        helpText: 'Only trigger when comment contains these keywords'
      },
      {
        field: 'respondDuringLive',
        label: 'Respond During Live',
        type: 'boolean',
        defaultValue: false,
        helpText: 'Send DM during live or wait until live ends'
      }
    ],

    webhookEvents: ['live_comments'],

    examples: [
      'Capture questions during live Q&A',
      'Collect leads from live viewers',
      'Engage with active live participants'
    ]
  }
];

// ============================================
// TELEGRAM TRIGGERS
// ============================================

export const TELEGRAM_TRIGGERS: TriggerTypeConfig[] = [
  {
    id: 'telegram_message',
    name: 'Telegram Message',
    description: 'User sends a message',
    channel: 'telegram',
    icon: '✈️',
    category: 'messaging',

    configSchema: [
      {
        field: 'triggerType',
        label: 'Trigger On',
        type: 'select',
        options: [
          { value: 'any', label: 'Any Message' },
          { value: 'keywords', label: 'Specific Keywords' }
        ],
        defaultValue: 'any',
        required: true
      },
      {
        field: 'keywords',
        label: 'Keywords',
        type: 'keywords',
        placeholder: 'Enter keywords (e.g., "help", "support", "info")',
        required: false,
        helpText: 'Only trigger when message contains these keywords (case-insensitive)'
      }
    ],

    webhookEvents: ['message'],

    examples: [
      'Auto-respond to Telegram messages',
      'Trigger flows based on keywords',
      'Provide customer support via Telegram'
    ],

    matches: (event, config) => {
      const messageText = event.message?.text?.toLowerCase() || '';

      switch (config.triggerType) {
        case 'any':
          return true;

        case 'keywords':
          if (config.keywords && config.keywords.length > 0) {
            return config.keywords.some((keyword: string) =>
              messageText.includes(keyword.toLowerCase())
            );
          }
          return false;

        default:
          return true;
      }
    }
  },

  {
    id: 'telegram_ref_url',
    name: 'Telegram Ref URL',
    description: 'User clicks a referral link',
    channel: 'telegram',
    icon: '🔗',
    category: 'messaging',

    configSchema: [
      {
        field: 'refParameter',
        label: 'Ref Parameter',
        type: 'text',
        placeholder: 'e.g., "promo_code" or "campaign_id"',
        required: true,
        helpText: 'The ref parameter in your Telegram deep link'
      },
      {
        field: 'linkUrl',
        label: 'Full Link (for reference)',
        type: 'text',
        placeholder: 'https://t.me/yourbot?start=promo_code',
        required: false,
        helpText: 'Generated link for your reference'
      }
    ],

    webhookEvents: ['message'],
    requiresSetup: [
      'Create Telegram deep link with start parameter',
      'Share link in campaigns, ads, or website'
    ],

    examples: [
      'Track different traffic sources',
      'Segment users by campaign origin',
      'Trigger different flows for different campaigns'
    ],

    matches: (event, config) => {
      // Check if this is a /start command with matching parameter
      const messageText = event.message?.text || '';
      const startCommand = `/start ${config.refParameter}`;

      if (messageText === startCommand || messageText.startsWith(startCommand + ' ')) {
        return true;
      }

      return false;
    }
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const ALL_TRIGGERS = [
  ...MESSENGER_TRIGGERS,
  ...INSTAGRAM_TRIGGERS,
  ...TELEGRAM_TRIGGERS
];

export function getTriggerType(id: string): TriggerTypeConfig | undefined {
  return ALL_TRIGGERS.find(trigger => trigger.id === id);
}

export function getTriggersByChannel(channel: string): TriggerTypeConfig[] {
  return ALL_TRIGGERS.filter(trigger =>
    trigger.channel === channel || trigger.channel === 'all'
  );
}

export function validateTriggerConfig(
  triggerTypeId: string,
  config: any
): { valid: boolean; errors?: string[] } {
  const triggerType = getTriggerType(triggerTypeId);

  if (!triggerType) {
    return { valid: false, errors: ['Invalid trigger type'] };
  }

  const errors: string[] = [];

  // Validate required fields
  triggerType.configSchema.forEach(field => {
    if (field.required && !config[field.field]) {
      errors.push(`${field.label} is required`);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}

export function matchesTrigger(
  triggerTypeId: string,
  event: any,
  triggerConfig: any
): boolean {
  const triggerType = getTriggerType(triggerTypeId);

  if (!triggerType || !triggerType.matches) {
    return false;
  }

  return triggerType.matches(event, triggerConfig);
}
