import { z } from 'zod';
import { t } from '@trpc-server';
import { authMiddleware } from '@middlewares';

export const trendsRouter = t.router({
  getByKeywords: t.procedure.use(authMiddleware).input(z.object({
    keywords: z.array(z.string()).default(['apple', 'microsoft', 'google', 'netflix', 'amazon', 'twitter']),
    granularity: z.enum(['minute', 'hour', 'day']).default('hour'),
  })).query(async ({ input, ctx: { twitter } }) => {
    const { keywords, granularity } = input;
    const countsPromises = keywords.map(async (keyword) => await twitter.tweets.tweetCountsRecentSearch({
      query: keyword,
      granularity: granularity,
    }));
    const counts = await Promise.all(countsPromises);
    return counts.map((count, index) => ({
      keyword: keywords[index],
      ...count,
    }));
  }),
});
