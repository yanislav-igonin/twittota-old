import { InvalidEmailOrPasswordError, UnauthorizedError } from '@lib/errors';
import { compare } from '@lib/passwords';
import { OkResponse } from '@lib/responses';
import { authMiddleware } from '@middlewares';
import { type Session } from '@prisma/client';
import { t } from '@trpc-server';
import { z } from 'zod';

const ONE_MINUTE_MS = 60 * 1_000;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;
const ONE_DAY_S = ONE_DAY_MS / 1_000;

const getSessionCookieString = ({ id }: Session) => {
  return `sid=${id}; Path=/; HttpOnly; Max-Age=${ONE_DAY_S}`;
};

export const authRouter = t.router({
  login: t.procedure
    .input(
      z
        .object({
          email: z.string().email(),
          password: z.string(),
        })
        .strict(),
    )
    .mutation(async ({ input, ctx: { res, db } }) => {
      const { email, password } = input;
      const user = await db.user.findFirst({
        select: {
          email: true,
          id: true,
          password: true,
        },
        where: {
          email,
        },
      });
      if (!user) {
        throw new InvalidEmailOrPasswordError();
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw new InvalidEmailOrPasswordError();
      }

      const session = await db.session.create({
        data: {
          expires: new Date(Date.now() + ONE_DAY_MS),
          userId: user.id,
        },
      });
      res.setHeader('Set-Cookie', getSessionCookieString(session));
      return {
        email: user.email,
      };
    }),
  logout: t.procedure
    .use(authMiddleware)
    .mutation(async ({ ctx: { session, res, db } }) => {
      await db.session.update({
        data: {
          expires: new Date(),
        },
        where: {
          id: session.id,
        },
      });
      res.setHeader('Set-Cookie', 'sid=; Path=/; HttpOnly; Max-Age=0');
      return new OkResponse();
    }),
  me: t.procedure
    .use(authMiddleware)
    .query(async ({ ctx: { db, session } }) => {
      const user = await db.user.findFirst({
        select: {
          email: true,
        },
        where: {
          id: session.userId,
        },
      });
      if (!user) {
        throw new UnauthorizedError();
      }

      return {
        email: user.email,
      };
    }),
});
