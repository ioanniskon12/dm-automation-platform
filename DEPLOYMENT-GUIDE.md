# DM Automation Platform - Deployment Guide

## Table of Contents
1. [Current Development Setup](#current-development-setup)
2. [How It Works](#how-it-works)
3. [Production Deployment](#production-deployment)
4. [Facebook App Configuration](#facebook-app-configuration)
5. [Troubleshooting](#troubleshooting)

---

## Current Development Setup

### Architecture Overview

**Frontend (Next.js)**
- Port: `3002`
- Location: `/frontend`
- URL: `http://localhost:3002`

**Backend (Fastify)**
- Port: `3001`
- Location: `/backend`
- URL: `http://localhost:3001`

**Ngrok (Webhook Tunnel)**
- Tunnels: `localhost:3001` → Public URL
- Used for: Facebook webhooks in development
- Current URL: `https://jonna-spirantal-cleansingly.ngrok-free.dev` (changes on restart)

**Database (PostgreSQL + Prisma)**
- Connection configured in `backend/.env`
- All messages and conversations stored here

---

## How It Works

### Message Delivery System (Dual Approach)

#### 1. Webhooks (Primary - Instant Delivery)
- Facebook sends messages to your webhook URL instantly (< 1 second)
- Endpoint: `/api/webhooks/meta`
- Verify token: `sotiris_token_123` (configured in Facebook App)
- Works for users where Facebook sends webhooks (e.g., Giannis)

#### 2. Polling Sync (Backup - Every 10 seconds)
- Backend polls Facebook Graph API every 10 seconds
- Catches messages that webhooks miss
- Essential for users where webhooks don't work (e.g., Sotiris)
- Location: `backend/src/server.ts` lines 391-398

#### 3. Frontend Polling
- **Thread list**: Every 5 seconds (new chats appear quickly)
- **Open conversation**: Every 3 seconds (messages show fast)
- Change detection prevents flickering
- Location: `frontend/app/inbox/page.js`

### Current Performance
- Messages via webhooks: **< 1 second**
- Messages via backup sync: **~6-13 seconds**
- New chats in sidebar: **< 5 seconds**

---

## Production Deployment

### Prerequisites

#### 1. Domain & Hosting
You'll need:
- A domain name (e.g., `yourdomain.com`)
- Hosting service with HTTPS support:
  - **Recommended for Backend**: DigitalOcean, AWS EC2, Railway, Render
  - **Recommended for Frontend**: Vercel, Netlify, Cloudflare Pages
  - **Database**: Supabase, Railway, or your hosting provider

#### 2. Facebook App Approval
- Your app must be approved and in "Live" mode
- Required permissions:
  - `pages_messaging` - Send/receive messages
  - `pages_read_engagement` - Read page content
  - `pages_manage_metadata` - Manage page settings

### Step-by-Step Deployment

#### Step 1: Deploy Backend

1. **Choose hosting platform** (e.g., Railway, Render, DigitalOcean)

2. **Set environment variables** on hosting platform:
   ```bash
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_production_jwt_secret
   CORS_ORIGIN=https://yourdomain.com
   META_VERIFY_TOKEN=sotiris_token_123
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
   ```

3. **Deploy code**:
   ```bash
   # From /backend directory
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run build  # if you create a build script
   npm start
   ```

4. **Note your production URL**: `https://api.yourdomain.com`

#### Step 2: Deploy Frontend

1. **Update API URL** in `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

2. **Deploy to Vercel** (recommended):
   ```bash
   # From /frontend directory
   npm install
   vercel --prod
   ```
   Or push to GitHub and connect to Vercel

3. **Note your production URL**: `https://yourdomain.com`

#### Step 3: Configure Production Database

1. **Create production database** (PostgreSQL recommended)
   - Supabase (easiest): https://supabase.com
   - Railway: https://railway.app
   - Or your hosting provider

2. **Run migrations**:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

#### Step 4: Update Facebook Webhook URL

1. Go to Facebook Developer Console: https://developers.facebook.com
2. Select your app
3. Go to **Webhooks** section
4. Update Callback URL to: `https://api.yourdomain.com/api/webhooks/meta`
5. Verify token: `sotiris_token_123`
6. Subscribe to:
   - `messages`
   - `messaging_postbacks`
   - `message_deliveries`
   - `message_reads`

#### Step 5: Test Production Setup

1. **Test webhook**: Send a test message from Facebook
2. **Check logs**: Verify messages arrive via webhooks
3. **Test backup sync**: Ensure polling still works
4. **Test frontend**: Verify messages appear in UI

---

## Facebook App Configuration

### Development Mode (Current)
- Limited to test users, developers, and admins
- Webhooks work inconsistently
- Good for testing

### Live Mode (Production)
- Available to all users
- Webhooks work reliably
- Requires app review

### Getting Your App Approved

#### 1. Prepare Your App
- Complete app details and privacy policy
- Test all functionality thoroughly
- Document how you use each permission

#### 2. Submit for Review
1. Go to Facebook Developer Console
2. Select **App Review** → **Permissions and Features**
3. Request these permissions:
   - `pages_messaging`
   - `pages_read_engagement`
   - `pages_manage_metadata`
4. Provide screencast demonstrating your app
5. Explain how you use each permission
6. Submit for review (typically takes 3-7 days)

#### 3. After Approval
- Switch app to "Live" mode
- Update webhook subscriptions
- Test with real users
- Monitor for any issues

---

## Configuration Files Reference

### Backend Environment Variables (`backend/.env`)
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
CORS_ORIGIN="http://localhost:3002"
META_VERIFY_TOKEN="sotiris_token_123"
FACEBOOK_APP_ID="your_app_id"
FACEBOOK_APP_SECRET="your_app_secret"
FACEBOOK_PAGE_ACCESS_TOKEN="your_page_access_token"
```

### Frontend Environment Variables (`frontend/.env.local`)
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### Key Files to Review Before Deployment

#### Backend
- `src/server.ts` - Main server, webhook handlers, sync intervals
- `src/services/facebook-sync.service.ts` - Facebook Graph API integration
- `src/modules/inbox/index.ts` - Inbox API endpoints
- `prisma/schema.prisma` - Database schema

#### Frontend
- `app/inbox/page.js` - Main inbox UI, polling logic
- `app/api/inbox/threads/[id]/route.js` - Thread API proxy
- `app/api/inbox/[id]/reply/route.js` - Reply API proxy

---

## Production Optimizations

### Once Webhooks Work Reliably

After deployment and Facebook approval, you can optimize polling:

#### Reduce Backend Sync Frequency
In `backend/src/server.ts` line 392:
```javascript
// Change from 10 seconds to 30 seconds
const SYNC_INTERVAL = 30 * 1000; // 30 seconds
```

#### Keep Frontend Polling Responsive
Current settings are good:
- Thread list: 5 seconds
- Conversation: 3 seconds

### Why Keep Backup Sync?
Even in production, keep backup sync running because:
- Facebook webhooks can occasionally fail
- Network issues can cause missed webhooks
- Provides redundancy and reliability

---

## Troubleshooting

### Messages Not Arriving

**Check 1: Verify webhook is working**
```bash
# Check backend logs for webhook requests
# Should see: "Meta webhook received"
```

**Check 2: Verify backup sync is running**
```bash
# Check backend logs every 10 seconds for:
# "🔄 Running backup Facebook sync..."
```

**Check 3: Check Facebook permissions**
- Ensure app is approved
- Verify page access token is valid
- Check webhook subscriptions are active

### Webhooks Not Working for Some Users

**Cause**: App in Development Mode
- Development apps only receive webhooks for test users
- **Solution**: Get app approved and switch to Live mode

**Cause**: Missing permissions
- **Solution**: Request and get approved for all required permissions

### Frontend Not Showing Messages

**Check 1: API connectivity**
```bash
# Test backend API
curl http://localhost:3001/api/inbox/threads

# Test in browser
http://localhost:3002/api/inbox/threads
```

**Check 2: CORS configuration**
- Verify `CORS_ORIGIN` in backend `.env` includes your frontend URL

**Check 3: Browser console**
- Open Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Database Issues

**Check connection**
```bash
cd backend
npx prisma studio
```
- Opens database browser at `http://localhost:5555`
- Verify tables exist and have data

**Reset database** (development only):
```bash
cd backend
npx prisma migrate reset
```

### Performance Issues

**Too much polling causing lag:**
- Increase polling intervals
- Reduce number of API calls
- Implement caching

**Database slow:**
- Add indexes to frequently queried fields
- Use database connection pooling
- Consider read replicas for high traffic

---

## Monitoring & Logging

### Production Monitoring Setup

#### 1. Application Monitoring
- **Recommended**: Sentry for error tracking
- **Setup**: Install `@sentry/node` in backend, `@sentry/nextjs` in frontend

#### 2. Server Monitoring
- Monitor CPU, memory, disk usage
- Set up alerts for downtime
- Track API response times

#### 3. Database Monitoring
- Monitor connection pool usage
- Track slow queries
- Set up backup schedule

#### 4. Log Management
- Use structured logging (JSON format)
- Centralize logs (e.g., CloudWatch, Papertrail)
- Set up log retention policy

---

## Quick Reference Commands

### Starting Development Environment

```bash
# Terminal 1: Backend
cd /Users/ioanniskonstantinou/Desktop/dm-automation-platform/backend
PORT=3001 npm run dev

# Terminal 2: Frontend
cd /Users/ioanniskonstantinou/Desktop/dm-automation-platform/frontend
npm run dev -- --port 3002

# Terminal 3: Ngrok (for webhooks)
ngrok http 3001
```

### Database Commands

```bash
# Open Prisma Studio (database browser)
cd backend && npx prisma studio

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy
```

### Useful Debug Commands

```bash
# Check what's running on port 3001
lsof -ti:3001

# Kill process on port 3001
lsof -ti:3001 | xargs kill

# Check backend logs
cd backend && npm run dev

# Test webhook locally
curl -X POST http://localhost:3001/api/webhooks/meta \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## Support & Resources

### Official Documentation
- **Facebook Messenger Platform**: https://developers.facebook.com/docs/messenger-platform
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma**: https://www.prisma.io/docs
- **Fastify**: https://www.fastify.io/docs/latest

### Useful Tools
- **Ngrok**: https://ngrok.com (development webhooks)
- **Postman**: Test API endpoints
- **Prisma Studio**: Visual database browser
- **Facebook Graph API Explorer**: https://developers.facebook.com/tools/explorer

---

## Changelog

### Current Version (Development)
- ✅ Dual message delivery (webhooks + backup sync)
- ✅ Auto-scroll for new messages
- ✅ Profile picture fetching
- ✅ Media handling (images, videos)
- ✅ Multi-channel support (Facebook, Instagram, WhatsApp, Telegram)
- ✅ Change detection to prevent UI flickering
- ✅ Fast polling for responsive UI

### Performance Settings
- Backend sync: 10 seconds
- Frontend thread list: 5 seconds
- Frontend conversation: 3 seconds

---

## Contact & Next Steps

When you're ready to deploy to production:
1. Review this document thoroughly
2. Set up hosting accounts
3. Submit Facebook app for review
4. Deploy backend and frontend
5. Update webhook URLs
6. Test thoroughly with real users

Good luck with your deployment! 🚀
