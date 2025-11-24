export interface TriggerTypeConfig {
    id: string;
    name: string;
    description: string;
    channel: 'messenger' | 'instagram' | 'whatsapp' | 'telegram' | 'all';
    icon: string;
    category: 'ads' | 'engagement' | 'messaging' | 'commerce' | 'general';
    configSchema: {
        field: string;
        label: string;
        type: 'text' | 'select' | 'multiselect' | 'boolean' | 'number' | 'keywords' | 'postId';
        placeholder?: string;
        options?: Array<{
            value: string;
            label: string;
        }>;
        required?: boolean;
        defaultValue?: any;
        helpText?: string;
    }[];
    matches?: (event: any, triggerConfig: any) => boolean;
    webhookEvents?: string[];
    requiresSetup?: string[];
    examples?: string[];
}
export declare const MESSENGER_TRIGGERS: TriggerTypeConfig[];
export declare const INSTAGRAM_TRIGGERS: TriggerTypeConfig[];
export declare const TELEGRAM_TRIGGERS: TriggerTypeConfig[];
export declare const ALL_TRIGGERS: TriggerTypeConfig[];
export declare function getTriggerType(id: string): TriggerTypeConfig | undefined;
export declare function getTriggersByChannel(channel: string): TriggerTypeConfig[];
export declare function validateTriggerConfig(triggerTypeId: string, config: any): {
    valid: boolean;
    errors?: string[];
};
export declare function matchesTrigger(triggerTypeId: string, event: any, triggerConfig: any): boolean;
//# sourceMappingURL=trigger-types.d.ts.map