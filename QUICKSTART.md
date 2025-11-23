# 🚀 QUICK START - Get Running in 5 Minutes

## What You're Getting

A **production-ready** multi-channel DM automation platform with:
- ✅ Flow Engine (5 node types)
- ✅ Compliance Engine (IG/Messenger/WhatsApp policies)
- ✅ Channel Abstraction Layer
- ✅ AI Integration (OpenAI)
- ✅ Complete Backend API
- ✅ TypeScript + Fastify + Prisma

## 📥 Installation

### Option 1: Quick Setup (Docker - Recommended)

```bash
# 1. Start services
docker-compose up -d

# 2. Setup database
cd backend
npx prisma db push

# Done! Backend running on http://localhost:3001
```

### Option 2: Manual Setup

```bash
# 1. Install Backend
cd backend
npm install

# 2. Setup Database (you need PostgreSQL running)
# Update DATABASE_URL in .env
npx prisma db push

# 3. Start Backend
npm run dev
```

Backend runs on: `http://localhost:3001`

## ⚙️ Configuration

### Required: Add OpenAI Key (Optional but Recommended)

```bash
# Edit backend/.env
OPENAI_API_KEY=sk-your-key-here
```

Get your key at: https://platform.openai.com/api-keys

### Optional: Connect Real Channels

When ready to connect real Instagram/WhatsApp/Telegram:

```bash
# Add to backend/.env
INSTAGRAM_ACCESS_TOKEN=your_token
FACEBOOK_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_ACCESS_TOKEN=your_token
TELEGRAM_BOT_TOKEN=your_token
```

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Create a Flow
```bash
curl -X POST http://localhost:3001/api/flows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Flow",
    "nodes": [
      {
        "id": "trigger1",
        "type": "trigger",
        "config": {
          "channel": "instagram",
          "kind": "comment_dm",
          "keyword": "WIN"
        }
      },
      {
        "id": "msg1",
        "type": "message",
        "config": {
          "text": "Thanks for your interest! Want the free guide?",
          "buttons": [
            { "text": "Yes", "goTo": "ask_email" },
            { "text": "No", "goTo": "end" }
          ]
        }
      }
    ],
    "edges": [
      { "from": "trigger1", "to": "msg1" }
    ]
  }'
```

### Test Compliance Engine
```bash
curl -X POST http://localhost:3001/api/compliance/check \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "instagram",
    "userId": "user123",
    "lastInboundAt": "2024-01-01T10:00:00Z"
  }'
```

Should return policy violation (outside 24h window)

## 📚 Core Files You Should Know

### Backend
- `src/server.ts` - Main server
- `src/infra/flow-engine.ts` - **Flow execution engine** ⭐
- `src/modules/compliance/engine.ts` - **Compliance policies** ⭐
- `src/modules/channels/abstraction.ts` - **Channel normalization** ⭐
- `prisma/schema.prisma` - Database schema

### Shared
- `shared/types.ts` - TypeScript types for everything

### Docs
- `README.md` - Full documentation
- `docs/PRD.md` - Product requirements

## 🎯 Understanding the 5 Node Types

### 1. Trigger (Entry)
Starts the flow when something happens

```typescript
{
  type: "trigger",
  config: {
    channel: "instagram",
    kind: "comment_dm",
    keyword: "link"
  }
}
```

### 2. Message (Send)
Sends messages with buttons/media

```typescript
{
  type: "message",
  config: {
    text: "Hi {{name}}!",
    buttons: [
      { text: "Yes", goTo: "next" }
    ]
  }
}
```

### 3. Questionnaire (Collect)
Asks questions, validates answers

```typescript
{
  type: "questionnaire",
  config: {
    questions: [{
      id: "email",
      prompt: "What's your email?",
      answerType: "email",
      saveTo: "email"
    }]
  }
}
```

### 4. Condition (Branch)
If/else logic

```typescript
{
  type: "condition",
  config: {
    conditions: [{ type: "follower" }],
    branches: {
      true: "vip_node",
      false: "public_node"
    }
  }
}
```

### 5. HTTP (External API)
Call webhooks, CRMs, etc.

```typescript
{
  type: "http",
  config: {
    url: "https://api.example.com/leads",
    method: "POST",
    body: { email: "{{email}}" }
  }
}
```

## 🛡️ Compliance Engine

### Instagram Example
```typescript
// 24-hour policy check
const decision = await compliance.checkPolicy({
  channel: 'instagram',
  userId: 'user123',
  lastInboundAt: new Date(), // Just messaged
  isFollower: true
}, 'message');

// decision.allowed = true (within 24h)
```

### WhatsApp Example
```typescript
// Outside 24h - needs template
const decision = await compliance.checkPolicy({
  channel: 'whatsapp',
  userId: '+1234567890',
  lastInboundAt: twoDaysAgo
}, 'message');

// decision.allowed = false
// decision.fallback = 'template'
// Automatically use WhatsApp template instead
```

## 🔌 Channel Abstraction

Send the same message to any platform:

```typescript
// Works for Instagram, Messenger, WhatsApp, Telegram
await channel.sendMessage(
  'instagram', // Change to any channel
  channelId,
  userId,
  {
    text: 'Hello!',
    buttons: [{ text: 'Click me' }]
  }
);

// Buttons adapt automatically:
// IG: Quick Replies
// Messenger: Button Template
// WhatsApp: Interactive Buttons
// Telegram: Inline Keyboard
```

## 🤖 AI Features

### Answer from Knowledge Base
```typescript
{
  aiConfig: {
    enabled: true,
    type: 'answer',
    scopeDocs: ['faq.pdf', 'guide.pdf'],
    prompt: 'Answer based on our documentation'
  }
}
```

### Extract Structured Data
```typescript
await aiService.extractField(
  "john@example.com is my email",
  "email"
);
// Returns: "john@example.com"
```

## 📊 API Endpoints

### Flows
- POST `/api/flows` - Create
- GET `/api/flows` - List
- PUT `/api/flows/:id` - Update
- POST `/api/flows/:id/publish` - Publish
- POST `/api/flows/:id/simulate` - Test

### Channels
- POST `/api/channels/instagram/connect`
- POST `/api/channels/whatsapp/connect`
- POST `/api/channels/telegram/connect`

### Webhooks (for channel callbacks)
- POST `/api/webhooks/instagram`
- POST `/api/webhooks/messenger`
- POST `/api/webhooks/whatsapp`
- POST `/api/webhooks/telegram`

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Update DATABASE_URL in .env
```

### Prisma Errors
```bash
# Reset database
npx prisma migrate reset

# Push schema again
npx prisma db push
```

## 📈 Next Steps

1. **Read the full README.md** - Complete documentation
2. **Check PRD** - `docs/PRD.md` for product vision
3. **Build Frontend** - Create the visual flow builder
4. **Add Templates** - 8 starter templates from PRD
5. **Connect Channels** - Real Instagram/WhatsApp/Telegram
6. **Deploy** - Use Docker or cloud platform

## 💡 Pro Tips

1. **Use Prisma Studio** - Visual database browser
   ```bash
   npx prisma studio
   ```

2. **Check Types** - TypeScript helps you
   ```bash
   cd backend
   npm run build
   ```

3. **Test Compliance** - Before connecting channels
   - Test 24-hour windows
   - Test rate limits
   - Test template fallbacks

4. **Read the Code** - It's well-documented
   - Flow Engine: `backend/src/infra/flow-engine.ts`
   - Compliance: `backend/src/modules/compliance/engine.ts`
   - Channels: `backend/src/modules/channels/abstraction.ts`

## 🎉 You're Ready!

Your API is now running with:
- ✅ Flow execution engine
- ✅ Compliance policies
- ✅ Channel abstraction
- ✅ AI integration
- ✅ Complete type system
- ✅ Webhook handlers

**Next:** Build the frontend or start connecting real channels!

Need help? Check README.md or the PRD!
