import express from 'express';
import { apiRouter } from './routes';
import { applySecurity } from './middleware/security';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

export function createApp() {
  const app = express();
  applySecurity(app);

  app.get('/', (req, res) => {
    res.json({ success: true, message: 'FinWise AI API' });
  });

  app.use('/api/v1', apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}