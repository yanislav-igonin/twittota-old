import { t } from '../trpc';
import { authRouter } from './auth.router';

// Main router.
export const appRouter = t.router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

