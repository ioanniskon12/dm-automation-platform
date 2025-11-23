# 🚀 DM Automation Platform

A complete multi-channel DM automation platform with visual flow builder, supporting Instagram, Facebook Messenger, and more.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

DM Automation Platform enables businesses to create sophisticated automated conversation flows across multiple messaging platforms. Build flows visually with a ReactFlow-based editor, configure triggers, and manage all conversations from a unified inbox.

**Key Capabilities:**
- Visual flow builder with drag-and-drop interface
- Multi-channel support (Instagram, Facebook Messenger)
- 7 Instagram triggers + 6 Messenger triggers
- Unified inbox for all conversations
- Real-time message sync via webhooks
- Brand and channel management
- Flow templates for quick setup

## ✨ Features

### Flow Builder
- **Visual Editor**: ReactFlow-based drag-and-drop interface
- **Node Types**: Triggers, Actions, Conditions, AI Nodes, Media Nodes
- **Templates**: Pre-built flows for common use cases
- **Dynamic Triggers**: Load triggers based on selected channel

### Triggers

**Instagram (7 triggers):**
- 📷 Direct Message - Any message or keyword-based
- 💬 Comment - Post comments with keyword filters
- 📖 Story Reply - Replies to your stories
- 🔄 Post/Reel Share - When someone shares your content
- 🔗 Ref URL - Custom referral links
- 📢 Ads - Instagram ad "Send Message" CTA
- 🎥 Live Comments - Comments during live broadcasts

**Facebook/Messenger (6 triggers):**
- 📢 Facebook Ads - Ad click-to-message
- 💬 Comments - Post comments
- 💌 Messages - Messenger messages
- 🔗 Ref URL - m.me links with parameters
- 📱 QR Code - Messenger QR codes
- 🛒 Shop Messages - Facebook Shop inquiries

### Unified Inbox
- Multi-channel message management
- Real-time updates via webhooks
- Thread-based conversations
- Quick reply functionality
- User profile information
- Conversation history

### Channel Management
- Multiple brands support
- Channel connection per brand
- Instagram and Facebook integration
- Channel status monitoring

## 🛠 Tech Stack

### Backend
- **Framework**: Fastify (Node.js)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **API Integration**:
  - Instagram Graph API
  - Facebook Graph API
  - Meta Webhooks

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/React
- **Flow Editor**: ReactFlow
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Infrastructure
- **API Server**: Fastify on port 3001
- **Frontend**: Next.js on port 3002
- **Database**: SQLite (Prisma)
- **Webhooks**: ngrok for local development

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- ngrok (for webhook testing)
- Facebook Developer Account (for Instagram/Messenger)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ioanniskon12/dm-automation-platform.git
   cd dm-automation-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install

   # Create .env file
   cp .env.example .env
   # Edit .env with your credentials

   # Initialize database
   npx prisma generate
   npx prisma db push

   # Start backend
   PORT=3001 npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install

   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

   # Start frontend
   npm run dev -- --port 3002
   ```

4. **Webhook Setup (for local development)**
   ```bash
   # In a separate terminal
   ngrok http 3001

   # Copy the HTTPS URL and configure in Facebook Developer Console
   ```

### Environment Variables

**Backend** (`backend/.env`):
```env
# Database
DATABASE_URL="file:./dev.db"

# Facebook/Instagram
FACEBOOK_APP_ID="your-app-id"
FACEBOOK_APP_SECRET="your-app-secret"
FACEBOOK_PAGE_ID="your-page-id"
FACEBOOK_PAGE_ACCESS_TOKEN="your-page-token"

# Instagram
INSTAGRAM_BUSINESS_ACCOUNT_ID="your-ig-account-id"

# Server
PORT=3001
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📁 Project Structure

```
dm-automation-platform/
├── backend/                    # Fastify API server
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   ├── trigger-types.ts      # Trigger definitions
│   │   │   └── channel-limits.ts     # Channel restrictions
│   │   ├── modules/
│   │   │   ├── channels/             # Channel management
│   │   │   ├── flows/                # Flow CRUD
│   │   │   ├── triggers/             # Trigger system
│   │   │   ├── inbox/                # Conversation inbox
│   │   │   ├── facebook/             # Facebook integration
│   │   │   └── analytics/            # Analytics
│   │   └── server.ts                 # Main server
│   └── package.json
│
├── frontend/                   # Next.js application
│   ├── app/                   # Next.js app router
│   │   ├── brands/           # Brand management
│   │   ├── flows/            # Flow builder
│   │   ├── inbox/            # Unified inbox
│   │   └── api/              # API routes (proxies)
│   ├── components/
│   │   ├── FlowBuilder.js    # Main flow builder
│   │   ├── Sidebar.js        # Node palette
│   │   ├── NodeConfigPanel.js # Node configuration
│   │   ├── nodes/            # Custom node types
│   │   └── ...
│   ├── contexts/             # React contexts
│   └── package.json
│
├── docs/                      # Additional documentation
├── templates/                 # Flow templates
└── README.md                  # This file
```

## 📚 Documentation

- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflow and guidelines
- **[GIT_WORKFLOW.md](./GIT_WORKFLOW.md)** - Working across multiple machines
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** - Production deployment
- **[FACEBOOK_SETUP_GUIDE.md](./FACEBOOK_SETUP_GUIDE.md)** - Facebook/Instagram setup
- **[INBOX_DOCUMENTATION.md](./INBOX_DOCUMENTATION.md)** - Inbox features

## 🔌 API Endpoints

### Core Endpoints

**Health Check**
```bash
GET /health
```

**Brands**
```bash
GET    /api/brands              # List all brands
POST   /api/brands              # Create brand
GET    /api/brands/:id          # Get brand details
PUT    /api/brands/:id          # Update brand
DELETE /api/brands/:id          # Delete brand
```

**Channels**
```bash
GET    /api/brands/:id/channels         # List brand channels
POST   /api/channels                    # Connect channel
GET    /api/channels/:id                # Get channel details
PUT    /api/channels/:id                # Update channel
DELETE /api/channels/:id                # Disconnect channel
```

**Flows**
```bash
GET    /api/flows                # List all flows
POST   /api/flows                # Create flow
GET    /api/flows/:id            # Get flow details
PUT    /api/flows/:id            # Update flow
DELETE /api/flows/:id            # Delete flow
POST   /api/flows/:id/publish    # Publish flow
```

**Triggers**
```bash
GET    /api/triggers/types                  # Get available triggers
GET    /api/triggers/types?channel=instagram # Get channel triggers
GET    /api/triggers                        # List configured triggers
POST   /api/triggers                        # Create trigger
PUT    /api/triggers/:id                    # Update trigger
DELETE /api/triggers/:id                    # Delete trigger
```

**Inbox**
```bash
GET    /api/inbox/threads              # List conversations
GET    /api/inbox/threads/:id          # Get conversation details
POST   /api/inbox/threads/:id/reply    # Send reply
```

**Webhooks**
```bash
POST   /api/webhooks/instagram         # Instagram webhooks
POST   /api/webhooks/facebook          # Facebook webhooks
GET    /api/webhooks/verify            # Webhook verification
```

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 💻 Development

### Running in Development

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   PORT=3001 npm run dev
   ```

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev -- --port 3002
   ```

3. **Start ngrok** (Terminal 3 - optional, for webhooks)
   ```bash
   ngrok http 3001
   ```

4. **Access Application**
   - Frontend: http://localhost:3002
   - Backend API: http://localhost:3001
   - API Health: http://localhost:3001/health

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Open Prisma Studio (DB GUI)
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

### Testing Webhooks Locally

1. Start ngrok: `ngrok http 3001`
2. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
3. In Facebook Developer Console:
   - Go to Webhooks
   - Add Callback URL: `https://abc123.ngrok.io/api/webhooks/facebook`
   - Verify token: Your verification token from .env
4. Subscribe to webhook events

## 🚀 Deployment

See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detailed deployment instructions.

### Quick Deploy Options

**Option 1: VPS (DigitalOcean, Linode, etc.)**
```bash
# Clone and setup
git clone https://github.com/ioanniskon12/dm-automation-platform.git
cd dm-automation-platform

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment variables
# Start with PM2
pm2 start ecosystem.config.js
```

**Option 2: Docker**
```bash
docker-compose up -d
```

## 🔄 Git Workflow

See [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) for detailed git workflow, especially for working across multiple machines.

### Quick Commands

```bash
# Before starting work
git pull origin main

# After making changes
git add .
git commit -m "Description of changes"
git push origin main
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
1. Check the documentation in `/docs`
2. Search existing GitHub issues
3. Create a new issue with detailed information

## 🔗 Links

- **Repository**: https://github.com/ioanniskon12/dm-automation-platform
- **Documentation**: [./docs](./docs)
- **Facebook Developer Console**: https://developers.facebook.com/apps

---

**Built with ❤️ using Next.js, Fastify, and ReactFlow**
