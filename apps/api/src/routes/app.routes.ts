import { Router } from 'express';
import { profileRouter } from './profile.routes';

export const appRouter = Router();
appRouter.use('/profile', profileRouter);