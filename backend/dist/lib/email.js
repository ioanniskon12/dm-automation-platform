import nodemailer from 'nodemailer';
// Create transporter based on environment
const createTransporter = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    // Production: Use your SMTP server
    if (isProduction && process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    // Development: Return null (will log to console)
    return null;
};
export const sendEmail = async (options) => {
    const { to, subject, html, text } = options;
    const transporter = createTransporter();
    // Development mode - log to console
    if (!transporter) {
        console.log('\n' + '='.repeat(60));
        console.log('📧 EMAIL (Development Mode)');
        console.log('='.repeat(60));
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('-'.repeat(60));
        // Extract any links from HTML
        const linkMatches = html.match(/href="(https?:\/\/[^"]*)"/g);
        if (linkMatches) {
            console.log('🔗 Links found:');
            linkMatches.forEach((match) => {
                const url = match.match(/href="([^"]*)"/)?.[1];
                if (url)
                    console.log(`   ${url}`);
            });
        }
        console.log('-'.repeat(60));
        console.log('HTML Content (preview):');
        const textPreview = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300);
        console.log(textPreview + '...');
        console.log('='.repeat(60) + '\n');
        return { success: true, dev: true };
    }
    // Production mode - send actual email
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''),
        });
        console.log(`✅ Email sent: ${info.messageId}`);
        return {
            success: true,
            messageId: info.messageId,
        };
    }
    catch (error) {
        console.error('❌ Email send error:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};
// ============================================
// BASE EMAIL TEMPLATE
// ============================================
const baseTemplate = (content, footerText) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>DM Automation</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse;}
    .button {padding: 14px 40px !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%;">

          <!-- Header with Logo -->
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

          <!-- Content Card -->
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

          <!-- Footer -->
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
// ============================================
// BUTTON COMPONENT
// ============================================
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
// ============================================
// ALERT BOX COMPONENT
// ============================================
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
// ============================================
// DIVIDER COMPONENT
// ============================================
const divider = () => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
    <tr>
      <td style="border-top: 1px solid #e5e7eb;"></td>
    </tr>
  </table>
`;
// ============================================
// EMAIL TEMPLATES
// ============================================
export const emailTemplates = {
    // Password Reset Email
    passwordReset: (name, resetUrl) => ({
        subject: 'Reset Your Password - DM Automation',
        html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Reset Your Password
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        We received a request to reset your password
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi ${name},
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
        You requested to reset your password for your DM Automation account. Click the button below to create a new password:
      </p>

      ${buttonComponent('Reset Password', resetUrl)}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 8px; text-align: center;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #2563eb; font-size: 13px; word-break: break-all; margin: 0 0 24px; text-align: center; background: #f3f4f6; padding: 12px; border-radius: 6px;">
        ${resetUrl}
      </p>

      ${alertBox('This link will expire in <strong>1 hour</strong>. If you didn\'t request this, you can safely ignore this email.', 'warning')}
    `),
    }),
    // Welcome Email
    welcome: (name, dashboardUrl) => ({
        subject: 'Welcome to DM Automation! 🎉',
        html: baseTemplate(`
      <h1 style="color: #111827; font-size: 28px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Welcome to DM Automation! 🎉
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        Your account has been successfully created
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi ${name},
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

      ${buttonComponent('Go to Dashboard', dashboardUrl)}

      ${alertBox('Need help getting started? Reply to this email and we\'ll be happy to assist!', 'info')}
    `, 'Questions? Contact us at support@dmautomation.com'),
    }),
    // Email Verification
    emailVerification: (name, verifyUrl) => ({
        subject: 'Verify Your Email - DM Automation',
        html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Verify Your Email Address
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        One more step to complete your registration
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi ${name},
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
        Please verify your email address to complete your registration and access all features of DM Automation.
      </p>

      ${buttonComponent('Verify Email', verifyUrl)}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 8px; text-align: center;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #2563eb; font-size: 13px; word-break: break-all; margin: 0 0 24px; text-align: center; background: #f3f4f6; padding: 12px; border-radius: 6px;">
        ${verifyUrl}
      </p>

      ${alertBox('This link will expire in <strong>24 hours</strong>.', 'info')}
    `),
    }),
    // Password Changed Confirmation
    passwordChanged: (name) => ({
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
        Hi ${name},
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Your password has been successfully changed. You can now use your new password to sign in to your account.
      </p>

      ${alertBox('If you did not make this change, please contact our support team immediately and secure your account.', 'warning')}

      ${divider()}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
        Changed on: <strong>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
      </p>
    `),
    }),
    // New Login Alert
    newLoginAlert: (name, deviceInfo) => ({
        subject: 'New Login to Your Account - DM Automation',
        html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        New Login Detected
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        We noticed a new sign-in to your account
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi ${name},
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
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${deviceInfo.browser}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">OS:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${deviceInfo.os}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">IP Address:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${deviceInfo.ip}</td>
              </tr>
              ${deviceInfo.location ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${deviceInfo.location}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Time:</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      ${alertBox('If this wasn\'t you, please change your password immediately and review your account security.', 'warning')}

      ${buttonComponent('Secure My Account', '#', 'secondary')}
    `),
    }),
    // Subscription / Plan Update
    planUpdated: (name, planName, features) => ({
        subject: `You're now on ${planName} - DM Automation`,
        html: baseTemplate(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); border-radius: 50%; display: inline-block; line-height: 64px; font-size: 28px;">
          🚀
        </div>
      </div>

      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Welcome to ${planName}!
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        Your plan has been successfully updated
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Hi ${name},
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Great news! Your account has been upgraded to <strong>${planName}</strong>. You now have access to:
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
        ${features.map(feature => `
        <tr>
          <td style="padding: 8px 0;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="color: #10b981; font-size: 16px; padding-right: 12px;">✓</td>
                <td style="color: #374151; font-size: 15px;">${feature}</td>
              </tr>
            </table>
          </td>
        </tr>
        `).join('')}
      </table>

      ${buttonComponent('Explore New Features', '#')}

      ${alertBox('Your billing will be updated on your next billing cycle.', 'info')}
    `),
    }),
    // Weekly Report / Summary
    weeklyReport: (name, stats) => ({
        subject: 'Your Weekly DM Automation Report 📊',
        html: baseTemplate(`
      <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center;">
        Your Weekly Report 📊
      </h1>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 32px; text-align: center;">
        ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
        Hi ${name}, here's how your automations performed this week:
      </p>

      <!-- Stats Grid -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
        <tr>
          <td style="width: 50%; padding: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #f0fdf4; border-radius: 12px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="color: #10b981; font-size: 32px; font-weight: 700; margin: 0;">${stats.messages.toLocaleString()}</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0;">Messages Sent</p>
                </td>
              </tr>
            </table>
          </td>
          <td style="width: 50%; padding: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #eff6ff; border-radius: 12px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="color: #2563eb; font-size: 32px; font-weight: 700; margin: 0;">${stats.automations}</p>
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
                  <p style="color: #d97706; font-size: 32px; font-weight: 700; margin: 0;">${stats.engagement}</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0;">Engagement Rate</p>
                </td>
              </tr>
            </table>
          </td>
          <td style="width: 50%; padding: 8px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fae8ff; border-radius: 12px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <p style="color: #a855f7; font-size: 14px; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${stats.topFlow}</p>
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
    }),
    // Team Invitation
    teamInvitation: (inviterName, workspaceName, inviteUrl) => ({
        subject: `${inviterName} invited you to join ${workspaceName} - DM Automation`,
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
        <strong>${inviterName}</strong> has invited you to join <strong>${workspaceName}</strong> on DM Automation.
      </p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #f9fafb; border-radius: 12px; margin-bottom: 32px;">
        <tr>
          <td style="padding: 24px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">You've been invited to:</p>
            <p style="color: #111827; font-size: 20px; font-weight: 600; margin: 0;">${workspaceName}</p>
          </td>
        </tr>
      </table>

      ${buttonComponent('Accept Invitation', inviteUrl)}

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 8px; text-align: center;">
        Or copy and paste this link:
      </p>
      <p style="color: #2563eb; font-size: 13px; word-break: break-all; margin: 0; text-align: center; background: #f3f4f6; padding: 12px; border-radius: 6px;">
        ${inviteUrl}
      </p>

      ${alertBox('This invitation will expire in <strong>7 days</strong>.', 'info')}
    `),
    }),
};
export default { sendEmail, emailTemplates };
//# sourceMappingURL=email.js.map