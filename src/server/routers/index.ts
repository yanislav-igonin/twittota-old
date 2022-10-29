import { t } from '../trpc';
import { authRouter } from './auth.router';
import { usersRouter } from './users.router';

// Main router.
export const appRouter = t.router({
  auth: authRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;

