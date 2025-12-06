"use client";

import { useState } from 'react';
import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function Documentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', name: 'Getting Started', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'flow-builder', name: 'Flow Builder', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { id: 'ai-responses', name: 'AI Responses', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'knowledge-base', name: 'Knowledge Base', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'inbox', name: 'Unified Inbox', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'triggers', name: 'Triggers & Actions', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'analytics', name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'integrations', name: 'Integrations', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'api', name: 'API Reference', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  ];

  const videoTutorials = [
    {
      title: "Getting Started in 5 Minutes",
      description: "A quick overview of setting up your first automation",
      duration: "5:32",
      thumbnail: "getting-started",
      category: "Beginner"
    },
    {
      title: "Building Your First Flow",
      description: "Step-by-step guide to creating automation flows",
      duration: "12:45",
      thumbnail: "flow-builder",
      category: "Beginner"
    },
    {
      title: "Setting Up AI Responses",
      description: "Configure intelligent AI-powered auto-replies",
      duration: "8:20",
      thumbnail: "ai-setup",
      category: "Intermediate"
    },
    {
      title: "Managing Your Knowledge Base",
      description: "Upload documents and train your AI assistant",
      duration: "10:15",
      thumbnail: "knowledge-base",
      category: "Intermediate"
    },
    {
      title: "Advanced Trigger Configurations",
      description: "Master complex trigger conditions and actions",
      duration: "15:30",
      thumbnail: "triggers",
      category: "Advanced"
    },
    {
      title: "Analytics Deep Dive",
      description: "Understanding your performance metrics",
      duration: "11:00",
      thumbnail: "analytics",
      category: "Intermediate"
    }
  ];

  const documentationContent = {
    'getting-started': {
      title: 'Getting Started with DM Automation',
      description: 'Everything you need to know to set up and start automating your social media conversations.',
      sections: [
        {
          title: 'Quick Start Guide',
          content: `Welcome to DM Automation! This guide will walk you through setting up your account and creating your first automation in just a few minutes.

**Step 1: Create Your Account**
Sign up for a free 14-day trial at dmautomation.com/signup. No credit card required.

**Step 2: Connect Your Channels**
Navigate to Settings > Channels and connect your social media accounts:
- Instagram Business/Creator Account
- Facebook Page with Messenger
- WhatsApp Business API
- Telegram Bot

**Step 3: Create Your First Flow**
Go to the Flow Builder and either:
- Choose a pre-built template
- Create a custom flow from scratch

**Step 4: Set Up Triggers**
Define what events will start your automation:
- New DM received
- Story reply
- Comment on post
- Keyword detection

**Step 5: Activate and Monitor**
Once your flow is ready, activate it and monitor performance in the Analytics dashboard.`
        },
        {
          title: 'System Requirements',
          content: `DM Automation is a cloud-based platform that works in any modern web browser.

**Supported Browsers:**
- Google Chrome (recommended) - version 90+
- Mozilla Firefox - version 88+
- Safari - version 14+
- Microsoft Edge - version 90+

**Social Media Requirements:**
- Instagram: Business or Creator account
- Facebook: Facebook Page with admin access
- WhatsApp: WhatsApp Business API access
- Telegram: Bot created via BotFather

**Mobile Access:**
Our platform is fully responsive and works on mobile devices. A dedicated mobile app is coming soon.`
        },
        {
          title: 'Account Setup',
          content: `**Creating a Workspace**
When you first sign up, we'll create a default workspace for you. Workspaces allow you to organize different brands or projects.

**Inviting Team Members**
Go to Settings > Team to invite colleagues. You can assign roles:
- Owner: Full access to all features
- Admin: Can manage settings and team members
- Editor: Can create and edit automations
- Viewer: Read-only access to analytics

**Connecting Channels**
Each channel requires authentication:

*Instagram:*
1. Click "Connect Instagram"
2. Log in to your Instagram account
3. Select your Business/Creator profile
4. Grant necessary permissions

*Facebook Messenger:*
1. Click "Connect Facebook"
2. Log in to your Facebook account
3. Select the Page you want to connect
4. Grant messaging permissions`
        }
      ]
    },
    'flow-builder': {
      title: 'Flow Builder Guide',
      description: 'Master the visual flow builder to create powerful automations without any coding.',
      sections: [
        {
          title: 'Understanding the Flow Builder',
          content: `The Flow Builder is a visual, drag-and-drop interface for creating automation workflows.

**Key Concepts:**
- **Nodes**: Building blocks of your flow (triggers, actions, conditions)
- **Connections**: Lines that connect nodes and define the flow path
- **Canvas**: The workspace where you design your flows

**Node Types:**
1. **Trigger Nodes** (Green): Start your automation
2. **Action Nodes** (Blue): Perform tasks like sending messages
3. **Condition Nodes** (Yellow): Add logic and branching
4. **Delay Nodes** (Purple): Add time delays between actions`
        },
        {
          title: 'Creating Your First Flow',
          content: `**Step 1: Add a Trigger**
Drag a trigger node from the sidebar to the canvas. Choose from:
- Message Received
- Keyword Detected
- Story Reply
- Comment Received
- New Follower

**Step 2: Add Actions**
Connect action nodes to define what happens:
- Send Message
- Send Image/Video
- Add Tag
- Update Contact
- Trigger Webhook

**Step 3: Add Conditions (Optional)**
Use condition nodes to create branches:
- If/Else based on message content
- Check contact properties
- Time-based conditions

**Step 4: Test Your Flow**
Use the "Test" button to simulate your flow before activating.

**Step 5: Activate**
Toggle the flow to "Active" to start processing real messages.`
        },
        {
          title: 'Advanced Flow Features',
          content: `**A/B Testing**
Test different message variations:
1. Add an A/B Split node
2. Connect multiple message variants
3. Set distribution percentages
4. Monitor performance in Analytics

**Variables & Personalization**
Use dynamic variables in messages:
- {{contact.name}} - Contact's name
- {{contact.email}} - Contact's email
- {{message.text}} - Original message content
- {{current.date}} - Current date

**Loops & Delays**
Create follow-up sequences:
1. Add a Delay node (minutes, hours, or days)
2. Connect follow-up messages
3. Add exit conditions to stop sequences

**Error Handling**
Add fallback paths for when:
- AI can't determine intent
- External API fails
- Message delivery fails`
        }
      ]
    },
    'ai-responses': {
      title: 'AI-Powered Responses',
      description: 'Configure intelligent AI responses that understand context and maintain your brand voice.',
      sections: [
        {
          title: 'How AI Responses Work',
          content: `Our AI uses advanced natural language processing to understand incoming messages and generate appropriate responses.

**AI Capabilities:**
- Understand message intent and context
- Generate human-like responses
- Learn from your knowledge base
- Maintain conversation history
- Handle multiple languages (50+)

**When AI Responds:**
1. Message is received
2. AI analyzes content and context
3. Checks knowledge base for relevant info
4. Generates response matching your brand voice
5. Sends response or escalates to human`
        },
        {
          title: 'Configuring AI Settings',
          content: `**Response Style**
Choose how your AI communicates:
- Professional
- Friendly & Casual
- Formal
- Custom (define your own)

**Confidence Threshold**
Set the minimum confidence level for auto-responses:
- High (90%+): Only respond when very confident
- Medium (70%+): Balanced approach
- Low (50%+): Respond more often, may need review

**Escalation Rules**
Define when to hand off to humans:
- Confidence below threshold
- Specific keywords detected (e.g., "speak to human")
- Sensitive topics detected
- Customer frustration detected`
        },
        {
          title: 'Training Your AI',
          content: `**Knowledge Base Integration**
Your AI learns from:
- Uploaded documents (PDF, DOC, TXT)
- Website content (URL scraping)
- FAQ entries
- Past conversations (with approval)

**Best Practices:**
1. Keep information up-to-date
2. Include common questions and answers
3. Add product/service details
4. Include pricing information
5. Define company policies

**Feedback Loop**
Improve AI over time:
1. Review AI responses in the inbox
2. Mark good/bad responses
3. AI learns from feedback
4. Accuracy improves automatically`
        }
      ]
    },
    'knowledge-base': {
      title: 'Knowledge Base',
      description: 'Build and manage the information your AI uses to answer customer questions.',
      sections: [
        {
          title: 'What is the Knowledge Base?',
          content: `The Knowledge Base is your AI's reference library. It contains all the information your AI needs to answer customer questions accurately.

**Supported Content Types:**
- PDF documents
- Word documents (.doc, .docx)
- Text files (.txt)
- Web pages (URL import)
- Manual FAQ entries
- CSV imports

**How It Works:**
1. You add content to the Knowledge Base
2. Our system processes and indexes the content
3. When a customer asks a question
4. AI searches the Knowledge Base
5. Generates a response using relevant info`
        },
        {
          title: 'Adding Content',
          content: `**Upload Documents**
1. Go to Knowledge Base > Documents
2. Click "Upload"
3. Select files (max 50MB each)
4. Wait for processing (1-5 minutes)
5. Review extracted content

**Import from URL**
1. Go to Knowledge Base > Web Import
2. Enter website URL
3. Choose pages to import
4. System extracts text content
5. Review and approve

**Manual Entries**
1. Go to Knowledge Base > Manual Entries
2. Click "Add Entry"
3. Enter question and answer
4. Add tags for organization
5. Save and publish`
        },
        {
          title: 'Organizing Content',
          content: `**Categories**
Organize content into logical groups:
- Products & Services
- Pricing & Billing
- Shipping & Returns
- Technical Support
- Company Policies

**Tags**
Add tags for better search:
- Product names
- Topics
- Priority levels

**Version Control**
Track changes to your content:
- View edit history
- Restore previous versions
- See who made changes

**Content Review**
Regularly review your Knowledge Base:
- Remove outdated information
- Update pricing/policies
- Add new products/services
- Improve unclear answers`
        }
      ]
    },
    'inbox': {
      title: 'Unified Inbox',
      description: 'Manage all your conversations from Instagram, Messenger, WhatsApp, and Telegram in one place.',
      sections: [
        {
          title: 'Inbox Overview',
          content: `The Unified Inbox brings all your social media conversations into one powerful interface.

**Key Features:**
- View all channels in one place
- Real-time message syncing
- Smart filtering and search
- Team collaboration tools
- Quick responses and templates

**Inbox Layout:**
- Left sidebar: Conversation list
- Center: Message thread
- Right sidebar: Contact details`
        },
        {
          title: 'Managing Conversations',
          content: `**Conversation States:**
- Open: Active conversations
- Pending: Awaiting response
- Resolved: Completed conversations
- Snoozed: Temporarily hidden

**Assigning Conversations**
1. Select a conversation
2. Click "Assign"
3. Choose team member
4. Add optional note

**Using Quick Replies**
1. Press "/" in the message field
2. Search for saved reply
3. Select and customize
4. Send to customer

**Tagging Conversations**
Add tags for organization:
- Customer type
- Issue category
- Priority level
- Custom tags`
        },
        {
          title: 'Advanced Inbox Features',
          content: `**Search & Filter**
Find conversations quickly:
- Full-text message search
- Filter by channel
- Filter by tag
- Filter by team member
- Date range filtering

**Bulk Actions**
Manage multiple conversations:
- Select multiple
- Bulk assign
- Bulk tag
- Bulk resolve

**Keyboard Shortcuts**
Work faster with shortcuts:
- Cmd/Ctrl + Enter: Send message
- Cmd/Ctrl + /: Quick reply
- Cmd/Ctrl + E: Resolve
- Cmd/Ctrl + S: Snooze

**Collaboration**
Work as a team:
- Internal notes (customers don't see)
- @mentions for teammates
- Collision detection
- Activity timeline`
        }
      ]
    },
    'triggers': {
      title: 'Triggers & Actions',
      description: 'Understand all available triggers and actions to build powerful automations.',
      sections: [
        {
          title: 'Available Triggers',
          content: `Triggers start your automation flows when specific events occur.

**Instagram Triggers:**
- Direct Message: When someone DMs you
- Story Reply: When someone replies to your story
- Story Mention: When someone mentions you in their story
- Comment: When someone comments on your post
- Post Share: When someone shares your post
- Live Comment: Comments during live streams
- Ref URL: When someone clicks your referral link
- Ads: Responses to Instagram ads

**Facebook/Messenger Triggers:**
- Message: When someone messages your Page
- Comment: When someone comments on your post
- Ads: Responses to Facebook ads
- Ref URL: Referral link clicks
- QR Code: When someone scans your Messenger QR
- Shop: Messages about Facebook Shop products

**WhatsApp Triggers:**
- Message: When someone messages you
- Template Reply: Responses to template messages

**Telegram Triggers:**
- Message: When someone messages your bot
- Command: When someone uses a bot command`
        },
        {
          title: 'Available Actions',
          content: `Actions are what your automation does when triggered.

**Messaging Actions:**
- Send Text: Send a text message
- Send Image: Send an image or GIF
- Send Video: Send a video
- Send Audio: Send a voice message
- Send File: Send a document
- Send Buttons: Interactive quick replies
- Send Carousel: Multiple cards with buttons

**Contact Actions:**
- Add Tag: Tag the contact
- Remove Tag: Remove a tag
- Update Field: Update contact properties
- Subscribe: Add to a sequence
- Unsubscribe: Remove from sequence

**Flow Actions:**
- Delay: Wait before next action
- Condition: Branch based on logic
- A/B Split: Random split for testing
- Go To: Jump to another part of flow
- End Flow: Stop the automation

**Integration Actions:**
- Webhook: Send data to external URL
- CRM Update: Sync with your CRM
- Email: Send an email
- Slack: Send Slack notification`
        },
        {
          title: 'Trigger Conditions',
          content: `Add conditions to triggers for precise targeting.

**Message Conditions:**
- Contains keyword
- Matches regex pattern
- Is first message
- Is in specific language

**Contact Conditions:**
- Has/doesn't have tag
- Custom field value
- Subscriber status
- Previous interactions

**Time Conditions:**
- Specific hours/days
- Time since last message
- Date range

**Channel Conditions:**
- Specific platform
- Specific account
- Message source (organic/ads)

**Examples:**
- Trigger only for new customers (no previous messages)
- Trigger during business hours only
- Trigger only for messages containing "pricing"
- Trigger for Spanish speakers only`
        }
      ]
    },
    'analytics': {
      title: 'Analytics & Reporting',
      description: 'Track performance, measure ROI, and optimize your automations with detailed analytics.',
      sections: [
        {
          title: 'Dashboard Overview',
          content: `The Analytics dashboard gives you a complete view of your automation performance.

**Key Metrics:**
- Total Conversations: Number of conversations handled
- Messages Sent: Automated messages sent
- Response Rate: % of messages answered
- Avg Response Time: How fast you respond
- Resolution Rate: % of issues resolved
- Customer Satisfaction: Based on feedback

**Time Periods:**
- Today
- Last 7 days
- Last 30 days
- Last 90 days
- Custom date range`
        },
        {
          title: 'Flow Analytics',
          content: `Track individual flow performance.

**Flow Metrics:**
- Triggered: How many times flow started
- Completed: How many reached the end
- Drop-off Rate: Where users abandon
- Conversion Rate: Goal completions
- Revenue Attributed: Sales from flow

**Node Analytics:**
Click any node to see:
- Times executed
- Success/failure rate
- Average time to complete
- User responses/choices

**A/B Test Results:**
For A/B split nodes:
- Variant performance comparison
- Statistical significance
- Winner recommendation`
        },
        {
          title: 'Reports & Exports',
          content: `Generate detailed reports for your team.

**Available Reports:**
- Daily/Weekly/Monthly Summary
- Channel Performance
- Team Performance
- AI Response Quality
- Customer Satisfaction

**Scheduling Reports:**
1. Go to Analytics > Reports
2. Choose report type
3. Set frequency (daily/weekly/monthly)
4. Add email recipients
5. Reports sent automatically

**Exporting Data:**
Export to various formats:
- CSV for spreadsheets
- PDF for presentations
- JSON for integrations

**API Access:**
Query analytics via API:
- Real-time metrics
- Historical data
- Custom queries`
        }
      ]
    },
    'integrations': {
      title: 'Integrations',
      description: 'Connect DM Automation with your favorite tools and services.',
      sections: [
        {
          title: 'Available Integrations',
          content: `Connect with popular business tools.

**CRM Integrations:**
- Salesforce
- HubSpot
- Pipedrive
- Zoho CRM
- Custom CRM (via API)

**E-commerce:**
- Shopify
- WooCommerce
- BigCommerce
- Magento

**Marketing:**
- Mailchimp
- Klaviyo
- ActiveCampaign
- ConvertKit

**Productivity:**
- Slack
- Google Sheets
- Airtable
- Notion

**Automation:**
- Zapier (5000+ apps)
- Make (Integromat)
- n8n
- Webhooks`
        },
        {
          title: 'Setting Up Integrations',
          content: `**Native Integrations**
For built-in integrations:
1. Go to Settings > Integrations
2. Find the app you want
3. Click "Connect"
4. Authorize the connection
5. Configure sync settings

**Zapier Integration**
Connect with 5000+ apps:
1. Go to Zapier.com
2. Search for "DM Automation"
3. Choose a trigger/action
4. Follow Zapier setup wizard

**Webhook Integration**
For custom integrations:
1. Go to Settings > Webhooks
2. Click "Add Webhook"
3. Enter your endpoint URL
4. Select events to send
5. Test the webhook`
        },
        {
          title: 'Data Sync Options',
          content: `**Real-time Sync**
Data syncs instantly:
- New contacts
- Message updates
- Tag changes
- Field updates

**Scheduled Sync**
For large data sets:
- Hourly sync
- Daily sync
- Manual sync

**Sync Direction:**
- One-way: DM Automation → External
- One-way: External → DM Automation
- Two-way: Bidirectional sync

**Conflict Resolution:**
When data conflicts:
- Most recent wins
- DM Automation wins
- External wins
- Manual review`
        }
      ]
    },
    'api': {
      title: 'API Reference',
      description: 'Technical documentation for developers integrating with our API.',
      sections: [
        {
          title: 'API Overview',
          content: `Our REST API allows you to programmatically manage your DM Automation account.

**Base URL:**
\`https://api.dmautomation.com/v1\`

**Authentication:**
All requests require an API key in the header:
\`Authorization: Bearer YOUR_API_KEY\`

**Rate Limits:**
- Starter: 100 requests/minute
- Pro: 500 requests/minute
- Enterprise: Custom limits

**Response Format:**
All responses are JSON:
\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
\`\`\``
        },
        {
          title: 'Key Endpoints',
          content: `**Contacts**
\`GET /contacts\` - List contacts
\`POST /contacts\` - Create contact
\`GET /contacts/:id\` - Get contact
\`PUT /contacts/:id\` - Update contact
\`DELETE /contacts/:id\` - Delete contact

**Conversations**
\`GET /conversations\` - List conversations
\`GET /conversations/:id\` - Get conversation
\`POST /conversations/:id/messages\` - Send message

**Flows**
\`GET /flows\` - List flows
\`GET /flows/:id\` - Get flow
\`PUT /flows/:id/status\` - Activate/deactivate

**Analytics**
\`GET /analytics/overview\` - Dashboard stats
\`GET /analytics/flows/:id\` - Flow analytics

**Webhooks**
\`GET /webhooks\` - List webhooks
\`POST /webhooks\` - Create webhook`
        },
        {
          title: 'Code Examples',
          content: `**JavaScript/Node.js:**
\`\`\`javascript
const response = await fetch('https://api.dmautomation.com/v1/contacts', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
\`\`\`

**Python:**
\`\`\`python
import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}
response = requests.get(
    'https://api.dmautomation.com/v1/contacts',
    headers=headers
)
data = response.json()
\`\`\`

**cURL:**
\`\`\`bash
curl -X GET https://api.dmautomation.com/v1/contacts \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\``
        }
      ]
    }
  };

  const currentSection = documentationContent[activeSection];

  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
              Documentation
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Learn Everything About
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> DM Automation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive guides, tutorials, and API documentation to help you get the most out of our platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              href="#video-tutorials"
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">Video Tutorials</span>
            </Link>
            <Link
              href="#guides"
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">In-Depth Guides</span>
            </Link>
            <Link
              href="#api"
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">API Reference</span>
            </Link>
            <Link
              href="/faq"
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">FAQ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Tutorials Section */}
      <section id="video-tutorials" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Video Tutorials</h2>
            <p className="text-lg text-gray-600">Step-by-step video guides to help you master DM Automation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all group cursor-pointer"
              >
                {/* Video Thumbnail Placeholder */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                  <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded font-medium ${
                    video.category === 'Beginner' ? 'bg-green-500 text-white' :
                    video.category === 'Intermediate' ? 'bg-blue-500 text-white' :
                    'bg-purple-500 text-white'
                  }`}>
                    {video.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all">
              View All Tutorials
            </button>
          </div>
        </div>
      </section>

      {/* Documentation Content */}
      <section id="guides" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Documentation</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={section.icon} />
                      </svg>
                      <span className="font-medium">{section.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-3xl font-bold text-black mb-4">{currentSection.title}</h2>
                <p className="text-lg text-gray-600 mb-8 pb-8 border-b border-gray-200">
                  {currentSection.description}
                </p>

                <div className="space-y-12">
                  {currentSection.sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-3">
                        <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </span>
                        {section.title}
                      </h3>
                      <div className="prose prose-gray max-w-none pl-11">
                        {section.content.split('\n\n').map((paragraph, pIndex) => {
                          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                              <h4 key={pIndex} className="font-semibold text-black mt-6 mb-3">
                                {paragraph.replace(/\*\*/g, '')}
                              </h4>
                            );
                          }
                          if (paragraph.startsWith('```')) {
                            const code = paragraph.replace(/```\w*\n?/g, '').trim();
                            return (
                              <pre key={pIndex} className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-4 text-sm">
                                <code>{code}</code>
                              </pre>
                            );
                          }
                          if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                            const items = paragraph.split('\n').filter(item => item.trim());
                            return (
                              <ul key={pIndex} className="list-disc list-inside space-y-2 my-4 text-gray-600">
                                {items.map((item, iIndex) => (
                                  <li key={iIndex}>{item.replace(/^[-*]\s*/, '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          if (paragraph.match(/^\d+\.\s/)) {
                            const items = paragraph.split('\n').filter(item => item.trim());
                            return (
                              <ol key={pIndex} className="list-decimal list-inside space-y-2 my-4 text-gray-600">
                                {items.map((item, iIndex) => (
                                  <li key={iIndex}>{item.replace(/^\d+\.\s*/, '')}</li>
                                ))}
                              </ol>
                            );
                          }
                          return (
                            <p key={pIndex} className="text-gray-600 leading-relaxed my-4">
                              {paragraph.split('**').map((part, partIndex) =>
                                partIndex % 2 === 1 ? (
                                  <strong key={partIndex} className="text-black">{part}</strong>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Helpful Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Helpful Resources</h2>
            <p className="text-lg text-gray-600">Additional resources to help you succeed</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="#" className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">Templates Library</h3>
              <p className="text-sm text-gray-600">Pre-built automation templates for common use cases</p>
            </a>

            <a href="#" className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2 group-hover:text-purple-600 transition-colors">Community Forum</h3>
              <p className="text-sm text-gray-600">Connect with other users and share tips</p>
            </a>

            <a href="#" className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2 group-hover:text-green-600 transition-colors">Webinars</h3>
              <p className="text-sm text-gray-600">Live and recorded training sessions</p>
            </a>

            <a href="#" className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-black mb-2 group-hover:text-orange-600 transition-colors">Release Notes</h3>
              <p className="text-sm text-gray-600">Stay updated with new features and changes</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need More Help?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
                Our support team is ready to assist you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 text-base font-semibold hover:bg-gray-100 transition-all rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Contact Support
                </Link>
                <Link
                  href="/faq"
                  className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all"
                >
                  View FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
