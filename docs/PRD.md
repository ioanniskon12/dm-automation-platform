# Product Requirements Document
# Multi-Channel DM Automation Platform

## Vision
Build a production-ready prototype that is as powerful as ManyChat but "crazy simple" to use—near-zero learning curve.

## North Star Principles
1. **Zero learning curve** - UI must be self-explanatory
2. **One way to do things** - Single, obvious path
3. **Channel-smart, not channel-noisy** - Same building blocks, adapt behind scenes
4. **Safe by default** - Auto compliance, error-proof defaults
5. **AI feels like magic, never required** - Manual → AI assist → human handoff
6. **Fast first win** - Working flow in <10 minutes

## Supported Channels
- Instagram (primary)
- Facebook Messenger
- WhatsApp Cloud API
- Telegram Bot API
- TikTok (feature flag)

## Core Features

### 1. Flow Builder (5 Node Types Only)
- **Trigger** - Entry points (comment, DM, keyword)
- **Message** - Text/media/buttons/quick replies
- **Questionnaire** - Multi-step user input with validation
- **Condition** - Branch logic (fields/tags/time/source)
- **HTTP** - External API requests

### 2. Compliance Engine
- Instagram/Messenger 24-hour policy
- Instagram private reply limits
- WhatsApp template management
- Telegram rate limiting
- Auto-fallback to templates

### 3. AI Features (Optional)
- AI Answer (scoped to Knowledge Base)
- AI Extract (entities from text)
- AI Classify (intent detection)
- AI Rewrite (tone/grammar)

### 4. Template Gallery
8 starter templates:
1. Comment→DM Lead Magnet
2. Product Finder Quiz
3. Abandoned Cart
4. Support Triage
5. FAQ AI
6. Giveaway
7. Post-Purchase Care
8. NPS/CSAT

### 5. Live Inbox
- All conversations in one place
- AI reply suggestions
- Assign to teammates
- SLA timers

### 6. Knowledge Base
- Document upload
- URL scraping
- Product catalogs (CSV/JSON)
- Custom brand voice prompts

## Milestones

### M1 - Foundations (2 weeks)
- Auth/workspaces
- Fields/tags/users model
- Channel connection stubs
- Event bus
- Flow JSON schema + engine
- Message + Condition + HTTP nodes

### M2 - Channels & Compliance (2 weeks)
- Instagram/Messenger webhooks
- Compliance engine
- WhatsApp Cloud API + templates
- Telegram Bot API

### M3 - Builder & Templates (2 weeks)
- Graph UI with 5 nodes
- Questionnaire node
- Template gallery
- Simulator
- Publish flow

### M4 - AI & Inbox (2 weeks)
- Knowledge Base + embeddings
- AI blocks (Answer/Extract/Classify/Rewrite)
- Live Inbox
- Analytics V1

## Success Criteria (MVP Done)
- Create workspace → connect IG → import template → publish → receive live comment → DM sent → email captured → webhook fires → analytics shows conversion
- All in <10 minutes for new user
- Linter blocks policy violations
- AI Extract validates emails correctly
- Export/import flows work
- Inbox shows AI suggestions

## Tech Stack
- Frontend: Next.js + Tailwind + React Flow + Radix UI
- Backend: TypeScript + Fastify + Prisma + PostgreSQL
- Queue: BullMQ + Redis
- Vector Store: pgvector
- Messaging: Channel-specific SDKs

## Non-Negotiables
1. Never show controls that don't apply to current channel
2. Replace jargon with actions ("Ask for email" not "Input Node")
3. Always show what happens next
4. One-click "Test This Step"
5. Every error includes fix action
