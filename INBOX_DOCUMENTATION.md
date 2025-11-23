# DM Automation Platform - Inbox Documentation

## Overview

The inbox feature provides a unified interface to manage conversations from Facebook Messenger (and other platforms). It automatically syncs conversations, displays profile pictures, and enables bidirectional messaging.

## Features

✅ **Automatic Conversation Sync** - Fetches all conversations every 5 minutes
✅ **Profile Pictures** - Shows user avatars (real or generated)
✅ **Bidirectional Messaging** - Send and receive messages
✅ **Message Requests Support** - Syncs unaccepted conversations
✅ **Real-time Updates** - Webhooks for instant message delivery
✅ **Read/Unread Indicators** - Track conversation status
✅ **Multi-channel Support** - Ready for Instagram, WhatsApp, Telegram

---

## Getting Started

### 1. Start the Backend

```bash
cd ~/Desktop/dm-automation-platform/backend
npm run dev
```

Server runs on: `http://localhost:3001`

### 2. Start the Frontend

```bash
cd ~/Desktop/dm-automation-platform/frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 3. Access the Inbox

Open: `http://localhost:3000/inbox`

---

## Facebook Integration

### Connected Page

**Page Name**: Apechat
**Platform**: Facebook Messenger
**Status**: Connected ✅

### How It Works

1. **Webhooks** - Facebook sends real-time notifications when messages arrive
2. **Auto-sync** - Background job runs every 5 minutes to fetch all conversations
3. **Manual Sync** - Run `npx tsx sync-facebook.ts` to sync immediately

### Webhook URL

```
https://your-domain.com/api/webhooks/meta
```

Handles both Instagram and Messenger messages.

---

## Profile Pictures

### Current Behavior

| User Type | Profile Picture | Source |
|-----------|----------------|--------|
| Accepted conversations | ✅ Real photo | Facebook Graph API |
| Message requests | ⚠️ Generated avatar | ui-avatars.com |
| Test users | ✅ Real photo | Facebook Graph API |

### Why Some Pictures Don't Work

Facebook's API has a **privacy restriction** that prevents accessing profile pictures for unaccepted message requests without the "Business Asset User Profile Access" permission with Advanced Access.

### Solutions

#### Option 1: Accept Message Requests (Quick - 30 seconds)

1. Go to Facebook Page → Inbox → Message Requests
2. Accept the conversation
3. Wait 5 minutes for auto-sync (or run manual sync)
4. Profile picture appears ✅

#### Option 2: Request Advanced Access (Permanent - 1-7 days)

1. Go to [Facebook App Dashboard](https://developers.facebook.com/apps)
2. Select your app
3. Left sidebar: **App Review** → **Permissions and Features**
4. Find: **Business Asset User Profile Access**
5. Click: **Request Advanced Access**
6. Fill out form explaining use case
7. Submit and wait for approval

**Use Case Example:**
```
We need to display user profile pictures in our customer inbox
to help our support team identify and personalize interactions
with customers who message our Facebook Page.
```

See `FACEBOOK_PERMISSIONS_GUIDE.md` for detailed instructions.

---

## API Endpoints

### Get All Threads

```bash
GET /api/inbox/threads
```

**Response:**
```json
{
  "success": true,
  "threads": [
    {
      "id": "thread-uuid",
      "platform": "messenger",
      "user": {
        "name": "John Doe",
        "username": "johndoe",
        "avatar": "https://..."
      },
      "lastMessage": "Hello!",
      "timestamp": "2025-01-18T10:30:00Z",
      "unread": true
    }
  ]
}
```

### Get Thread Messages

```bash
GET /api/inbox/threads/:id
```

**Response:**
```json
{
  "success": true,
  "thread": {
    "id": "thread-uuid",
    "platform": "messenger",
    "user": { ... },
    "messages": [
      {
        "id": 1,
        "sender": "user",
        "text": "Hello!",
        "timestamp": "2025-01-18T10:30:00Z",
        "senderAvatar": "https://...",
        "senderName": "John Doe"
      }
    ]
  }
}
```

### Send Reply

```bash
POST /api/inbox/:id/reply
Content-Type: application/json

{
  "message": "Thanks for your message!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply sent successfully",
  "messageId": "m_xxx"
}
```

### Mark Thread as Read

```bash
POST /api/inbox/:id/mark-read
```

---

## Manual Sync

### Run Facebook Sync

```bash
cd ~/Desktop/dm-automation-platform/backend
npx tsx sync-facebook.ts
```

**Output Example:**
```
🔄 Starting Facebook conversation sync...
📱 Syncing channel: Apechat
📬 Found 2 conversations
👤 Processing: Stella Nikolaou
   ⚠️  Cannot access profile picture (likely message request)
👤 Processing: Giannis Konstantinou
   ✅ Fetched profile picture from User Profile API

📊 Sync Summary:
   Total users: 2
   ✅ With profile pictures: 1
   ⚠️  Using generated avatars: 1
```

---

## Database Schema

### Tables Used

**inboxThread**
- `id` - Thread UUID
- `workspaceId` - Workspace reference
- `channelId` - Channel reference (Messenger, Instagram, etc.)
- `userId` - User contact reference
- `lastMessage` - Last message text
- `lastMessageAt` - Timestamp
- `unreadCount` - Number of unread messages
- `status` - open/closed

**userContact**
- `id` - Contact UUID
- `externalId` - Platform user ID (PSID for Facebook)
- `name` - User's name
- `handle` - Username/handle
- `fields` - JSON with `profilePicture` URL

**event**
- `id` - Event UUID
- `type` - message_in/message_out
- `payload` - JSON with message data
- `timestamp` - When message was sent

---

## Troubleshooting

### Profile Pictures Not Showing

**Check:**
1. Is the conversation accepted on Facebook?
2. Is "Business Asset User Profile Access" approved?
3. Run manual sync: `npx tsx sync-facebook.ts`
4. Check logs for permission errors

**Generated Avatars:**
- Show user's initials (e.g., "SN" for Stella Nikolaou)
- Colored background via ui-avatars.com
- Automatically replaced when real photo becomes available

### Messages Not Syncing

**Check:**
1. Is the backend running? `http://localhost:3001/health`
2. Is the channel connected? Check database or Prisma Studio
3. Is the webhook configured in Facebook App?
4. Check webhook logs in server console

**Manual sync:**
```bash
npx tsx sync-facebook.ts
```

### Webhook Not Receiving Messages

**Verify:**
1. Webhook URL is publicly accessible (use ngrok for local dev)
2. Verify token matches in `.env`: `META_VERIFY_TOKEN`
3. Check Facebook App → Webhooks → Subscriptions
4. Test webhook: Send message to page and check server logs

---

## Configuration

### Environment Variables

Located in: `backend/.env`

```bash
# Database
DATABASE_URL="postgresql://..."

# Facebook
FACEBOOK_APP_ID="your-app-id"
FACEBOOK_APP_SECRET="your-app-secret"
FACEBOOK_PAGE_ACCESS_TOKEN="your-page-token"
META_VERIFY_TOKEN="your-webhook-verify-token"

# Server
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000
```

### Auto-sync Interval

Located in: `backend/src/server.ts`

```typescript
// Current: 5 minutes
const SYNC_INTERVAL = 5 * 60 * 1000;

// To change:
const SYNC_INTERVAL = 2 * 60 * 1000; // 2 minutes
```

---

## File Structure

```
dm-automation-platform/
├── backend/
│   ├── src/
│   │   ├── server.ts                      # Main server & webhooks
│   │   ├── services/
│   │   │   └── facebook-sync.service.ts   # Auto-sync service
│   │   └── modules/
│   │       └── inbox/
│   │           ├── index.ts               # Inbox API endpoints
│   │           └── sync.js                # Manual sync endpoint
│   ├── sync-facebook.ts                   # CLI sync script
│   ├── FACEBOOK_PERMISSIONS_GUIDE.md      # Permission instructions
│   └── .env                               # Configuration
└── frontend/
    └── app/
        └── inbox/
            └── page.js                    # Inbox UI
```

---

## Testing

### Test Message Flow

1. Send message from Facebook Messenger to your page
2. Check webhook receives it: Look for logs in backend console
3. Message appears in inbox: Refresh `http://localhost:3000/inbox`
4. Reply from inbox: Type message and send
5. Verify delivery: Check Facebook Messenger

### Test Sync

```bash
# Run manual sync
npx tsx sync-facebook.ts

# Check results
curl http://localhost:3001/api/inbox/threads | jq
```

---

## Roadmap

### Completed ✅
- Facebook Messenger integration
- Profile picture support (with fallback)
- Bidirectional messaging
- Auto-sync every 5 minutes
- Webhook real-time updates
- Message request support

### Coming Soon 🚧
- Instagram Direct Messages
- WhatsApp Business
- Telegram
- Message templates
- Quick replies
- AI-powered responses
- Analytics dashboard

---

## Support

### Documentation Files

- `INBOX_DOCUMENTATION.md` - This file (general usage)
- `FACEBOOK_PERMISSIONS_GUIDE.md` - Detailed permission instructions
- `README.md` - Project overview

### Database Management

View/edit data with Prisma Studio:
```bash
cd backend
npx prisma studio
```

Access: `http://localhost:5555`

### Logs

**Backend logs:** Terminal where `npm run dev` is running
**Sync logs:** Output from `npx tsx sync-facebook.ts`
**Webhook logs:** Server console when messages arrive

---

## Quick Commands Cheat Sheet

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Manual sync
cd backend && npx tsx sync-facebook.ts

# View database
cd backend && npx prisma studio

# Check health
curl http://localhost:3001/health

# Get threads
curl http://localhost:3001/api/inbox/threads

# Send message
curl -X POST http://localhost:3001/api/inbox/THREAD_ID/reply \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
```

---

## FAQ

**Q: Why is the profile picture a colored circle with initials?**
A: This is a generated avatar for users whose profile pictures can't be accessed (message requests). Accept the conversation on Facebook or request Advanced Access.

**Q: How often does it sync?**
A: Every 5 minutes automatically. You can also run manual sync anytime.

**Q: Can I use this with Instagram?**
A: The infrastructure is ready, just needs Instagram-specific integration (coming soon).

**Q: How do I test without a public URL?**
A: Use ngrok to expose your local server:
```bash
ngrok http 3001
# Use the https URL as webhook in Facebook App
```

**Q: Where are messages stored?**
A: PostgreSQL database via Prisma ORM. Check `prisma/schema.prisma` for schema.

---

## Last Updated

January 18, 2025

## Version

1.0.0
