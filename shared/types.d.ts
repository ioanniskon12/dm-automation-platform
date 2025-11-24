export type ChannelType = 'instagram' | 'messenger' | 'whatsapp' | 'telegram' | 'twitter' | 'tiktok';
export type ChannelStatus = 'connected' | 'disconnected' | 'error' | 'pending';
export interface Channel {
    id: string;
    workspaceId: string;
    type: ChannelType;
    status: ChannelStatus;
    tokens: {
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: Date;
    };
    meta: {
        pageId?: string;
        pageName?: string;
        businessAccountId?: string;
        phoneNumberId?: string;
        botToken?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export type NodeType = 'trigger' | 'message' | 'questionnaire' | 'condition' | 'http';
export interface FlowNode {
    id: string;
    type: NodeType;
    config: NodeConfig;
    position?: {
        x: number;
        y: number;
    };
}
export interface FlowEdge {
    from: string;
    to: string;
    label?: string;
    condition?: string;
}
export interface Flow {
    id: string;
    workspaceId: string;
    name: string;
    version: number;
    nodes: FlowNode[];
    edges: FlowEdge[];
    isPublished: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export type NodeConfig = TriggerConfig | MessageConfig | QuestionnaireConfig | ConditionConfig | HTTPConfig;
export interface TriggerConfig {
    channel: ChannelType;
    kind: 'comment_dm' | 'dm' | 'story_mention' | 'new_follower' | 'keyword';
    keyword?: string;
    postIds?: string[];
    enabled: boolean;
}
export interface MessageConfig {
    text?: string;
    media?: {
        type: 'image' | 'video' | 'audio' | 'file';
        url: string;
    };
    buttons?: MessageButton[];
    quickReplies?: string[];
    listOptions?: ListOption[];
    inlineKeyboard?: InlineKeyboard;
    delay?: number;
    aiConfig?: {
        enabled: boolean;
        type: 'answer' | 'rewrite' | 'classify';
        scopeDocs?: string[];
        prompt?: string;
        guardrails?: string[];
    };
}
export interface MessageButton {
    text: string;
    goTo?: string;
    url?: string;
    payload?: string;
}
export interface ListOption {
    id: string;
    title: string;
    description?: string;
}
export interface InlineKeyboard {
    rows: Array<Array<{
        text: string;
        callbackData: string;
    }>>;
}
export interface QuestionnaireConfig {
    questions: Question[];
    onComplete: Action[];
}
export interface Question {
    id: string;
    prompt: string;
    answerType: 'text' | 'email' | 'phone' | 'number' | 'date' | 'choice';
    choices?: string[];
    saveTo: string;
    validation?: {
        regex?: string;
        min?: number;
        max?: number;
        required?: boolean;
    };
    retry: number;
    onFail: 'skip' | 'ai_help' | 'human';
    aiExtract?: boolean;
}
export interface Action {
    action: 'message' | 'tag' | 'http' | 'field' | 'delay' | 'goto';
    text?: string;
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: string | Record<string, any>;
    tagValue?: string;
    fieldKey?: string;
    fieldValue?: any;
    delayMs?: number;
    goTo?: string;
}
export interface ConditionConfig {
    conditions: ConditionRule[];
    operator: 'AND' | 'OR';
    branches: {
        true: string;
        false: string;
    };
}
export interface ConditionRule {
    type: 'field' | 'tag' | 'time' | 'source' | 'random' | 'follower';
    field?: string;
    operator?: 'equals' | 'contains' | 'gt' | 'lt' | 'exists';
    value?: any;
    tag?: string;
    timeRange?: {
        start: string;
        end: string;
    };
    dayOfWeek?: string[];
    source?: ChannelType;
    probability?: number;
}
export interface HTTPConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: string | Record<string, any>;
    responseMapping?: {
        [key: string]: string;
    };
    onSuccess?: Action[];
    onError?: Action[];
    timeout?: number;
}
export interface UserContact {
    id: string;
    workspaceId: string;
    channelId: string;
    externalId: string;
    name?: string;
    handle?: string;
    phone?: string;
    email?: string;
    locale?: string;
    fields: Record<string, any>;
    tags: string[];
    isFollower?: boolean;
    lastInAt?: Date;
    lastOutAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface Field {
    id: string;
    workspaceId: string;
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'phone' | 'email' | 'json';
    validation?: {
        regex?: string;
        min?: number;
        max?: number;
        options?: string[];
    };
    default?: any;
    createdAt: Date;
}
export interface Event {
    id: string;
    workspaceId: string;
    channelId: string;
    userId: string;
    type: 'message_in' | 'message_out' | 'trigger' | 'flow_start' | 'flow_end' | 'error';
    payload: Record<string, any>;
    timestamp: Date;
}
export interface InboxThread {
    id: string;
    workspaceId: string;
    channelId: string;
    userId: string;
    status: 'open' | 'assigned' | 'resolved' | 'snoozed';
    assignedTo?: string;
    lastMessage: string;
    lastMessageAt: Date;
    unreadCount: number;
    tags: string[];
    sla?: {
        deadline: Date;
        breached: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface KnowledgeDoc {
    id: string;
    workspaceId: string;
    title: string;
    source: 'upload' | 'url' | 'product';
    contentRef: string;
    embeddingRef?: string;
    status: 'processing' | 'ready' | 'error';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface WhatsAppTemplate {
    id: string;
    workspaceId: string;
    namespace: string;
    name: string;
    language: string;
    status: 'pending' | 'approved' | 'rejected';
    category: 'marketing' | 'utility' | 'authentication';
    components: TemplateComponent[];
    variables: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface TemplateComponent {
    type: 'header' | 'body' | 'footer' | 'buttons';
    format?: 'text' | 'image' | 'video' | 'document';
    text?: string;
    example?: {
        headerText?: string[];
        bodyText?: string[][];
    };
    buttons?: Array<{
        type: 'quick_reply' | 'url' | 'phone_number';
        text: string;
        url?: string;
        phoneNumber?: string;
    }>;
}
export interface PolicyContext {
    channel: ChannelType;
    userId: string;
    lastInboundAt?: Date;
    messagesSentToday?: number;
    isFollower?: boolean;
}
export type PolicyDecision = {
    allowed: true;
} | {
    allowed: false;
    reason: string;
    fallback?: 'template' | 'hold' | 'error';
};
export interface Template {
    id: string;
    name: string;
    description: string;
    channels: ChannelType[];
    flowJson: Flow;
    categories: string[];
    imageUrl?: string;
    estimatedSetupTime: number;
    checklist: string[];
    createdAt: Date;
}
export interface Workspace {
    id: string;
    name: string;
    plan: 'free' | 'pro' | 'enterprise';
    settings: {
        timezone?: string;
        brandVoice?: string;
        aiEnabled?: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface User {
    id: string;
    email: string;
    name: string;
    workspaces: string[];
    role: 'admin' | 'member' | 'viewer';
    createdAt: Date;
}
export interface FlowAnalytics {
    flowId: string;
    period: {
        start: Date;
        end: Date;
    };
    entries: number;
    completions: number;
    dropoffs: Record<string, number>;
    avgCompletionTime: number;
    conversionRate: number;
}
export interface WorkspaceAnalytics {
    workspaceId: string;
    period: {
        start: Date;
        end: Date;
    };
    mau: number;
    messagesSent: number;
    messagesReceived: number;
    flowExecutions: number;
    httpRequests: {
        success: number;
        error: number;
    };
    aiUsage: {
        answer: number;
        extract: number;
        classify: number;
        rewrite: number;
    };
}
//# sourceMappingURL=types.d.ts.map