import axios from 'axios';

const GRAPH_API_VERSION = 'v18.0';
const GRAPH_API_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

export class FacebookService {
  /**
   * Get App ID from environment
   */
  private get appId(): string {
    return process.env.META_APP_ID || '';
  }

  /**
   * Get App Secret from environment
   */
  private get appSecret(): string {
    return process.env.META_APP_SECRET || '';
  }

  /**
   * Get Redirect URI from environment
   */
  private get redirectUri(): string {
    return process.env.META_REDIRECT_URI || '';
  }

  /**
   * Generate OAuth URL for Facebook Login
   */
  getOAuthURL(state?: string): string {
    // Start with basic Facebook/Messenger scopes
    // Instagram scopes removed for now - can be added after Instagram product is configured
    const scopes = [
      'pages_messaging',
      'pages_read_engagement',
      'pages_manage_metadata',
      'business_management',
      // 'instagram_basic',  // Add after configuring Instagram product
      // 'instagram_manage_messages',  // Add after configuring Instagram product
    ].join(',');

    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      scope: scopes,
      response_type: 'code',
      ...(state && { state }),
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in?: number;
  }> {
    try {
      const response = await axios.get(`${GRAPH_API_URL}/oauth/access_token`, {
        params: {
          client_id: this.appId,
          client_secret: this.appSecret,
          redirect_uri: this.redirectUri,
          code,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw new Error('Failed to get access token');
    }
  }

  /**
   * Get long-lived user access token
   */
  async getLongLivedToken(shortLivedToken: string): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }> {
    try {
      const response = await axios.get(`${GRAPH_API_URL}/oauth/access_token`, {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.appId,
          client_secret: this.appSecret,
          fb_exchange_token: shortLivedToken,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error getting long-lived token:', error.response?.data || error.message);
      throw new Error('Failed to get long-lived token');
    }
  }

  /**
   * Get user's Facebook Pages
   */
  async getUserPages(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get(`${GRAPH_API_URL}/me/accounts`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,access_token,category,instagram_business_account{id,username,profile_picture_url}',
        },
      });

      return response.data.data || [];
    } catch (error: any) {
      console.error('Error fetching user pages:', error.response?.data || error.message);
      throw new Error('Failed to fetch user pages');
    }
  }

  /**
   * Get Page Access Token (long-lived)
   */
  async getPageAccessToken(pageId: string, userAccessToken: string): Promise<string> {
    try {
      const response = await axios.get(`${GRAPH_API_URL}/${pageId}`, {
        params: {
          fields: 'access_token',
          access_token: userAccessToken,
        },
      });

      return response.data.access_token;
    } catch (error: any) {
      console.error('Error getting page access token:', error.response?.data || error.message);
      throw new Error('Failed to get page access token');
    }
  }

  /**
   * Subscribe page to webhooks
   */
  async subscribePageToWebhooks(pageId: string, pageAccessToken: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${GRAPH_API_URL}/${pageId}/subscribed_apps`,
        null,
        {
          params: {
            access_token: pageAccessToken,
            subscribed_fields: [
              'messages',
              'messaging_postbacks',
              'messaging_optins',
              'message_deliveries',
              'message_reads',
            ].join(','),
          },
        }
      );

      return response.data.success === true;
    } catch (error: any) {
      console.error('Error subscribing to webhooks:', error.response?.data || error.message);
      throw new Error('Failed to subscribe to webhooks');
    }
  }

  /**
   * Send message via Messenger
   */
  async sendMessage(
    pageAccessToken: string,
    recipientId: string,
    message: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${GRAPH_API_URL}/me/messages`,
        {
          recipient: { id: recipientId },
          message: { text: message },
          messaging_type: 'RESPONSE',
        },
        {
          params: {
            access_token: pageAccessToken,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw new Error('Failed to send message');
    }
  }

  /**
   * Send Instagram Direct Message
   */
  async sendInstagramMessage(
    pageAccessToken: string,
    recipientId: string,
    message: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${GRAPH_API_URL}/me/messages`,
        {
          recipient: { id: recipientId },
          message: { text: message },
        },
        {
          params: {
            access_token: pageAccessToken,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error sending Instagram message:', error.response?.data || error.message);
      throw new Error('Failed to send Instagram message');
    }
  }

  /**
   * Get user profile information
   */
  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`${GRAPH_API_URL}/me`, {
        params: {
          fields: 'id,name,email,picture',
          access_token: accessToken,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(signature: string, body: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', this.appSecret)
      .update(body)
      .digest('hex');

    return `sha256=${expectedSignature}` === signature;
  }
}

export default new FacebookService();
