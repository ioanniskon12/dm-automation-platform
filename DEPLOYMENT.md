# DM Automation Platform - Deployment Details

## Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://dm-automation-platform.vercel.app |
| **Backend** | https://dm-automation-platform-production.up.railway.app |
| **Database** | Neon PostgreSQL |

## Login Credentials

| Email | Password |
|-------|----------|
| gianniskon12@gmail.com | admin123 |
| sotiris040197@gmail.com | admin123 |

## Infrastructure

### Frontend (Vercel)
- Platform: Vercel
- Framework: Next.js
- Repository: https://github.com/ioanniskon12/dm-automation-platform
- Branch: main
- Auto-deploy: Enabled

### Backend (Railway)
- Platform: Railway
- Runtime: Node.js 20 (node:20-slim)
- Port: 3003
- Health Check: https://dm-automation-platform-production.up.railway.app/health

### Database (Neon)
- Platform: Neon PostgreSQL
- Region: eu-central-1 (AWS)
- Connection String: `postgresql://neondb_owner:npg_WYcU7ighSkH4@ep-billowing-brook-agwpc3t7-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require`

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://dm-automation-platform-production.up.railway.app
OPENAI_API_KEY=<your-openai-key>
```

### Backend (.env)
```
DATABASE_URL=postgresql://neondb_owner:npg_WYcU7ighSkH4@ep-billowing-brook-agwpc3t7-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
PORT=3003
NODE_ENV=production
```

## Remaining Setup

1. **Configure Frontend Environment Variables in Vercel**
   - Add `NEXT_PUBLIC_API_URL` pointing to Railway backend

2. **Facebook App Setup (for real DM integration)**
   - Create Facebook App at developers.facebook.com
   - Configure Instagram Basic Display API
   - Add OAuth redirect URLs

3. **Custom Domain (optional)**
   - Configure in Vercel dashboard
   - Update DNS settings

## Estimated Monthly Costs

| Service | Cost |
|---------|------|
| Vercel (Hobby) | Free |
| Railway | ~$5-20/month |
| Neon (Free tier) | Free |
| **Total** | ~$5-20/month |

---
Last Updated: January 2026
