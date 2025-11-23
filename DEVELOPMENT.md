# 💻 Development Guide

Complete guide for developing the DM Automation Platform.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Development Workflow](#development-workflow)
- [Code Organization](#code-organization)
- [Adding New Features](#adding-new-features)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)
- ngrok (for webhook testing)
- Facebook Developer Account

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/ioanniskon12/dm-automation-platform.git
   cd dm-automation-platform

   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Configuration**

   Copy and configure environment files:
   ```bash
   # Backend
   cp backend/.env.example backend/.env

   # Frontend
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > frontend/.env.local
   ```

3. **Database Setup**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

## Project Architecture

### High-Level Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │─────▶│  Next.js    │─────▶│  Fastify    │
│             │      │  Frontend   │      │  Backend    │
└─────────────┘      └─────────────┘      └─────────────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │   Prisma    │
                                           │   SQLite    │
                                           └─────────────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │  Instagram  │
                                           │  Facebook   │
                                           └─────────────┘
```

### Backend Architecture

```
backend/
├── src/
│   ├── server.ts                 # Main server entry point
│   ├── config/                   # Configuration files
│   │   ├── trigger-types.ts      # Trigger definitions
│   │   └── channel-limits.ts     # Channel restrictions
│   ├── modules/                  # Feature modules
│   │   ├── channels/             # Channel management
│   │   ├── flows/                # Flow CRUD operations
│   │   ├── triggers/             # Trigger system
│   │   ├── inbox/                # Inbox & conversations
│   │   ├── facebook/             # Facebook API integration
│   │   └── analytics/            # Analytics endpoints
│   └── lib/                      # Shared utilities
│       ├── prisma.ts             # Prisma client
│       └── ai.ts                 # AI integrations
└── prisma/
    └── schema.prisma             # Database schema
```

### Frontend Architecture

```
frontend/
├── app/                          # Next.js app router
│   ├── api/                      # API route handlers (proxies)
│   ├── brands/                   # Brand management pages
│   ├── flows/                    # Flow builder page
│   └── inbox/                    # Inbox page
├── components/                   # React components
│   ├── FlowBuilder.js            # Main flow builder
│   ├── Sidebar.js                # Node palette sidebar
│   ├── NodeConfigPanel.js        # Node configuration
│   └── nodes/                    # Custom ReactFlow nodes
│       ├── TriggerNode.js
│       ├── ActionNode.js
│       ├── ConditionNode.js
│       ├── AINode.js
│       └── MediaNode.js
└── contexts/                     # React context providers
    ├── AuthContext.js
    ├── BrandChannelContext.js
    └── SidebarContext.js
```

## Development Workflow

### Daily Development Process

1. **Start Backend Server**
   ```bash
   cd backend
   PORT=3001 npm run dev
   ```
   Server runs on http://localhost:3001

2. **Start Frontend Server** (separate terminal)
   ```bash
   cd frontend
   npm run dev -- --port 3002
   ```
   Frontend runs on http://localhost:3002

3. **Start ngrok** (for webhooks, separate terminal)
   ```bash
   ngrok http 3001
   ```

### Making Changes

1. **Pull latest code**
   ```bash
   git pull origin main
   ```

2. **Make your changes**
   - Edit files
   - Test locally
   - Check browser console and server logs

3. **Commit changes**
   ```bash
   git add .
   git commit -m "Descriptive message"
   git push origin main
   ```

## Code Organization

### Adding New Triggers

Triggers are defined in `backend/src/config/trigger-types.ts`:

```typescript
// Example: Adding a new Instagram trigger
export const INSTAGRAM_TRIGGERS: TriggerTypeConfig[] = [
  // ... existing triggers ...
  {
    id: 'instagram_new_trigger',
    name: 'New Trigger Name',
    description: 'What this trigger does',
    channel: 'instagram',
    icon: '🎯',
    category: 'engagement',

    configSchema: [
      {
        field: 'someField',
        label: 'Field Label',
        type: 'text',
        required: true,
        helpText: 'Help text for users'
      }
    ],

    webhookEvents: ['relevant_event'],

    examples: [
      'Example use case 1',
      'Example use case 2'
    ]
  }
];
```

### Adding New API Endpoints

1. **Backend Route** (`backend/src/modules/yourmodule/index.ts`):
```typescript
export default async function (fastify: any) {
  fastify.get('/your-endpoint', async (request, reply) => {
    // Your logic here
    return { success: true, data: {...} };
  });
}
```

2. **Register in Server** (`backend/src/server.ts`):
```typescript
import yourModule from './modules/yourmodule/index.js';
fastify.register(yourModule, { prefix: '/api/yourmodule' });
```

3. **Frontend API Route** (`frontend/app/api/yourmodule/route.js`):
```javascript
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request) {
  const response = await fetch(`${API_URL}/api/yourmodule/your-endpoint`);
  const data = await response.json();
  return NextResponse.json(data);
}
```

### Adding New React Components

1. **Create Component** (`frontend/components/YourComponent.js`):
```javascript
'use client'

import { useState } from 'react';

export default function YourComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  return (
    <div className="your-classes">
      {/* Your JSX */}
    </div>
  );
}
```

2. **Use in Page**:
```javascript
import YourComponent from '../../components/YourComponent';

export default function YourPage() {
  return <YourComponent prop1="value" prop2={data} />;
}
```

## Adding New Features

### Example: Adding a New Channel Type

1. **Update Trigger Types** (`backend/src/config/trigger-types.ts`):
```typescript
export const NEWCHANNEL_TRIGGERS: TriggerTypeConfig[] = [
  {
    id: 'newchannel_message',
    name: 'New Channel Message',
    channel: 'newchannel',
    // ... configuration
  }
];

export const ALL_TRIGGERS = [
  ...MESSENGER_TRIGGERS,
  ...INSTAGRAM_TRIGGERS,
  ...NEWCHANNEL_TRIGGERS  // Add here
];
```

2. **Update Prisma Schema** (`backend/prisma/schema.prisma`):
```prisma
model Channel {
  id        String   @id @default(cuid())
  type      String   // 'instagram', 'messenger', 'newchannel'
  // ... other fields
}
```

3. **Push Schema Changes**:
```bash
npx prisma db push
npx prisma generate
```

4. **Create Integration Module** (`backend/src/modules/newchannel/`):
```typescript
// newchannel.service.ts
export class NewChannelService {
  async connect(credentials) {
    // Connection logic
  }

  async sendMessage(userId, message) {
    // Send message logic
  }
}
```

5. **Update Frontend**:
   - Add channel icon
   - Update channel selector
   - Add channel-specific configuration

### Example: Adding a New Node Type

1. **Create Node Component** (`frontend/components/nodes/YourNode.js`):
```javascript
import { Handle, Position } from 'reactflow';

export default function YourNode({ data }) {
  return (
    <div className="node-style">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

2. **Register in FlowBuilder** (`frontend/components/FlowBuilder.js`):
```javascript
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  your: YourNode,  // Add here
  // ... other types
};
```

3. **Add to Sidebar** (`frontend/components/Sidebar.js`):
```javascript
const yourTypes = [
  { type: 'your_action', label: 'Your Action', icon: '🎯' }
];
```

## Testing

### Manual Testing

1. **Backend API Testing**
   ```bash
   # Health check
   curl http://localhost:3001/health

   # Test specific endpoint
   curl http://localhost:3001/api/triggers/types?channel=instagram
   ```

2. **Frontend Testing**
   - Open http://localhost:3002
   - Check browser console for errors
   - Test user flows manually

### Database Testing

```bash
# Open Prisma Studio
cd backend
npx prisma studio

# Access at http://localhost:5555
# Browse and edit data visually
```

## Debugging

### Backend Debugging

1. **Enable Debug Logs**
   ```typescript
   // In server.ts or any module
   fastify.log.info('Debug message', { data });
   fastify.log.error('Error message', error);
   ```

2. **Check Server Output**
   Terminal running `npm run dev` shows all logs

3. **Database Queries**
   ```typescript
   // Enable query logging
   const prisma = new PrismaClient({ log: ['query'] });
   ```

### Frontend Debugging

1. **Console Logging**
   ```javascript
   console.log('🔍 Debug:', data);
   console.error('❌ Error:', error);
   ```

2. **React DevTools**
   Install React Developer Tools browser extension

3. **Network Tab**
   Check browser Network tab for API calls

### Common Issues

**Issue: Frontend can't connect to backend**
```bash
# Check backend is running
curl http://localhost:3001/health

# Check NEXT_PUBLIC_API_URL in frontend/.env.local
cat frontend/.env.local
```

**Issue: Database changes not reflecting**
```bash
# Regenerate Prisma client
cd backend
npx prisma generate

# Restart backend server
```

**Issue: Webhooks not working**
```bash
# Check ngrok is running
curl http://localhost:4040/api/tunnels

# Verify webhook URL in Facebook Developer Console
```

## Common Tasks

### Reset Database
```bash
cd backend
npx prisma db push --force-reset
```

### Add New Database Field
1. Edit `backend/prisma/schema.prisma`
2. Run `npx prisma db push`
3. Run `npx prisma generate`
4. Restart backend

### Update Dependencies
```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

### Clear Node Modules (if issues)
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Generate Prisma Client After Schema Changes
```bash
cd backend
npx prisma generate
```

### View Database with Prisma Studio
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

## Performance Tips

### Backend
- Use Prisma's `select` to only fetch needed fields
- Implement pagination for list endpoints
- Use connection pooling for database

### Frontend
- Use React.memo for expensive components
- Implement lazy loading for large lists
- Optimize ReactFlow performance with useMemo

## Code Style

### TypeScript/JavaScript
- Use meaningful variable names
- Add comments for complex logic
- Use TypeScript types in backend
- Handle errors properly

### React
- Use functional components
- Implement proper error boundaries
- Keep components focused and small
- Use React hooks appropriately

### Git Commits
- Write descriptive commit messages
- One logical change per commit
- Reference issues if applicable

---

**Happy coding! 🚀**
