import { t } from '../trpc';
import { authRouter } from './auth.router';
import { trendsRouter } from './trends.router';

// Main router.
export const appRouter = t.router({
  auth: authRouter,
  trends: trendsRouter,
});

export type AppRouter = typeof appRouter;
