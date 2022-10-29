import { UnauthorizedError } from '@lib/errors';
import { authMiddleware } from '@middlewares';
import { t } from '@trpc-server';
import { z } from 'zod';

export const usersRouter = t.router({
  me: t.procedure.use(authMiddleware).query(async ({
    ctx: { db, session },
  }) => {
    const user = await db.user.findFirst({
      where: { id: session.userId },
      select: { email: true },
    });
    if (!user) {
      throw new UnauthorizedError();
    }
    return { email: user.email };
  }),
});
