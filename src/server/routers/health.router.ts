import { OkResponse } from '@lib/responses';
import { t } from '../trpc';

export const healthRouter = t.router({
  check: t.procedure.query(() => new OkResponse()),
});
