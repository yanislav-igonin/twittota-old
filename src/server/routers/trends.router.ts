import { authMiddleware } from '@middlewares';
import { t } from '@trpc-server';
import { z } from 'zod';

const defaultKeywords = [
  'apple',
  '"$aapl"',
  'microsoft',
  '"$msft"',
  'google',
  '"$goog"',
  'netflix',
  '"$nflx"',
  'amazon',
  '"$amzn"',
  'meta',
  '"$meta"',
  'bitcoin',
  '"$btc"',
  'ethereum',
  '"$eth"',
];

export const trendsRouter = t.router({
  getByKeywords: t.procedure
    .use(authMiddleware)
    .input(
      z
        .object({
          granularity: z.enum(['minute', 'hour', 'day']).default('hour'),
          keywords: z.array(z.string()).default(defaultKeywords),
        })
        .strict(),
    )
    .query(async ({ input, ctx: { twitter } }) => {
      const { keywords, granularity } = input;
      const countsPromises = keywords.map(async (keyword) => {
        return await twitter.tweets.tweetCountsRecentSearch({
          granularity,
          query: keyword,
        });
      });
      const counts = await Promise.all(countsPromises);
      return counts.map((count, index) => {
        return {
          keyword: keywords[index],
          ...count,
        };
      });
    }),
});
