import type { AuthTokenPayload } from '../services/jwt.service';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};