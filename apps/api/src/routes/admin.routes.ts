import { Router } from 'express';
import { prisma } from '../config/prisma';

export const adminRouter = Router();

adminRouter.get('/analytics', async (_req, res) => {
  const [users, reports, logs] = await Promise.all([
    prisma.user.count(),
    prisma.report.count(),
    prisma.auditLog.count(),
  ]);

  res.json({
    success: true,
    data: {
      users,
      reports,
      logs,
      apiUsage: 0,
    },
  });
});

adminRouter.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: users });
});

adminRouter.get('/reports', async (_req, res) => {
  const reports = await prisma.report.findMany({
    take: 25,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { fullName: true, email: true } } },
  });

  res.json({ success: true, data: reports });
});