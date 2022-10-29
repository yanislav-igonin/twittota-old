import { z } from 'zod';
import { t } from '../trpc';

export const exampleRouter = t.router({
  hello: t.procedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => ({
      message: `hello ${input.text}!`,
      time: new Date(),
    })),
});
