# Facebook/Instagram Integration Setup Guide

This guide will walk you through setting up Facebook and Instagram integrations for your DM Automation Platform.

## Prerequisites

- Meta Developer Account (https://developers.facebook.com/)
- A Facebook Page (for Messenger and Instagram integration)
- Instagram Business Account connected to your Facebook Page

## Step 1: Configure Your Meta App

### 1.1 Access Your App

1. Go to https://developers.facebook.com/apps
2. Select your app or create a new one (choose "Business" type if creating new)

### 1.2 Add Required Products

In your app dashboard, add these products:

- **Facebook Login** - For OAuth authentication
- **Webhooks** - For receiving messages
- **Messenger** - For Facebook Messenger integration
- **Instagram** - For Instagram DM integration

### 1.3 Configure Facebook Login

1. Go to **Facebook Login** → **Settings**
2. Add these **Valid OAuth Redirect URIs**:
   ```
   http://localhost:3001/api/oauth/facebook/callback
   ```
3. Save changes

### 1.4 Get Your App Credentials

1. Go to **Settings** → **Basic**
2. Copy these values:
   - **App ID**
   - **App Secret** (click "Show" button)

### 1.5 Configure Webhooks

1. Go to **Webhooks** in the left menu
2. Click **Edit Subscription** for **Page**
3. Add Callback URL: `http://localhost:3001/api/webhooks/meta`
4. Add Verify Token: `your_custom_verify_token_here` (use any random string)
5. Subscribe to these fields:
   - messages
   - messaging_postbacks
   - messaging_optins
   - message_deliveries
   - message_reads
6. Click **Verify and Save**

**Note**: For local development, you'll need to use ngrok or similar tool to expose your local server:

```bash
ngrok http 3001
```

Then use the ngrok URL (e.g., `https://abc123.ngrok.io/api/webhooks/meta`)

## Step 2: Update Environment Variables

Update your backend `.env` file with your app credentials:

```env
# Meta (Facebook/Instagram/WhatsApp) Configuration
META_APP_ID="your_app_id_here"
META_APP_SECRET="your_app_secret_here"
META_VERIFY_TOKEN="your_custom_verify_token_here"
META_REDIRECT_URI="http://localhost:3001/api/oauth/facebook/callback"
```

Replace:

- `your_app_id_here` with your App ID
- `your_app_secret_here` with your App Secret
- `your_custom_verify_token_here` with the same token you used in webhook configuration

## Step 3: Test the OAuth Flow

### 3.1 Start Your Servers

Make sure both backend and frontend are running:

```bash
# Backend (already running)
cd backend && npm run dev

# Frontend (already running)
cd frontend && npm run dev
```

### 3.2 Initiate OAuth Flow

1. In your browser, go to: http://localhost:3001/api/oauth/facebook
2. This will return a JSON with an `authUrl`
3. Open the `authUrl` in your browser
4. You'll be redirected to Facebook to authorize the app
5. Select the Facebook Page you want to connect
6. After authorization, you'll be redirected back to your app

### 3.3 What Happens After OAuth

After successful authorization:

- User gets a long-lived access token
- All their Facebook Pages are fetched
- Instagram Business accounts linked to pages are retrieved
- Page access tokens are obtained
- User is redirected back to frontend with success status

## Step 4: Subscribe Page to Webhooks

After connecting, you need to subscribe your Facebook Page to webhooks:

```bash
curl -X POST http://localhost:3001/api/oauth/facebook/subscribe-webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "pageId": "YOUR_PAGE_ID",
    "pageAccessToken": "YOUR_PAGE_ACCESS_TOKEN"
  }'
```

You'll get these values from the OAuth callback response.

## Step 5: Test Receiving Messages

### 5.1 Send a Message to Your Page

1. Go to your Facebook Page
2. Send a message to the Page from a test account
3. Check your backend logs - you should see:
   ```
   Meta webhook received: { ... }
   Message received: { sender: '...', text: '...', timestamp: '...' }
   ```

### 5.2 Test Instagram DM

1. Go to your Instagram Business account
2. Send a DM to the account
3. Check backend logs for Instagram events

## Step 6: Test Sending Messages

### 6.1 Send Facebook Messenger Message

```bash
curl -X POST http://localhost:3001/api/facebook/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "pageAccessToken": "YOUR_PAGE_ACCESS_TOKEN",
    "recipientId": "RECIPIENT_PSID",
    "message": "Hello from DM Automation Platform!"
  }'
```

### 6.2 Send Instagram Direct Message

```bash
curl -X POST http://localhost:3001/api/facebook/send-instagram-message \
  -H "Content-Type: application/json" \
  -d '{
    "pageAccessToken": "YOUR_PAGE_ACCESS_TOKEN",
    "recipientId": "RECIPIENT_INSTAGRAM_ID",
    "message": "Hello from Instagram automation!"
  }'
```

## Important Notes

### For Production

When deploying to production:

1. Update `META_REDIRECT_URI` to your production domain
2. Update **Valid OAuth Redirect URIs** in Facebook app settings
3. Update webhook callback URL to your production domain
4. Switch app from Development to Live mode in Meta settings

### Testing with Real Users

Your app must be in **Development Mode** during testing. To test with real users:

1. Add testers in **Roles** → **Test Users**
2. Or submit your app for **App Review** to go live

### Rate Limits

- Meta has rate limits on API calls
- Store page access tokens securely (they're long-lived)
- Handle rate limit errors gracefully

### Security

- Never commit `.env` file to git
- Store access tokens securely in your database
- Validate webhook signatures (currently TODO in code)
- Use HTTPS in production

## Troubleshooting

### Webhook Verification Fails

- Ensure verify token matches exactly
- Check that webhook URL is accessible publicly (use ngrok for local dev)
- Verify SSL certificate is valid (in production)

### OAuth Redirect Fails

- Check redirect URI matches exactly in Facebook app settings
- Ensure no trailing slashes mismatch
- Check backend is running on correct port

### Messages Not Received

- Verify page subscription to webhooks
- Check webhook fields are subscribed
- Ensure app has necessary permissions
- Check backend logs for errors

## Next Steps

1. **Implement Token Storage**: Store access tokens in database instead of just returning them
2. **Add Signature Verification**: Implement webhook signature verification for security
3. **Build UI Integration**: Update frontend channel connection to initiate OAuth flow
4. **Handle Token Refresh**: Implement logic to refresh expired tokens
5. **Add WhatsApp**: Similar process for WhatsApp Business API
6. **Add Instagram Graph API**: For comments, stories, etc.

## API Endpoints Created

| Endpoint                                 | Method | Description                 |
| ---------------------------------------- | ------ | --------------------------- |
| `/api/oauth/facebook`                    | GET    | Get OAuth authorization URL |
| `/api/oauth/facebook/callback`           | GET    | Handle OAuth callback       |
| `/api/oauth/facebook/subscribe-webhooks` | POST   | Subscribe page to webhooks  |
| `/api/facebook/send-message`             | POST   | Send Messenger message      |
| `/api/facebook/send-instagram-message`   | POST   | Send Instagram DM           |
| `/api/webhooks/meta`                     | GET    | Webhook verification        |
| `/api/webhooks/meta`                     | POST   | Receive webhook events      |

## Support

For issues with Meta APIs:

- Meta Developer Docs: https://developers.facebook.com/docs
- Graph API Explorer: https://developers.facebook.com/tools/explorer
- Messenger Platform Docs: https://developers.facebook.com/docs/messenger-platform
- Instagram Platform Docs: https://developers.facebook.com/docs/instagram-api
