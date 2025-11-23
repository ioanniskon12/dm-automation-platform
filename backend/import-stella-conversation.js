// Import Stella's conversation from Facebook API
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PAGE_ACCESS_TOKEN = 'EAAWLni9Tpu4BPzTKSZAZA6odL2ljzDEe9yvf11YX75UNWDFLUnPJA15TsAT45dIKc9SbdgOBA7xhYTSEuIdgs3bWn27oBmXTCwMjTH5wr0ZC6l8kp6ndZA9Hek0rNSZCKAgtFkyHKZBWfjZAhSwuZAfIJZBLRbLkFCwQcwywikPLRbvJbALD9ZAg8sKPmWypIOT1bylT4OUZC7f3ZB4HU1HElLxHLYtS';
const CONVERSATION_ID = 't_25328241670122212';
const STELLA_USER_ID = '25188714340781587';

async function importStellaConversation() {
  try {
    console.log('🔍 Fetching Stella\'s conversation from Facebook...');

    // Fetch the conversation with messages
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${CONVERSATION_ID}`,
      {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: 'participants,messages{id,created_time,from,message}',
        },
      }
    );

    const conversation = response.data;
    console.log(`✅ Found ${conversation.messages.data.length} messages`);

    // Get the channel from database
    const channel = await prisma.channel.findFirst({
      where: {
        type: 'messenger',
        externalId: '802420336298895',
      },
    });

    if (!channel) {
      console.error('❌ Channel not found in database');
      return;
    }

    console.log(`✅ Found channel: ${channel.id}`);

    // Get Stella's name from conversation participants
    const stellaParticipant = conversation.participants.data.find(p => p.id === STELLA_USER_ID);
    const profile = {
      name: stellaParticipant?.name || 'Stella Nikolaou',
      profile_pic: null, // Will fetch after message request is accepted
    };
    console.log(`✅ Profile: ${profile.name}`);

    // Create or get user contact
    let userContact = await prisma.userContact.findUnique({
      where: {
        channelId_externalId: {
          channelId: channel.id,
          externalId: STELLA_USER_ID,
        },
      },
    });

    if (!userContact) {
      userContact = await prisma.userContact.create({
        data: {
          workspaceId: channel.workspaceId,
          channelId: channel.id,
          externalId: STELLA_USER_ID,
          name: profile.name || STELLA_USER_ID,
          fields: {
            profilePicture: profile.profile_pic,
          },
        },
      });
      console.log(`✅ Created user contact: ${userContact.name}`);
    } else {
      console.log(`✅ User contact already exists: ${userContact.name}`);
    }

    // Create or get inbox thread
    let thread = await prisma.inboxThread.findFirst({
      where: {
        channelId: channel.id,
        userId: userContact.id,
      },
    });

    const messages = conversation.messages.data.reverse(); // Oldest first
    const lastMessage = messages[messages.length - 1];

    if (!thread) {
      thread = await prisma.inboxThread.create({
        data: {
          workspaceId: channel.workspaceId,
          channelId: channel.id,
          userId: userContact.id,
          lastMessage: lastMessage.message || '[Message]',
          lastMessageAt: new Date(lastMessage.created_time),
          unreadCount: 1,
          status: 'open',
        },
      });
      console.log(`✅ Created inbox thread: ${thread.id}`);
    } else {
      console.log(`✅ Thread already exists: ${thread.id}`);
    }

    // Import all messages
    console.log('📥 Importing messages...');
    let importedCount = 0;

    for (const message of messages) {
      const isSentByPage = message.from?.id === '802420336298895';
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
            },
          },
        });
        importedCount++;
        console.log(`  ✅ Imported: ${messageType} - "${messageText.substring(0, 50)}..." at ${messageTime.toISOString()}`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${messageType} at ${messageTime.toISOString()}`);
      }
    }

    // Update thread with latest message
    await prisma.inboxThread.update({
      where: { id: thread.id },
      data: {
        lastMessage: lastMessage.message || '[Message]',
        lastMessageAt: new Date(lastMessage.created_time),
        unreadCount: messages.filter(m => m.from?.id !== '802420336298895').length,
      },
    });

    console.log(`\n🎉 Import complete!`);
    console.log(`   Imported: ${importedCount} new messages`);
    console.log(`   Thread ID: ${thread.id}`);
    console.log(`   User: ${userContact.name}`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importStellaConversation();
