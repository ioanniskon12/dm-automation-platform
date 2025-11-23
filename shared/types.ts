// Shared TypeScript types for the entire platform

// ============================================
// CHANNELS
// ============================================
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
    phoneNumberId?: string; // WhatsApp
    botToken?: string; // Telegram
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// FLOW SCHEMA (Core of the platform)
// ============================================
export type NodeType = 'trigger' | 'message' | 'questionnaire' | 'condition' | 'http';

export interface FlowNode {
  id: string;
  type: NodeType;
  config: NodeConfig;
  position?: { x: number; y: number };
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  condition?: string; // For conditional edges
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

// ============================================
// NODE CONFIGURATIONS
// ============================================
export type NodeConfig =
  | TriggerConfig
  | MessageConfig
  | QuestionnaireConfig
  | ConditionConfig
  | HTTPConfig;

// TRIGGER NODE
export interface TriggerConfig {
  channel: ChannelType;
  kind: 'comment_dm' | 'dm' | 'story_mention' | 'new_follower' | 'keyword';
  keyword?: string;
  postIds?: string[];
  enabled: boolean;
}

// MESSAGE NODE
export interface MessageConfig {
  text?: string;
  media?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
  };
  buttons?: MessageButton[];
  quickReplies?: string[];
  listOptions?: ListOption[]; // For WhatsApp/Telegram lists
  inlineKeyboard?: InlineKeyboard; // For Telegram
  delay?: number; // ms delay before sending
  aiConfig?: {
    enabled: boolean;
    type: 'answer' | 'rewrite' | 'classify';
    scopeDocs?: string[]; // KB doc IDs
    prompt?: string;
    guardrails?: string[];
  };
}

export interface MessageButton {
  text: string;
  goTo?: string; // Node ID to jump to
  url?: string; // External URL
  payload?: string;
}

export interface ListOption {
  id: string;
  title: string;
  description?: string;
}

export interface InlineKeyboard {
  rows: Array<Array<{ text: string; callbackData: string }>>;
}

// QUESTIONNAIRE NODE
export interface QuestionnaireConfig {
  questions: Question[];
  onComplete: Action[];
}

export interface Question {
  id: string;
  prompt: string;
  answerType: 'text' | 'email' | 'phone' | 'number' | 'date' | 'choice';
  choices?: string[]; // For choice type
  saveTo: string; // Field key to save answer
  validation?: {
    regex?: string;
    min?: number;
    max?: number;
    required?: boolean;
  };
  retry: number; // Number of retry attempts
  onFail: 'skip' | 'ai_help' | 'human';
  aiExtract?: boolean; // Use AI to extract structured data
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
  goTo?: string; // Node ID
}

// CONDITION NODE
export interface ConditionConfig {
  conditions: ConditionRule[];
  operator: 'AND' | 'OR';
  branches: {
    true: string; // Node ID if true
    false: string; // Node ID if false
  };
}

export interface ConditionRule {
  type: 'field' | 'tag' | 'time' | 'source' | 'random' | 'follower';
  field?: string;
  operator?: 'equals' | 'contains' | 'gt' | 'lt' | 'exists';
  value?: any;
  tag?: string;
  timeRange?: { start: string; end: string };
  dayOfWeek?: string[];
  source?: ChannelType;
  probability?: number; // For A/B testing
}

// HTTP NODE
export interface HTTPConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string | Record<string, any>;
  responseMapping?: {
    [key: string]: string; // Map response fields to user fields
  };
  onSuccess?: Action[];
  onError?: Action[];
  timeout?: number;
}

// ============================================
// USER & CONTACTS
// ============================================
export interface UserContact {
  id: string;
  workspaceId: string;
  channelId: string;
  externalId: string; // IG user ID, phone number, etc.
  name?: string;
  handle?: string;
  phone?: string;
  email?: string;
  locale?: string;
  fields: Record<string, any>; // Custom fields
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

// ============================================
// EVENTS & INBOX
// ============================================
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

// ============================================
// KNOWLEDGE BASE
// ============================================
export interface KnowledgeDoc {
  id: string;
  workspaceId: string;
  title: string;
  source: 'upload' | 'url' | 'product';
  contentRef: string; // S3 key or URL
  embeddingRef?: string; // Vector store reference
  status: 'processing' | 'ready' | 'error';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// WHATSAPP TEMPLATES
// ============================================
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

// ============================================
// COMPLIANCE & POLICY
// ============================================
export interface PolicyContext {
  channel: ChannelType;
  userId: string;
  lastInboundAt?: Date;
  messagesSentToday?: number;
  isFollower?: boolean;
}

export type PolicyDecision = 
  | { allowed: true }
  | { allowed: false; reason: string; fallback?: 'template' | 'hold' | 'error' };

// ============================================
// TEMPLATES
// ============================================
export interface Template {
  id: string;
  name: string;
  description: string;
  channels: ChannelType[];
  flowJson: Flow;
  categories: string[];
  imageUrl?: string;
  estimatedSetupTime: number; // minutes
  checklist: string[];
  createdAt: Date;
}

// ============================================
// WORKSPACE & AUTH
// ============================================
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

// ============================================
// ANALYTICS
// ============================================
export interface FlowAnalytics {
  flowId: string;
  period: { start: Date; end: Date };
  entries: number;
  completions: number;
  dropoffs: Record<string, number>; // nodeId -> count
  avgCompletionTime: number; // seconds
  conversionRate: number;
}

export interface WorkspaceAnalytics {
  workspaceId: string;
  period: { start: Date; end: Date };
  mau: number; // Monthly active users
  messagesSent: number;
  messagesReceived: number;
  flowExecutions: number;
  httpRequests: { success: number; error: number };
  aiUsage: { answer: number; extract: number; classify: number; rewrite: number };
}
