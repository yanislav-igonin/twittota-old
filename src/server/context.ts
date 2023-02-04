import { db } from '@db';
import { type PrismaClient, type Session } from '@prisma/client';
import type * as trpc from '@trpc/server';
import type * as trpcNext from '@trpc/server/adapters/next';
import { client as twitter } from '@twitter';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { type Client as TwitterClient } from 'twitter-api-sdk';

type CreateContextOptions = {
  db: PrismaClient;
  req: NextApiRequest;
  res: NextApiResponse;
  session: Session | null;
  twitter: TwitterClient;
};

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_options: CreateContextOptions) {
  return _options;
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 *
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  options: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  const { req, res } = options;
  const sessionId = req.cookies.sid || '';
  const session = await db.session.findFirst({
    where: {
      id: sessionId,
    },
  });
  return await createContextInner({
    db,
    req,
    res,
    session,
    twitter,
  });
}
