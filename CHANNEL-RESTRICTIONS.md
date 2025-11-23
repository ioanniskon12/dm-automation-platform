# Channel-Specific Restrictions Guide

This document outlines the capabilities, limitations, and restrictions for each messaging channel supported by the DM Automation Platform.

## Overview

Each messaging platform has different capabilities and restrictions for sending messages and media. The platform automatically validates messages based on these restrictions before sending.

---

## Facebook Messenger

**Channel Type:** `messenger`

### Capabilities
- ✅ Text messages
- ✅ Images
- ✅ Videos
- ✅ Audio files
- ✅ Documents

### Limitations

#### Text
- **Max Length:** 2,000 characters

#### Images
- **Max Size:** 25 MB
- **Supported Formats:** jpg, jpeg, png, gif, bmp, webp

#### Videos
- **Max Size:** 25 MB
- **Supported Formats:** mp4, mov, avi, mkv

#### Audio
- **Max Size:** 25 MB
- **Supported Formats:** mp3, aac, m4a, wav, ogg

#### Documents
- **Max Size:** 25 MB
- **Supported Formats:** pdf, doc, docx, xls, xlsx, ppt, pptx, txt

### Notes
- Most generous file size limits (25MB across all media types)
- Supports widest variety of file formats

---

## Instagram Direct

**Channel Type:** `instagram`

### Capabilities
- ✅ Text messages
- ✅ Images
- ✅ Videos
- ✅ Audio files
- ❌ Documents (NOT SUPPORTED)

### Limitations

#### Text
- **Max Length:** 1,000 characters

#### Images
- **Max Size:** 8 MB
- **Supported Formats:** jpg, jpeg, png, bmp, ico

#### Videos
- **Max Size:** 25 MB
- **Supported Formats:** mp4, mov, ogg, avi, webm
- **⚠️ Special Restriction:** Videos limited to 15 seconds

#### Audio
- **Max Size:** 25 MB
- **Supported Formats:** aac, m4a, wav, mp4

### Additional Restrictions
- **Rate Limit:** 200 messages per conversation per hour
- **No Document Support:** Cannot send PDF, Word, Excel, etc.

### Notes
- Smaller image size limit compared to Messenger (8MB vs 25MB)
- Video duration limit of 15 seconds
- No document sharing capability

---

## WhatsApp Business

**Channel Type:** `whatsapp`

### Capabilities
- ✅ Text messages
- ✅ Images
- ✅ Videos
- ✅ Audio files
- ✅ Documents

### Limitations

#### Text
- **Max Length:** 4,096 characters

#### Images
- **Max Size:** 5 MB
- **Supported Formats:** jpg, jpeg, png (strict format support)

#### Videos
- **Max Size:** 16 MB
- **Supported Formats:** mp4, 3gpp

#### Audio
- **Max Size:** 16 MB
- **Supported Formats:** aac, mp4, mpeg, amr, ogg

#### Documents
- **Max Size:** 100 MB (largest document support!)
- **Supported Formats:** pdf, doc, docx, xls, xlsx, ppt, pptx, txt

### Additional Restrictions
- **Template Messages Required:** For initial contact with users
- **Template Media Headers:** Must be < 15 MB (if using media in templates)

### Notes
- Best for document sharing (100MB limit)
- Longest text messages (4,096 characters)
- Strict format requirements (fewer supported image formats)
- Template approval process required for initiating conversations

---

## Telegram

**Channel Type:** `telegram`

### Capabilities
- ✅ Text messages
- ✅ Images
- ✅ Videos
- ✅ Audio files
- ✅ Documents

### Limitations

#### Text
- **Max Length:** 4,096 characters

#### Images (as photos)
- **Max Size:** 10 MB
- **Supported Formats:** jpg, jpeg, png, gif, bmp, webp
- **Note:** Photos sent as documents can be up to 50MB

#### Videos
- **Max Size:** 50 MB
- **Supported Formats:** mp4, mov, avi, mkv, webm
- **⚠️ Special Restriction:** Video messages limited to 1 minute (rounded square format)

#### Audio
- **Max Size:** 50 MB
- **Supported Formats:** mp3, m4a, ogg, wav

#### Documents
- **Max Size:** 50 MB (standard API) / 2 GB (with local server)
- **Supported Formats:** pdf, doc, docx, xls, xlsx, zip, txt, **any format**

### Additional Restrictions
- **Video Messages:** Limited to 1 minute for rounded square format
- **Local Server:** Can support up to 2GB files (requires setup)

### Notes
- Most flexible file format support (accepts any file type as document)
- Large file support (50MB standard, 2GB with local server)
- Good for sharing large media files

---

## SMS (Text Messages)

**Channel Type:** `sms`

### Capabilities
- ✅ Text messages ONLY
- ❌ No media support whatsoever

### Limitations

#### Text
- **Max Length:** 1,600 characters
- **Standard SMS:** 160 characters per segment
- **Extended SMS:** Messages > 160 chars split into multiple segments (153 chars each)

### Additional Restrictions
- **No Media:** Cannot send images, videos, audio, or documents
- **Character Encoding:** Some special characters count as multiple characters
- **Segmentation:** Long messages are split and charged per segment

### Notes
- Text-only communication
- Best for simple notifications and alerts
- Cost-effective for basic messaging
- Segments calculation:
  - First segment: 160 characters
  - Additional segments: 153 characters each
  - Example: 300-character message = 2 segments

---

## MMS (Multimedia Messages)

**Channel Type:** `mms`

### Capabilities
- ✅ Text messages
- ✅ Images
- ✅ Videos
- ✅ Audio files
- ❌ Documents (NOT SUPPORTED)

### Limitations

#### Text
- **Max Length:** 1,600 characters

#### Images
- **Recommended:** 300 KB (for best compatibility)
- **Maximum:** 500 KB - 1 MB (carrier-dependent)
- **Supported Formats:** jpg, jpeg, png, gif

#### Videos
- **Recommended:** 300 KB
- **Maximum:** 500 KB - 1 MB (carrier-dependent)
- **Supported Formats:** mp4, 3gpp

#### Audio
- **Recommended:** 300 KB
- **Maximum:** 500 KB - 1 MB (carrier-dependent)
- **Supported Formats:** mp3, amr, wav

### Carrier-Specific Limits
- **AT&T:** 1 MB
- **Verizon:** 1.7 MB
- **T-Mobile:** 3 MB

### Additional Restrictions
- **Carrier Compatibility:** Some carriers may not support MMS
- **File Size Critical:** Keep files under 300KB for best delivery rates
- **Compression Recommended:** Large files may fail or arrive corrupted

### Notes
- Most restrictive file size limits
- Carrier-dependent delivery
- Not all carriers support MMS
- Best practice: Keep everything under 300KB

---

## How Validation Works

### Backend Validation

When you send a message through the platform, the backend automatically validates:

1. **Channel Support:** Does this channel support the media type you're sending?
2. **File Size:** Is the file within the channel's size limit?
3. **File Format:** Is the file format supported by this channel?
4. **Text Length:** Is the text within the character limit?

### Example Validation Errors

```json
// Trying to send a document via Instagram
{
  "success": false,
  "error": "Instagram Direct does not support document files"
}

// File too large for WhatsApp
{
  "success": false,
  "error": "File size (8.50MB) exceeds WhatsApp Business limit of 5.00MB for image files"
}

// Unsupported format
{
  "success": false,
  "error": "File format '.tiff' is not supported by WhatsApp Business. Supported formats: jpg, jpeg, png"
}

// Text too long for Instagram
{
  "success": false,
  "error": "Text length (1500) exceeds Instagram Direct limit of 1000 characters"
}
```

---

## Best Practices

### 1. Choose the Right Channel

- **Large Documents (>25MB):** Use WhatsApp (100MB limit)
- **Large Media Files:** Use Telegram (50MB standard, 2GB with local server)
- **Quick Text Updates:** Use SMS
- **Image-Heavy Communication:** Use Messenger or Telegram
- **Short Videos:** Use Instagram (but note 15-second limit)

### 2. Optimize Media Files

- **Images:** Compress images to reduce file size without losing quality
- **Videos:** Compress videos, especially for MMS (target 300KB)
- **Documents:** Use PDF format for best compatibility
- **Audio:** Use MP3 format for broadest support

### 3. Handle Restrictions Gracefully

```javascript
// Example: Resize images for different channels
if (channelType === 'instagram' && imageSize > 8 * 1024 * 1024) {
  // Compress image to under 8MB
  image = await compressImage(image, { maxSizeMB: 7.5 });
}

if (channelType === 'whatsapp' && imageSize > 5 * 1024 * 1024) {
  // Compress image to under 5MB
  image = await compressImage(image, { maxSizeMB: 4.5 });
}
```

### 4. Monitor Character Limits

```javascript
// Example: Truncate or split long messages
if (channelType === 'instagram' && message.length > 1000) {
  // Option 1: Truncate
  message = message.substring(0, 997) + '...';

  // Option 2: Split into multiple messages
  const parts = splitMessage(message, 1000);
  for (const part of parts) {
    await sendMessage(part);
  }
}
```

---

## Channel Comparison Table

| Feature | Messenger | Instagram | WhatsApp | Telegram | SMS | MMS |
|---------|-----------|-----------|----------|----------|-----|-----|
| **Text Length** | 2,000 | 1,000 | 4,096 | 4,096 | 1,600 | 1,600 |
| **Image Size** | 25 MB | 8 MB | 5 MB | 10 MB | ❌ | 300 KB* |
| **Video Size** | 25 MB | 25 MB | 16 MB | 50 MB | ❌ | 300 KB* |
| **Audio Size** | 25 MB | 25 MB | 16 MB | 50 MB | ❌ | 300 KB* |
| **Document Size** | 25 MB | ❌ | 100 MB | 50 MB | ❌ | ❌ |
| **Image Formats** | 6 | 5 | 3 | 6 | ❌ | 4 |
| **Video Formats** | 4 | 5 | 2 | 5 | ❌ | 2 |
| **Special Limits** | None | 15s videos<br/>200 msgs/hr | Templates for<br/>initial contact | 1min video<br/>messages | Segments<br/>by 160 chars | Carrier<br/>dependent |

\* Recommended for best compatibility

---

## Implementation Details

### Configuration File

All channel limits are defined in:
```
/backend/src/config/channel-limits.ts
```

### Validation Functions

```typescript
// Validate text for a channel
validateTextForChannel(channelType: string, text: string)
// Returns: { valid: boolean, error?: string, warning?: string }

// Validate file for a channel
validateFileForChannel(
  channelType: string,
  fileType: 'image' | 'video' | 'audio' | 'document',
  fileSize: number,
  fileName: string
)
// Returns: { valid: boolean, error?: string }
```

### Usage in Reply Endpoint

Located in: `/backend/src/modules/inbox/index.ts` (lines 224-268)

```typescript
// Text validation
if (messageText) {
  const textValidation = validateTextForChannel(channelType, messageText);
  if (!textValidation.valid) {
    return { success: false, error: textValidation.error };
  }
}

// File validation
if (fileData) {
  const fileType = determineFileType(mimeType);
  const fileValidation = validateFileForChannel(
    channelType,
    fileType,
    fileData.length,
    fileName
  );
  if (!fileValidation.valid) {
    return { success: false, error: fileValidation.error };
  }
}
```

---

## Future Enhancements

### Planned Features

1. **Frontend Validation**
   - Show/hide file upload button based on channel capabilities
   - Display file size limits in UI
   - Real-time character counter for text messages
   - Format validation before upload

2. **Smart Compression**
   - Automatic image compression for channels with low limits
   - Video transcoding for format compatibility
   - Audio conversion for optimal file size

3. **Multi-Message Splitting**
   - Automatically split long text into multiple messages
   - Preserve message context across splits
   - Smart splitting at sentence boundaries

4. **Format Conversion**
   - Convert unsupported formats to supported ones
   - HEIC to JPG conversion for WhatsApp
   - Video format conversion for compatibility

---

## Troubleshooting

### File Upload Failures

**Problem:** File upload rejected by channel

**Solutions:**
1. Check file size against channel limits
2. Verify file format is supported
3. Try compressing the file
4. Consider using a different channel with higher limits

### Character Limit Errors

**Problem:** Message too long for channel

**Solutions:**
1. Shorten message text
2. Split into multiple messages
3. Use a channel with higher limits (WhatsApp/Telegram: 4,096 vs Instagram: 1,000)

### Format Not Supported

**Problem:** File format rejected

**Solutions:**
1. Convert to supported format (e.g., PNG to JPG for WhatsApp)
2. Use a channel with broader format support (Telegram accepts any format)
3. Check the supported formats table above

---

## Resources

### Official Documentation

- **Facebook Messenger API:** https://developers.facebook.com/docs/messenger-platform/send-messages
- **Instagram Messaging API:** https://developers.facebook.com/docs/messenger-platform/instagram
- **WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **SMS/MMS Standards:** GSMA SMS/MMS Specifications

### Related Files

- Channel limits config: `/backend/src/config/channel-limits.ts`
- Reply endpoint: `/backend/src/modules/inbox/index.ts`
- Deployment guide: `/DEPLOYMENT-GUIDE.md`

---

**Last Updated:** 2025-11-23
**Version:** 1.0
