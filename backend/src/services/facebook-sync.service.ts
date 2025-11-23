import axios from 'axios';
import prisma from '../lib/prisma.js';

export class FacebookSyncService {
  private stats = {
    totalUsers: 0,
    withProfilePicture: 0,
    withoutProfilePicture: 0,
    permissionErrors: 0,
  };

  /**
   * Sync all conversations from Facebook Messenger
   * This fetches all conversations including message requests
   */
  async syncAllConversations() {
    try {
      console.log('🔄 Starting Facebook conversation sync...');

      // Reset stats
      this.stats = {
        totalUsers: 0,
        withProfilePicture: 0,
        withoutProfilePicture: 0,
        permissionErrors: 0,
      };

      // Get all Messenger channels from database
      const channels = await prisma.channel.findMany({
        where: {
          type: 'messenger',
          status: 'connected',
        },
      });

      if (channels.length === 0) {
        console.log('⚠️  No connected Messenger channels found');
        return;
      }

      for (const channel of channels) {
        await this.syncChannelConversations(channel);
      }

      console.log('✅ Facebook sync completed!');
      this.printSummary();
    } catch (error: any) {
      console.error('❌ Error syncing Facebook conversations:', error.message);
    }
  }

  private printSummary() {
    console.log('\n📊 Sync Summary:');
    console.log(`   Total users: ${this.stats.totalUsers}`);
    console.log(`   ✅ With profile pictures: ${this.stats.withProfilePicture}`);
    console.log(`   ⚠️  Using generated avatars: ${this.stats.withoutProfilePicture}`);

    if (this.stats.permissionErrors > 0) {
      console.log(`\n💡 Profile Picture Access:`);
      console.log(`   ${this.stats.permissionErrors} user(s) need "Business Asset User Profile Access" permission`);
      console.log(`   To get real profile pictures for message requests:`);
      console.log(`   1. Accept conversations on Facebook (quick fix), OR`);
      console.log(`   2. Request Advanced Access in Facebook App Review`);
      console.log(`   See: FACEBOOK_PERMISSIONS_GUIDE.md for details\n`);
    }
  }

  /**
   * Sync conversations for a specific channel
   */
  private async syncChannelConversations(channel: any) {
    try {
      const pageAccessToken = (channel.tokens as any).pageAccessToken;
      if (!pageAccessToken) {
        console.log(`⚠️  No access token for channel ${channel.id}`);
        return;
      }

      console.log(`📱 Syncing channel: ${(channel.meta as any)?.pageName || channel.id}`);

      // Fetch all conversations from Facebook with profile pictures and attachments
      // Note: Profile pictures in conversation participants may not be available for message requests
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/me/conversations`,
        {
          params: {
            access_token: pageAccessToken,
            fields: 'id,participants,messages{id,created_time,from,message,attachments},updated_time',
            limit: 100, // Fetch up to 100 conversations
          },
        }
      );

      const conversations = response.data.data || [];
      console.log(`📬 Found ${conversations.length} conversations`);

      for (const conversation of conversations) {
        await this.processConversation(conversation, channel, pageAccessToken);
      }
    } catch (error: any) {
      console.error(`❌ Error syncing channel ${channel.id}:`, error.response?.data || error.message);
    }
  }

  /**
   * Process a single conversation
   */
  private async processConversation(conversation: any, channel: any, pageAccessToken: string) {
    try {
      // Find the user participant (not the page)
      const pageId = channel.externalId;
      const userParticipant = conversation.participants.data.find((p: any) => p.id !== pageId);

      if (!userParticipant) {
        console.log(`⚠️  No user participant found in conversation ${conversation.id}`);
        return;
      }

      const userId = userParticipant.id;
      const userName = userParticipant.name;

      console.log(`👤 Processing: ${userName} (${userId})`);

      this.stats.totalUsers++;

      // Try to get profile picture from multiple sources
      let profilePicture = null;
      let hadPermissionError = false;

      // First, try to get from conversation participants data
      if (userParticipant.picture?.data?.url) {
        profilePicture = userParticipant.picture.data.url;
        console.log(`   ✅ Got profile picture from conversation data`);
      } else {
        // Try to fetch user profile using Messenger Platform User Profile API
        // This requires "Business Asset User Profile Access" with Advanced Access
        try {
          const profileResponse = await axios.get(
            `https://graph.facebook.com/${userId}`,
            {
              params: {
                fields: 'first_name,last_name,profile_pic',
                access_token: pageAccessToken,
              },
            }
          );
          profilePicture = profileResponse.data.profile_pic;
          console.log(`   ✅ Fetched profile picture from User Profile API`);
        } catch (profileError: any) {
          // Log detailed error for debugging
          const errorMessage = profileError.response?.data?.error?.message || profileError.message;
          const errorCode = profileError.response?.data?.error?.code;

          if (errorCode === 100) {
            hadPermissionError = true;
          }

          // If that fails, try the older Graph API endpoint
          try {
            const fallbackResponse = await axios.get(
              `https://graph.facebook.com/v18.0/${userId}`,
              {
                params: {
                  fields: 'name,picture.type(large)',
                  access_token: pageAccessToken,
                },
              }
            );
            profilePicture = fallbackResponse.data.picture?.data?.url;
            console.log(`   ✅ Fetched profile picture from Graph API (fallback)`);
            hadPermissionError = false; // Fallback worked
          } catch (fallbackError: any) {
            // Both methods failed - this is a permission issue
            console.log(`   ⚠️  Cannot access profile picture (likely message request)`);
          }
        }
      }

      // Track stats
      if (profilePicture) {
        this.stats.withProfilePicture++;
      } else {
        this.stats.withoutProfilePicture++;
        if (hadPermissionError) {
          this.stats.permissionErrors++;
        }
      }

      // Create or update user contact
      let userContact = await prisma.userContact.findUnique({
        where: {
          channelId_externalId: {
            channelId: channel.id,
            externalId: userId,
          },
        },
      });

      if (!userContact) {
        userContact = await prisma.userContact.create({
          data: {
            workspaceId: channel.workspaceId,
            channelId: channel.id,
            externalId: userId,
            name: userName || userId,
            fields: profilePicture ? { profilePicture } : {},
          },
        });
        console.log(`   ✅ Created user contact: ${userName}`);
      } else {
        // Always update if we got a new profile picture
        // OR if we previously didn't have one (retry for failed fetches)
        const currentFields = userContact.fields as any;
        const shouldUpdate = profilePicture || !currentFields?.profilePicture;

        if (shouldUpdate) {
          await prisma.userContact.update({
            where: { id: userContact.id },
            data: {
              name: userName || userContact.name,
              fields: profilePicture ? { profilePicture } : currentFields,
            },
          });

          if (profilePicture && !currentFields?.profilePicture) {
            console.log(`   ✅ Added profile picture for ${userName}`);
          } else if (profilePicture) {
            console.log(`   ✅ Updated profile picture for ${userName}`);
          }
        }
      }

      // Get or create inbox thread
      let thread = await prisma.inboxThread.findFirst({
        where: {
          channelId: channel.id,
          userId: userContact.id,
        },
      });

      const messages = conversation.messages?.data || [];
      if (messages.length === 0) {
        console.log(`   ⚠️  No messages in conversation`);
        return;
      }

      // Sort messages oldest first
      const sortedMessages = messages.reverse();
      const lastMessage = sortedMessages[sortedMessages.length - 1];

      if (!thread) {
        thread = await prisma.inboxThread.create({
          data: {
            workspaceId: channel.workspaceId,
            channelId: channel.id,
            userId: userContact.id,
            lastMessage: lastMessage.message || '[Message]',
            lastMessageAt: new Date(lastMessage.created_time),
            unreadCount: sortedMessages.filter((m: any) => m.from?.id !== pageId).length,
            status: 'open',
          },
        });
        console.log(`   ✅ Created thread`);
      }

      // Import messages
      let newMessagesCount = 0;
      for (const message of sortedMessages) {
        const isSentByPage = message.from?.id === pageId;
        const messageType = isSentByPage ? 'message_out' : 'message_in';
        const messageText = message.message || '[Media]';
        const messageTime = new Date(message.created_time);

        // Check if message already exists
        const existingEvent = await prisma.event.findFirst({
          where: {
            channelId: channel.id,
            userId: userContact.id,
            type: messageType,
            timestamp: messageTime,
          },
        });

        if (!existingEvent) {
          await prisma.event.create({
            data: {
              workspaceId: channel.workspaceId,
              channelId: channel.id,
              userId: userContact.id,
              type: messageType,
              timestamp: messageTime,
              payload: {
                messageId: message.id,
                text: messageText,
                attachments: message.attachments?.data || undefined, // Include attachments if present
              },
            },
          });
          newMessagesCount++;
        }
      }

      if (newMessagesCount > 0) {
        console.log(`   📥 Imported ${newMessagesCount} new messages`);

        // Update thread with latest info
        await prisma.inboxThread.update({
          where: { id: thread.id },
          data: {
            lastMessage: lastMessage.message || '[Message]',
            lastMessageAt: new Date(lastMessage.created_time),
            unreadCount: sortedMessages.filter((m: any) => m.from?.id !== pageId).length,
          },
        });
      } else {
        console.log(`   ℹ️  No new messages`);
      }
    } catch (error: any) {
      console.error(`❌ Error processing conversation:`, error.message);
    }
  }
}

export default new FacebookSyncService();
