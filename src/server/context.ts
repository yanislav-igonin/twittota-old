import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import type { PrismaClient, Session } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@db';
import type { Client as TwitterClient } from 'twitter-api-sdk';
import { client as twitter } from '@twitter';

type CreateContextOptions = {
  req: NextApiRequest;
  res: NextApiResponse
  session: Session | null
  db: PrismaClient
  twitter: TwitterClient
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return _opts;
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  const { req, res } = opts;
  const sessionId = req.cookies.sid || '';
  const session = await db.session.findFirst({ where: { id: sessionId } });
  return await createContextInner({ req, res, session, db, twitter });
}
