# Facebook Profile Pictures - Permission Requirements

## Current Status

✅ **Working**: Profile pictures for ACCEPTED conversations (like Giannis)
❌ **Not Working**: Profile pictures for MESSAGE REQUESTS (like Stella)

## Why Message Request Profile Pictures Don't Work

Facebook's Graph API has a **privacy restriction** that prevents accessing user profile data for unaccepted message requests without special permissions.

### Error You're Seeing

```
Error 100: Unsupported get request. Object with ID 'XXXXXXXXX' does not exist,
cannot be loaded due to missing permissions, or does not support this operation.
```

## Solution: Request Advanced Access

To get profile pictures for ALL users (including message requests), you need to:

### Step 1: Go to Facebook App Dashboard

1. Visit [Facebook for Developers](https://developers.facebook.com/apps)
2. Select your app ("dm-automation-platform" or your app name)

### Step 2: Request Advanced Access

1. In the left sidebar, click **"App Review"** → **"Permissions and Features"**
2. Find **"Business Asset User Profile Access"** in the list
3. Click **"Request Advanced Access"**

### Step 3: Complete App Review (if required)

Facebook may require:
- **Business Verification**: Verify your business/organization
- **App Review Submission**: Explain why you need this permission
- **Use Case Documentation**: Describe how you'll use profile data

**Typical justification:**
```
We need "Business Asset User Profile Access" to display user profile pictures
in our customer inbox for message requests. This helps our support team identify
customers and provide personalized service.
```

### Step 4: Required Permissions Checklist

Make sure you also have Advanced Access for:
- ✅ `pages_messaging` - Send and receive messages
- ✅ `pages_read_user_content` - Read message content
- ✅ `pages_manage_metadata` - Manage page settings
- ✅ **`Business Asset User Profile Access`** - **Access profile pictures**

## Current Workaround

Until you get Advanced Access, the system will:

1. ✅ Show **real profile pictures** for accepted conversations
2. ✅ Show **generated avatars** for message requests (colored background with initials)
3. ✅ **Automatically retry** every 5 minutes during sync
4. ✅ **Auto-update** profile pictures once conversation is accepted on Facebook

### How Generated Avatars Work

For users without profile pictures (like Stella), the system generates an avatar using:
- User's name initials
- Random colored background
- Via `ui-avatars.com` API

Example: `Stella Nikolaou` → "SN" on colored circle

## Alternative: Accept Message Requests on Facebook

If you **manually accept** the message request directly on Facebook:
1. Go to your Facebook Page
2. Go to Inbox → Message Requests
3. Accept Stella's conversation
4. Wait 5 minutes for auto-sync (or run manual sync)
5. Profile picture will appear automatically ✅

## Testing Current Status

Run this command to see which users have profile pictures:

```bash
cd ~/Desktop/dm-automation-platform/backend
npx tsx sync-facebook.ts
```

Look for:
- ✅ `Fetched profile picture from User Profile API` - Working
- ⚠️ `Profile API error (100): missing permissions` - Needs Advanced Access

## Timeline

- **Quick fix** (5 minutes): Accept message requests manually on Facebook
- **Proper fix** (1-2 weeks): Request "Business Asset User Profile Access" through App Review
- **Automatic**: System retries every 5 minutes and auto-updates when permissions granted

## Current Implementation

The system currently:
1. Tries to fetch from conversation participants data
2. Tries Messenger Platform User Profile API (`profile_pic` field)
3. Falls back to Graph API picture endpoint
4. If all fail, uses generated avatar
5. Retries every 5 minutes during auto-sync
6. Automatically updates when photo becomes available

## Need Help?

- Facebook App Review docs: https://developers.facebook.com/docs/app-review
- Business Verification: https://www.facebook.com/business/help/
- Graph API docs: https://developers.facebook.com/docs/graph-api
