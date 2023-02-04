import { UnauthorizedError } from '@lib/errors';
import { t } from '@trpc-server';

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const { session } = ctx;
  if (!session || session.expires < new Date()) {
    throw new UnauthorizedError();
  }

  return next({
    ctx: {
      ...ctx,
      session,
    },
  });
});
