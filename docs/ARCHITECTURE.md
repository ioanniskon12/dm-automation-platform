# 🏗️ Architecture Documentation

## System Overview

This is a **multi-channel DM automation platform** built to be as powerful as ManyChat but with zero learning curve. The architecture follows the PRD's principle of "channel-smart, not channel-noisy" - same building blocks everywhere, adapting behind the scenes.

## 🎯 Design Principles

1. **Single Source of Truth** - Flow schema defines everything
2. **Channel Agnostic** - Write once, works everywhere
3. **Policy First** - Compliance checks before every action
4. **AI Optional** - Manual → AI assist → human handoff
5. **Type Safe** - Full TypeScript coverage

## 📦 Core Components

### 1. Flow Engine (`backend/src/infra/flow-engine.ts`)

**Purpose:** Executes flows by processing nodes sequentially.

**How it works:**
```
Trigger → Check Match → Execute First Node → Get Next Node → Repeat
```

**Key Features:**
- Executes the 5 node types (Trigger, Message, Questionnaire, Condition, HTTP)
- Variable replacement (`{{name}}`, `{{email}}`)
- Edge traversal (follows connections)
- Context management (carries user data through flow)
- Error handling with step logging

**Example Execution:**
```typescript
const result = await flowEngine.execute(
  flow,           // The flow definition
  user,           // User contact info
  channelId,      // Which channel
  'instagram',    // Channel type
  triggerData     // What triggered it (comment, DM, etc.)
);

// result contains:
// - executionId
// - status (completed/failed/waiting_input)
// - steps (log of what happened)
// - error (if failed)
```

### 2. Compliance Engine (`backend/src/modules/compliance/engine.ts`)

**Purpose:** Enforces platform-specific messaging policies.

**Policies Enforced:**
- **Instagram/Messenger**: 24-hour messaging window
- **WhatsApp**: Template requirement outside 24h
- **Telegram**: Rate limiting (30/second)
- **Content**: Length limits, prohibited content

**How it works:**
```typescript
const decision = await compliance.checkPolicy(context, 'message');

if (!decision.allowed) {
  // Handle fallback:
  // - 'template': Use WhatsApp template
  // - 'hold': Queue for later
  // - 'error': Cannot send
}
```

**Key Features:**
- Real-time policy checks
- Auto-fallback strategies
- Rate limiting
- Content validation
- Status API for UI (shows why blocked + suggested action)

### 3. Channel Abstraction Layer (`backend/src/modules/channels/abstraction.ts`)

**Purpose:** Normalizes message sending across all platforms.

**Capabilities Matrix:**
```
Feature          | IG  | MSG | WA  | TG
-----------------+-----+-----+-----+----
Buttons          | ✓   | ✓   | ✓   | ✓
Quick Replies    | ✓   | ✓   | ✗   | ✗
Lists            | ✗   | ✓   | ✓   | ✗
Inline Keyboard  | ✗   | ✗   | ✗   | ✓
Max Text Length  | 1K  | 2K  | 4K  | 4K
Max Buttons      | 4   | 3   | 3   | 8
```

**Auto-Adaptation:**
```typescript
// Same code for all channels!
await channel.sendMessage('instagram', id, user, {
  text: "Hello!",
  buttons: [{ text: "Click", goTo: "next" }]
});

// Instagram: Quick Replies
// Messenger: Button Template
// WhatsApp: Interactive Buttons
// Telegram: Inline Keyboard
```

**Key Features:**
- Platform detection
- Feature capability checking
- Auto-adaptation (removes unsupported features)
- Text truncation
- Button count limiting
- Unified inbound normalization

### 4. AI Service (`backend/src/lib/ai.ts`)

**Purpose:** OpenAI integration for optional AI features.

**Capabilities:**
- **Answer**: Scoped to Knowledge Base documents
- **Extract**: Structured data from free text
- **Classify**: Intent detection
- **Rewrite**: Tone/grammar improvements

**Usage:**
```typescript
// Answer from KB
const response = await aiService.processMessage(
  "What's your return policy?",
  {
    type: 'answer',
    scopeDocs: ['policy.pdf'],
    prompt: 'Answer based on our policies'
  },
  userContext
);

// Extract email
const email = await aiService.extractField(
  "reach me at john@example.com",
  "email"
);
// Returns: "john@example.com"
```

## 🔄 Data Flow

### Inbound Message Flow
```
1. Webhook receives message
   ↓
2. Normalize to standard format (Channel Abstraction)
   ↓
3. Find matching triggers
   ↓
4. Start flow execution (Flow Engine)
   ↓
5. Check compliance for each send (Compliance Engine)
   ↓
6. Send messages (Channel Abstraction)
   ↓
7. Log events, update analytics
```

### Flow Execution Flow
```
1. Get flow definition from DB
   ↓
2. Find trigger node
   ↓
3. Check trigger conditions
   ↓
4. Execute nodes sequentially:
   - MESSAGE: Check policy → Send → Get next
   - QUESTIONNAIRE: Send question → Wait input → Validate → Save → Continue
   - CONDITION: Evaluate → Branch (true/false)
   - HTTP: Call API → Map response → Continue
   ↓
5. Log each step
   ↓
6. Return execution result
```

## 🗄️ Data Models

### Core Entities

**Workspace**
- Multi-tenant root
- Settings, plan, brand voice

**Channel**
- Platform connection (IG/MSG/WA/TG)
- Tokens, metadata, status

**Flow**
- Nodes + Edges
- Version tracking
- Published state

**UserContact**
- External ID (platform-specific)
- Custom fields (JSON)
- Tags array
- Last interaction times

**Trigger**
- Links to Flow
- Channel-specific config
- Enabled/disabled

**Event**
- Audit log
- Message history
- Flow executions

### Relationships

```
Workspace
  ├─ Channel (many)
  ├─ Flow (many)
  ├─ UserContact (many)
  ├─ Field (many)
  ├─ KnowledgeDoc (many)
  └─ WhatsAppTemplate (many)

Flow
  ├─ Trigger (many)
  └─ FlowExecution (many)

Channel
  ├─ UserContact (many)
  └─ Event (many)
```

## 🔐 Security Layers

### 1. Authentication
- JWT tokens
- Workspace-scoped
- Role-based access (admin/member/viewer)

### 2. API Security
- Rate limiting (per endpoint)
- Request validation (Zod schemas)
- Webhook signature verification
- CORS restrictions

### 3. Data Security
- Field-level encryption (for PII)
- Secure token storage
- Audit logging
- GDPR compliance helpers

## 🚀 Performance Optimization

### 1. Queue System (BullMQ + Redis)
```
High Priority Queue:
- Real-time user responses
- Compliance checks

Medium Priority Queue:
- Flow execution
- HTTP calls

Low Priority Queue:
- Analytics processing
- Email notifications
```

### 2. Caching Strategy
- **User Context**: 5 minutes (Redis)
- **Channel Capabilities**: 1 hour (Memory)
- **Templates**: Until changed (Database)
- **Flow Definitions**: Until published (Database)

### 3. Database Optimization
- Indexed on: userId, channelId, timestamp
- Partitioned: Events by month
- Archived: Executions >90 days

## 🔌 Integration Patterns

### Webhook Processing
```typescript
// 1. Receive webhook
POST /api/webhooks/instagram

// 2. Validate signature
if (!verifySignature(request)) {
  return 401;
}

// 3. Normalize payload
const message = channelAbstraction.normalizeInbound(
  'instagram',
  request.body
);

// 4. Queue for processing
await queue.add('inbound-message', {
  channel: 'instagram',
  message
});

// 5. Return 200 immediately (< 5 seconds)
return 200;
```

### External API Calls (HTTP Node)
```typescript
// 1. Execute HTTP node
const config = node.config as HTTPConfig;

// 2. Replace variables
const url = replaceVariables(config.url, context.variables);
const body = replaceVariables(config.body, context.variables);

// 3. Make request with timeout
const response = await axios({
  method: config.method,
  url,
  headers: config.headers,
  data: body,
  timeout: config.timeout || 10000
});

// 4. Map response to user fields
if (config.responseMapping) {
  for (const [respKey, userKey] of Object.entries(config.responseMapping)) {
    context.variables[userKey] = response.data[respKey];
  }
}

// 5. Execute onSuccess/onError actions
```

## 📊 Monitoring & Observability

### Logging Levels
```
ERROR:   Failures, exceptions
WARN:    Policy violations, rate limits
INFO:    Flow executions, API calls
DEBUG:   Step-by-step execution
```

### Metrics to Track
- Flow execution time (per node type)
- Compliance checks (allowed vs blocked)
- API response times
- Queue depth
- Error rates (per channel)
- Message delivery success rate

### Health Checks
```
GET /health
{
  status: 'ok',
  uptime: 12345,
  database: 'connected',
  redis: 'connected',
  channels: {
    instagram: 'connected',
    whatsapp: 'connected'
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
- Flow Engine: Each node type
- Compliance Engine: All policies
- Channel Abstraction: All platforms
- AI Service: All capabilities

### Integration Tests
- Webhook → Trigger → Flow execution
- Multi-node flows
- Error handling
- Retry logic

### E2E Tests (Playwright)
- Create flow from template
- Simulate user interaction
- Verify message delivery
- Check analytics

## 🔄 Deployment Architecture

### Development
```
Local Machine
├─ Backend (localhost:3001)
├─ Frontend (localhost:3000)
├─ PostgreSQL (localhost:5432)
└─ Redis (localhost:6379)
```

### Production (Recommended)
```
Load Balancer
├─ Backend Instances (N)
│  └─ Docker containers
├─ Database (Managed)
│  └─ PostgreSQL (RDS/Supabase)
├─ Cache (Managed)
│  └─ Redis (ElastiCache/Upstash)
└─ Queue Workers (M)
   └─ BullMQ workers
```

## 🎯 Scalability Considerations

### Horizontal Scaling
- Stateless backend (scale to N instances)
- Queue-based processing
- Redis for shared state

### Database Scaling
- Read replicas for analytics
- Connection pooling
- Partitioning by workspace

### Queue Scaling
- Multiple worker processes
- Priority-based processing
- Auto-scaling based on queue depth

## 🚧 Known Limitations (MVP)

1. **No Frontend UI** - API only (build UI next)
2. **Mock Channel SDKs** - Not calling real APIs yet
3. **In-Memory Cache** - Use Redis in production
4. **No Analytics UI** - Data collected, needs dashboard
5. **No Knowledge Base Vector Store** - Planned for M4

## 🗺️ Roadmap

### M3 (Next) - Builder & Templates
- [ ] Visual flow builder UI
- [ ] 8 starter templates
- [ ] Channel preview mode
- [ ] Compliance linter UI

### M4 - AI & Inbox
- [ ] Knowledge Base upload
- [ ] Vector embeddings (pgvector)
- [ ] Live Inbox interface
- [ ] AI suggestion UI
- [ ] Analytics dashboard

### Future
- [ ] Mobile app
- [ ] A/B testing
- [ ] Advanced segmentation
- [ ] Team collaboration
- [ ] White-label option

---

This architecture is designed to scale from MVP to production while maintaining the "zero learning curve" principle from the PRD.
