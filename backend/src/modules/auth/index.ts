import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../../lib/prisma.js';
import { sendEmail, emailTemplates } from '../../lib/email.js';

// Rate limit config for auth endpoints
const authRateLimit = {
  max: 5, // 5 attempts
  timeWindow: '15 minutes', // per 15 minutes
  errorResponseBuilder: () => ({
    success: false,
    error: 'Too many attempts. Please try again in 15 minutes.',
    statusCode: 429,
  }),
};

const authModule: FastifyPluginAsync = async (fastify) => {
  // ============================================
  // SIGNUP (5 attempts per 15 minutes)
  // ============================================
  fastify.post('/signup', {
    config: {
      rateLimit: authRateLimit,
    },
  }, async (request, reply) => {
    const { name, email, password } = request.body as {
      name: string;
      email: string;
      password: string;
    };

    // Validation
    if (!name || !email || !password) {
      return reply.status(400).send({
        success: false,
        error: 'Name, email, and password are required',
      });
    }

    if (password.length < 8) {
      return reply.status(400).send({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return reply.status(400).send({
        success: false,
        error: 'Please enter a valid email address',
      });
    }

    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        return reply.status(409).send({
          success: false,
          error: 'An account with this email already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });

      // Create a default workspace for the user
      const workspace = await prisma.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          members: {
            create: {
              userId: user.id,
              role: 'admin',
            },
          },
        },
      });

      // Generate JWT token
      const token = fastify.jwt.sign(
        {
          userId: user.id,
          email: user.email,
          workspaceId: workspace.id,
        },
        { expiresIn: '7d' }
      );

      return reply.status(201).send({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
        },
      });
    } catch (error: any) {
      fastify.log.error('Signup error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to create account. Please try again.',
      });
    }
  });

  // ============================================
  // LOGIN (5 attempts per 15 minutes)
  // ============================================
  fastify.post('/login', {
    config: {
      rateLimit: authRateLimit,
    },
  }, async (request, reply) => {
    const { email, password, rememberMe } = request.body as {
      email: string;
      password: string;
      rememberMe?: boolean;
    };

    // Validation
    if (!email || !password) {
      return reply.status(400).send({
        success: false,
        error: 'Email and password are required',
      });
    }

    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          workspaces: {
            include: {
              workspace: true,
            },
          },
        },
      });

      if (!user) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid email or password',
        });
      }

      // Check if user is blocked or suspended
      if (user.status === 'blocked') {
        return reply.status(403).send({
          success: false,
          error: 'Your account has been blocked. Please contact support.',
        });
      }

      if (user.status === 'suspended') {
        return reply.status(403).send({
          success: false,
          error: 'Your account has been suspended. Please contact support.',
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return reply.status(401).send({
          success: false,
          error: 'Invalid email or password',
        });
      }

      // Get the user's first workspace (or create one if none exists)
      let workspace = user.workspaces[0]?.workspace;

      if (!workspace) {
        workspace = await prisma.workspace.create({
          data: {
            name: `${user.name}'s Workspace`,
            members: {
              create: {
                userId: user.id,
                role: 'admin',
              },
            },
          },
        });
      }

      // Generate JWT token - 7 days if remember me, 24 hours otherwise
      const tokenExpiry = rememberMe ? '7d' : '24h';
      const token = fastify.jwt.sign(
        {
          userId: user.id,
          email: user.email,
          workspaceId: workspace.id,
        },
        { expiresIn: tokenExpiry }
      );

      return reply.send({
        success: true,
        token,
        rememberMe: !!rememberMe,
        expiresIn: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // milliseconds
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        workspace: {
          id: workspace.id,
          name: workspace.name,
        },
      });
    } catch (error: any) {
      fastify.log.error('Login error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to login. Please try again.',
      });
    }
  });

  // ============================================
  // FORGOT PASSWORD (3 attempts per 15 minutes - stricter)
  // ============================================
  fastify.post('/forgot-password', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: '15 minutes',
        errorResponseBuilder: () => ({
          success: false,
          error: 'Too many password reset attempts. Please try again later.',
          statusCode: 429,
        }),
      },
    },
  }, async (request, reply) => {
    const { email } = request.body as { email: string };

    if (!email) {
      return reply.status(400).send({
        success: false,
        error: 'Email is required',
      });
    }

    try {
      // Find user (don't reveal if user exists or not for security)
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      // Always return success to prevent email enumeration
      if (!user) {
        return reply.send({
          success: true,
          message: 'If an account exists with this email, you will receive a password reset link.',
        });
      }

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Delete any existing reset tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      });

      // Create new reset token (expires in 1 hour)
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: hashedToken,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      // Build reset URL
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

      // Send email using template
      const emailContent = emailTemplates.passwordReset(user.name, resetUrl);
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      return reply.send({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    } catch (error: any) {
      fastify.log.error('Forgot password error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to process request. Please try again.',
      });
    }
  });

  // ============================================
  // RESET PASSWORD
  // ============================================
  fastify.post('/reset-password', async (request, reply) => {
    const { token, password } = request.body as {
      token: string;
      password: string;
    };

    if (!token || !password) {
      return reply.status(400).send({
        success: false,
        error: 'Token and new password are required',
      });
    }

    if (password.length < 8) {
      return reply.status(400).send({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
    }

    try {
      // Hash the token to compare with stored hash
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // Find valid reset token
      const resetToken = await prisma.passwordResetToken.findFirst({
        where: {
          token: hashedToken,
          used: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!resetToken) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid or expired reset link. Please request a new one.',
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password
      await prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      });

      // Mark token as used
      await prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      });

      return reply.send({
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.',
      });
    } catch (error: any) {
      fastify.log.error('Reset password error:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to reset password. Please try again.',
      });
    }
  });

  // ============================================
  // VERIFY TOKEN (check if user is authenticated)
  // ============================================
  fastify.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();
      const { userId } = request.user as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          workspaces: {
            include: {
              workspace: true,
            },
          },
        },
      });

      if (!user) {
        return reply.status(401).send({
          success: false,
          error: 'User not found',
        });
      }

      return reply.send({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        workspaces: user.workspaces.map((wm) => ({
          id: wm.workspace.id,
          name: wm.workspace.name,
          role: wm.role,
        })),
      });
    } catch (error) {
      return reply.status(401).send({
        success: false,
        error: 'Invalid or expired token',
      });
    }
  });
};

export default authModule;
