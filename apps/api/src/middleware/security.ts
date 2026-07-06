import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import pinoHttp from 'pino-http';
import pino from 'pino';
import { env } from '../config/env';

const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' });

export function applySecurity(app: express.Express) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
      credentials: true,
    })
  );
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(mongoSanitize());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 150,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
    })
  );
  app.use(pinoHttp({ logger }));
}