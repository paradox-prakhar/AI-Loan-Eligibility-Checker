import { Router } from 'express';
import { prisma } from '../config/prisma';
import { requireAuth } from '../middleware/auth';

export const profileRouter = Router();

profileRouter.use(requireAuth);

profileRouter.get('/me', async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true, profiles: true, reports: true },
  });

  res.json({ success: true, data: user });
});