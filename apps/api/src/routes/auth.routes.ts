import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authLoginSchema, authSignupSchema } from '@finwise/shared';
import { prisma } from '../config/prisma';
import { signAccessToken, signRefreshToken } from '../services/jwt.service';

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
  const input = authSignupSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      fullName: input.fullName,
      passwordHash: await bcrypt.hash(input.password, 12),
      role: 'USER',
    },
    select: { id: true, email: true, fullName: true, role: true },
  });

  const payload = { sub: user.id, role: user.role, email: user.email } as const;
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.cookie('finwise_refresh', refreshToken, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.status(201).json({ success: true, data: { user, accessToken } });
});

authRouter.post('/login', async (req, res) => {
  const input = authLoginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user || !user.passwordHash) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const payload = { sub: user.id, role: user.role, email: user.email } as const;
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  res.cookie('finwise_refresh', refreshToken, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      accessToken,
    },
  });
});

authRouter.post('/forgot-password', async (_req, res) => {
  res.json({ success: true, message: 'Password reset flow queued. Wire SMTP + token storage in production.' });
});

authRouter.post('/google', async (_req, res) => {
  res.json({ success: true, message: 'Google OAuth flow should be completed with Passport or Auth.js in production.' });
});