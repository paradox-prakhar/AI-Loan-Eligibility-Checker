import { Router } from 'express';
import { authRouter } from './auth.routes';
import { financeRouter } from './finance.routes';
import { reportRouter } from './report.routes';
import { adminRouter } from './admin.routes';
import { appRouter } from './app.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ success: true, message: 'FinWise API healthy', timestamp: new Date().toISOString() });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/finance', financeRouter);
apiRouter.use('/reports', reportRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/', appRouter);