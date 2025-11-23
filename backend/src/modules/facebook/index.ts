import { FastifyPluginAsync } from 'fastify';
import facebookService from './facebook.service.js';
import prisma from '../../lib/prisma.js';

const facebookModule: FastifyPluginAsync = async (fastify) => {
  /**
   * GET /api/oauth/facebook/debug
   * Debug endpoint to check environment variables
   */
  fastify.get('/oauth/facebook/debug', async (request, reply) => {
    return {
      env: {
        META_APP_ID: process.env.META_APP_ID || 'NOT_SET',
        META_APP_SECRET: process.env.META_APP_SECRET ? '***SET***' : 'NOT_SET',
        META_VERIFY_TOKEN: process.env.META_VERIFY_TOKEN ? '***SET***' : 'NOT_SET',
        META_REDIRECT_URI: process.env.META_REDIRECT_URI || 'NOT_SET',
      }
    };
  });

  /**
   * GET /api/oauth/facebook
   * Initiate Facebook OAuth flow
   */
  fastify.get('/oauth/facebook', async (request, reply) => {
    try {
      // Generate state parameter for security (you can store this in session/redis)
      const state = Math.random().toString(36).substring(7);

      const oauthUrl = facebookService.getOAuthURL(state);

      // Return the OAuth URL to the frontend
      return {
        success: true,
        authUrl: oauthUrl,
        state,
      };
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * GET /api/oauth/facebook/callback
   * Handle OAuth callback from Facebook
   */
  fastify.get('/oauth/facebook/callback', async (request, reply) => {
    try {
      const { code, state, error, error_description } = request.query as any;

      // Handle error from Facebook
      if (error) {
        return reply.status(400).send({
          success: false,
          error: error_description || error,
        });
      }

      if (!code) {
        return reply.status(400).send({
          success: false,
          error: 'No authorization code provided',
        });
      }

      // Exchange code for access token
      const tokenData = await facebookService.getAccessToken(code);

      // Get long-lived token
      const longLivedToken = await facebookService.getLongLivedToken(tokenData.access_token);

      // Get user profile
      const userProfile = await facebookService.getUserProfile(longLivedToken.access_token);

      // Get user's Facebook Pages
      const pages = await facebookService.getUserPages(longLivedToken.access_token);

      // Try to save to database, but don't fail if database is not available
      let savedChannels = [];
      try {
        // Get or create default workspace
        let workspace = await prisma.workspace.findFirst();
        if (!workspace) {
          workspace = await prisma.workspace.create({
            data: {
              name: 'Default Workspace',
              plan: 'free',
            },
          });
          fastify.log.info('Created default workspace:', workspace.id);
        }

        // Store channels in database
        for (const page of pages) {
          // Create/update Messenger channel
          const messengerChannel = await prisma.channel.upsert({
            where: {
              workspaceId_type_externalId: {
                workspaceId: workspace.id,
                type: 'messenger',
                externalId: page.id,
              },
            },
            create: {
              workspaceId: workspace.id,
              type: 'messenger',
              externalId: page.id,
              status: 'connected',
              tokens: {
                pageAccessToken: page.access_token,
                userAccessToken: longLivedToken.access_token,
                expiresIn: longLivedToken.expires_in,
                connectedAt: new Date().toISOString(),
              },
              meta: {
                pageId: page.id,
                pageName: page.name,
                category: page.category,
                userId: userProfile.id,
                userName: userProfile.name,
                userEmail: userProfile.email,
              },
            },
            update: {
              status: 'connected',
              tokens: {
                pageAccessToken: page.access_token,
                userAccessToken: longLivedToken.access_token,
                expiresIn: longLivedToken.expires_in,
                connectedAt: new Date().toISOString(),
              },
              meta: {
                pageId: page.id,
                pageName: page.name,
                category: page.category,
                userId: userProfile.id,
                userName: userProfile.name,
                userEmail: userProfile.email,
              },
              updatedAt: new Date(),
            },
          });

          savedChannels.push({
            type: 'messenger',
            channel: messengerChannel,
            page,
          });

          fastify.log.info(`✅ Saved Messenger channel: ${page.name} (${page.id})`);

          // If page has Instagram account, create/update Instagram channel
          if (page.instagram_business_account) {
            const instagramChannel = await prisma.channel.upsert({
              where: {
                workspaceId_type_externalId: {
                  workspaceId: workspace.id,
                  type: 'instagram',
                  externalId: page.instagram_business_account.id,
                },
              },
              create: {
                workspaceId: workspace.id,
                type: 'instagram',
                externalId: page.instagram_business_account.id,
                status: 'connected',
                tokens: {
                  pageAccessToken: page.access_token,
                  userAccessToken: longLivedToken.access_token,
                  expiresIn: longLivedToken.expires_in,
                  connectedAt: new Date().toISOString(),
                },
                meta: {
                  instagramId: page.instagram_business_account.id,
                  username: page.instagram_business_account.username,
                  profilePictureUrl: page.instagram_business_account.profile_picture_url,
                  connectedPageId: page.id,
                  connectedPageName: page.name,
                  userId: userProfile.id,
                  userName: userProfile.name,
                  userEmail: userProfile.email,
                },
              },
              update: {
                status: 'connected',
                tokens: {
                  pageAccessToken: page.access_token,
                  userAccessToken: longLivedToken.access_token,
                  expiresIn: longLivedToken.expires_in,
                  connectedAt: new Date().toISOString(),
                },
                meta: {
                  instagramId: page.instagram_business_account.id,
                  username: page.instagram_business_account.username,
                  profilePictureUrl: page.instagram_business_account.profile_picture_url,
                  connectedPageId: page.id,
                  connectedPageName: page.name,
                  userId: userProfile.id,
                  userName: userProfile.name,
                  userEmail: userProfile.email,
                },
                updatedAt: new Date(),
              },
            });

            savedChannels.push({
              type: 'instagram',
              channel: instagramChannel,
              page,
            });

            fastify.log.info(`✅ Saved Instagram channel: @${page.instagram_business_account.username}`);
          }
        }
      } catch (dbError: any) {
        fastify.log.warn(`Database not available, skipping storage: ${dbError.message}`);
        // Log the connection data for manual review
        fastify.log.info('Facebook connection data (not saved to DB):', {
          user: {
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
          },
          accessToken: longLivedToken.access_token.substring(0, 20) + '...',
          pages: pages.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            instagram: p.instagram_business_account?.username,
          })),
        });
      }

      // Redirect back to frontend with success
      const channelCount = savedChannels.length || pages.length;
      const redirectUrl = `${process.env.CORS_ORIGIN}/brands?facebook_connected=true&channels=${channelCount}`;
      return reply.redirect(redirectUrl);

    } catch (error: any) {
      fastify.log.error(error);
      const redirectUrl = `${process.env.CORS_ORIGIN}/brands?facebook_connected=false&error=${encodeURIComponent(error.message)}`;
      return reply.redirect(redirectUrl);
    }
  });

  /**
   * POST /api/oauth/facebook/subscribe-webhooks
   * Subscribe a page to webhooks
   */
  fastify.post('/oauth/facebook/subscribe-webhooks', async (request, reply) => {
    try {
      const { pageId, pageAccessToken } = request.body as any;

      if (!pageId || !pageAccessToken) {
        return reply.status(400).send({
          success: false,
          error: 'pageId and pageAccessToken are required',
        });
      }

      const subscribed = await facebookService.subscribePageToWebhooks(pageId, pageAccessToken);

      return {
        success: subscribed,
        message: subscribed ? 'Successfully subscribed to webhooks' : 'Failed to subscribe',
      };
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * POST /api/facebook/send-message
   * Send a message via Facebook Messenger
   */
  fastify.post('/send-message', async (request, reply) => {
    try {
      const { pageAccessToken, recipientId, message } = request.body as any;

      if (!pageAccessToken || !recipientId || !message) {
        return reply.status(400).send({
          success: false,
          error: 'pageAccessToken, recipientId, and message are required',
        });
      }

      const result = await facebookService.sendMessage(pageAccessToken, recipientId, message);

      return {
        success: true,
        messageId: result.message_id,
        recipientId: result.recipient_id,
      };
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });

  /**
   * POST /api/facebook/send-instagram-message
   * Send a message via Instagram Direct
   */
  fastify.post('/send-instagram-message', async (request, reply) => {
    try {
      const { pageAccessToken, recipientId, message } = request.body as any;

      if (!pageAccessToken || !recipientId || !message) {
        return reply.status(400).send({
          success: false,
          error: 'pageAccessToken, recipientId, and message are required',
        });
      }

      const result = await facebookService.sendInstagramMessage(pageAccessToken, recipientId, message);

      return {
        success: true,
        messageId: result.message_id,
        recipientId: result.recipient_id,
      };
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });
};

export default facebookModule;
