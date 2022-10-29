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
  getAll: t.procedure.use(authMiddleware).input(z.object({
    page: z.number().default(1),
  })).query(async ({ ctx: { db }, input: { page } }) => {
    const users = await db.user.findMany({
      select: { email: true, id: true },
      skip: (page - 1) * 20,
      take: 20,
    });
    const count = await db.user.count();
    return { users, count };
  }),
});
