import { z } from 'zod';
import { t } from '@trpc-server';
import { authMiddleware } from '@middlewares';

export const authRouter = t.router({
  getByKeywords: t.procedure.use(authMiddleware).input(z.object({
    keywords: z.array(z.string()).default(['apple', 'microsoft', 'google', 'netflix', 'amazon', 'twitter']),
    granularity: z.enum(['minute', 'hour', 'day']).default('hour'),
  })).mutation(async ({ input, ctx: { res, db, twitter } }) => {
    const { keywords, granularity } = input;
    const countsPromises = keywords.map((keyword) => twitter.tweets.tweetCountsRecentSearch({
      query: keyword,
      granularity: granularity,
    }));
    const counts = await Promise.all(countsPromises);
    const [apple, microsoft, google, netflix, amazon, twitterData] = counts;
    return {
      apple,
      microsoft,
      google,
      netflix,
      amazon,
      twitter: twitterData,
    };
  }),
});
