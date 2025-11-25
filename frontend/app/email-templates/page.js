"use client";

import { useState } from 'react';

// Email template components matching the backend
const baseTemplate = (content, footerText) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>DM Automation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%;">
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); width: 50px; height: 50px; border-radius: 12px; text-align: center; vertical-align: middle;">
                    <span style="color: white; font-weight: bold; font-size: 18px; line-height: 50px;">DM</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <tr>
                  <td style="padding: 48px 40px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              ${footerText ? `<p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">${footerText}</p>` : ''}
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px;">
                © 2025 DM Automation Platform. All rights reserved.
              </p>
              <p style="margin: 0;">
                <a href="#" style="color: #6b7280; font-size: 12px; text-decoration: none; margin: 0 8px;">Terms</a>
                <span style="color: #d1d5db;">|</span>
                <a href="#" style="color: #6b7280; font-size: 12px; text-decoration: none; margin: 0 8px;">Privacy</a>
                <span style="color: #d1d5db;">|</span>
                <a href="#" style="color: #6b7280; font-size: 12px; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const buttonComponent = (text, url, variant = 'primary') => {
  const styles = variant === 'primary'
    ? 'background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white;'
    : 'background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb;';

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
      <tr>
        <td style="${styles} padding: 14px 32px; border-radius: 8px; text-align: center;">
          <a href="${url}" style="color: inherit; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">${text}</a>
        </td>
      </tr>
    </table>
  `;
};

const alertBox = (message, type = 'info') => {
  const colors = {
    warning: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e', icon: '⚠️' },
    info: { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: 'ℹ️' },
    success: { bg: '#d1fae5', border: '#6ee7b7', text: '#065f46', icon: '✅' },
    error: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', icon: '❌' },
  };
  const c = colors[type];

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
      <tr>
        <td style="background: ${c.bg}; border: 1px solid ${c.border}; border-radius: 8px; padding: 16px;">
          <p style="color: ${c.text}; font-size: 14px; margin: 0; line-height: 1.5;">
            ${c.icon} ${message}
          </p>
        </td>
      </tr>
    </table>
  `;
};

const divider = () => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
    <tr>
      <td style="border-top: 1px solid #e5e7eb;"></td>
    </tr>
  </table>
`;

// Email Templates
const emailTemplates = {
  passwordReset: {
    name: 'Password Reset',
    description: 'Sent when user requests password reset',
    subject: 'Reset Your Password - DM Automation',
    html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Reset Your Password
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        We received a request to reset your password
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi John,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
        You requested to reset your password for your DM Automation account. Click the button below to create a new password:
      </p>

      ${buttonComponent('Reset Password', '#')}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 8px; text-align: center;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #2563eb; font-size: 13px; word-break: break-all; margin: 0 0 24px; text-align: center; background: #f3f4f6; padding: 12px; border-radius: 6px;">
        https://dmautomation.com/reset-password?token=abc123xyz789
      </p>

      ${alertBox('This link will expire in <strong>1 hour</strong>. If you didn\'t request this, you can safely ignore this email.', 'warning')}
    `),
  },

  welcome: {
    name: 'Welcome Email',
    description: 'Sent after successful signup',
    subject: 'Welcome to DM Automation! 🎉',
    html: baseTemplate(`
      <h1 style="color: #111827; font-size: 28px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Welcome to DM Automation! 🎉
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        Your account has been successfully created
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi John,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Thank you for joining DM Automation! You're now ready to automate your social media conversations and grow your business.
      </p>

      ${divider()}

      <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px;">
        🚀 Get Started in 4 Steps:
      </h2>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="width: 32px; height: 32px; background: #dbeafe; border-radius: 50%; text-align: center; vertical-align: middle; font-weight: 600; color: #2563eb; font-size: 14px;">1</td>
                <td style="padding-left: 16px; color: #374151; font-size: 15px;">Connect your Instagram or Facebook account</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="width: 32px; height: 32px; background: #dbeafe; border-radius: 50%; text-align: center; vertical-align: middle; font-weight: 600; color: #2563eb; font-size: 14px;">2</td>
                <td style="padding-left: 16px; color: #374151; font-size: 15px;">Create your first automation flow</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="width: 32px; height: 32px; background: #dbeafe; border-radius: 50%; text-align: center; vertical-align: middle; font-weight: 600; color: #2563eb; font-size: 14px;">3</td>
                <td style="padding-left: 16px; color: #374151; font-size: 15px;">Set up your AI knowledge base</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="width: 32px; height: 32px; background: #dbeafe; border-radius: 50%; text-align: center; vertical-align: middle; font-weight: 600; color: #2563eb; font-size: 14px;">4</td>
                <td style="padding-left: 16px; color: #374151; font-size: 15px;">Start engaging with your audience automatically!</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${buttonComponent('Go to Dashboard', '#')}

      ${alertBox('Need help getting started? Reply to this email and we\'ll be happy to assist!', 'info')}
    `, 'Questions? Contact us at support@dmautomation.com'),
  },

  emailVerification: {
    name: 'Email Verification',
    description: 'Sent to verify email address',
    subject: 'Verify Your Email - DM Automation',
    html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Verify Your Email Address
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        One more step to complete your registration
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi John,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
        Please verify your email address to complete your registration and access all features of DM Automation.
      </p>

      ${buttonComponent('Verify Email', '#')}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 8px; text-align: center;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #2563eb; font-size: 13px; word-break: break-all; margin: 0 0 24px; text-align: center; background: #f3f4f6; padding: 12px; border-radius: 6px;">
        https://dmautomation.com/verify-email?token=verify123xyz
      </p>

      ${alertBox('This link will expire in <strong>24 hours</strong>.', 'info')}
    `),
  },

  passwordChanged: {
    name: 'Password Changed',
    description: 'Confirmation after password change',
    subject: 'Your Password Has Been Changed - DM Automation',
    html: baseTemplate(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: #d1fae5; border-radius: 50%; display: inline-block; line-height: 64px; font-size: 28px;">
          ✓
        </div>
      </div>

      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Password Changed Successfully
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        Your account password has been updated
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi John,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Your password has been successfully changed. You can now use your new password to sign in to your account.
      </p>

      ${alertBox('If you did not make this change, please contact our support team immediately and secure your account.', 'warning')}

      ${divider()}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
        Changed on: <strong>Monday, November 25, 2025, 10:30 AM</strong>
      </p>
    `),
  },

  newLoginAlert: {
    name: 'New Login Alert',
    description: 'Security alert for new sign-ins',
    subject: 'New Login to Your Account - DM Automation',
    html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        New Login Detected
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        We noticed a new sign-in to your account
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi John,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        We detected a new login to your DM Automation account. Here are the details:
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #f9fafb; border-radius: 8px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Browser:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">Chrome 120</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">OS:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">macOS Sonoma</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">IP Address:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">192.168.1.100</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">Nicosia, Cyprus</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">Nov 25, 2025, 10:30 AM</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${alertBox('If this wasn\'t you, please change your password immediately and review your account security.', 'warning')}

      ${buttonComponent('Secure My Account', '#', 'secondary')}
    `),
  },

  planUpdated: {
    name: 'Plan Updated',
    description: 'Subscription upgrade notification',
    subject: "You're now on Pro Plan - DM Automation",
    html: baseTemplate(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); border-radius: 50%; display: inline-block; line-height: 64px; font-size: 28px;">
          🚀
        </div>
      </div>

      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Welcome to Pro Plan!
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        Your plan has been successfully updated
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi John,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Great news! Your account has been upgraded to <strong>Pro Plan</strong>. You now have access to:
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="color: #10b981; font-size: 16px; padding-right: 12px;">✓</td>
                <td style="color: #374151; font-size: 15px;">Unlimited automation flows</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="color: #10b981; font-size: 16px; padding-right: 12px;">✓</td>
                <td style="color: #374151; font-size: 15px;">Advanced AI responses</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="color: #10b981; font-size: 16px; padding-right: 12px;">✓</td>
                <td style="color: #374151; font-size: 15px;">Priority support</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="color: #10b981; font-size: 16px; padding-right: 12px;">✓</td>
                <td style="color: #374151; font-size: 15px;">Team collaboration (up to 5 members)</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="color: #10b981; font-size: 16px; padding-right: 12px;">✓</td>
                <td style="color: #374151; font-size: 15px;">Analytics & reporting</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${buttonComponent('Explore New Features', '#')}

      ${alertBox('Your billing will be updated on your next billing cycle.', 'info')}
    `),
  },

  weeklyReport: {
    name: 'Weekly Report',
    description: 'Weekly stats and performance summary',
    subject: 'Your Weekly DM Automation Report 📊',
    html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Your Weekly Report 📊
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        November 18 - November 25, 2025
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Hi John, here's how your automations performed this week:
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
        <tr>
          <td style="width: 50%; padding: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #f0fdf4; border-radius: 12px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="color: #10b981; font-size: 32px; font-weight: 700; margin: 0;">1,234</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0;">Messages Sent</p>
                </td>
              </tr>
            </table>
          </td>
          <td style="width: 50%; padding: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #eff6ff; border-radius: 12px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="color: #2563eb; font-size: 32px; font-weight: 700; margin: 0;">5</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0;">Active Automations</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="width: 50%; padding: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fef3c7; border-radius: 12px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="color: #d97706; font-size: 32px; font-weight: 700; margin: 0;">78%</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0;">Engagement Rate</p>
                </td>
              </tr>
            </table>
          </td>
          <td style="width: 50%; padding: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fae8ff; border-radius: 12px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="color: #a855f7; font-size: 14px; font-weight: 600; margin: 0;">Welcome Flow</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0;">Top Performing Flow</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${buttonComponent('View Full Report', '#')}

      ${divider()}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
        Keep up the great work! 💪
      </p>
    `, 'You can adjust your email preferences in your account settings'),
  },

  teamInvitation: {
    name: 'Team Invitation',
    description: 'Workspace/team invitation',
    subject: 'John invited you to join Acme Corp - DM Automation',
    html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        You're Invited! 🎉
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        Join your team on DM Automation
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hello,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        <strong>John Doe</strong> has invited you to join <strong>Acme Corp</strong> on DM Automation.
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #f9fafb; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 24px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">You've been invited to:</p>
            <p style="color: #111827; font-size: 20px; font-weight: 600; margin: 0;">Acme Corp</p>
          </td>
        </tr>
      </table>

      ${buttonComponent('Accept Invitation', '#')}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 8px; text-align: center;">
        Or copy and paste this link:
      </p>
      <p style="color: #2563eb; font-size: 13px; word-break: break-all; margin: 0; text-align: center; background: #f3f4f6; padding: 12px; border-radius: 6px;">
        https://dmautomation.com/invite/abc123xyz
      </p>

      ${alertBox('This invitation will expire in <strong>7 days</strong>.', 'info')}
    `),
  },
};

export default function EmailTemplatesDemo() {
  const [selectedTemplate, setSelectedTemplate] = useState('passwordReset');
  const template = emailTemplates[selectedTemplate];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                DM
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Email Templates</h1>
                <p className="text-sm text-gray-500">Preview all email designs</p>
              </div>
            </div>
            <a
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar - Template List */}
          <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Templates</h2>
                <p className="text-xs text-gray-500 mt-1">{Object.keys(emailTemplates).length} templates</p>
              </div>
              <div className="divide-y divide-gray-100">
                {Object.entries(emailTemplates).map(([key, tmpl]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full text-left p-4 transition-colors ${
                      selectedTemplate === key
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <p className={`font-medium text-sm ${selectedTemplate === key ? 'text-blue-900' : 'text-gray-900'}`}>
                      {tmpl.name}
                    </p>
                    <p className={`text-xs mt-1 ${selectedTemplate === key ? 'text-blue-700' : 'text-gray-500'}`}>
                      {tmpl.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main - Email Preview */}
          <div className="col-span-9">
            {/* Template Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
                  <p className="text-gray-500 mt-1">{template.description}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Subject Line:</p>
                <p className="text-sm font-medium text-gray-900">{template.subject}</p>
              </div>
            </div>

            {/* Email Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-gray-400">Email Preview</span>
                </div>
              </div>
              <div className="p-0">
                <iframe
                  srcDoc={template.html}
                  className="w-full border-0"
                  style={{ height: '800px' }}
                  title="Email Preview"
                />
              </div>
            </div>

            {/* Code Preview */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Usage Code</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`
const { sendEmail, emailTemplates } = require('./lib/email');

const email = emailTemplates.${selectedTemplate}('John', 'https://example.com/action');
await sendEmail({
  to: 'user@example.com',
  subject: email.subject,
  html: email.html,
});
                    `.trim());
                  }}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Copy Code
                </button>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-x-auto">
                <code>{`const { sendEmail, emailTemplates } = require('./lib/email');

const email = emailTemplates.${selectedTemplate}('John', 'https://example.com/action');
await sendEmail({
  to: 'user@example.com',
  subject: email.subject,
  html: email.html,
});`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
