/**
 * This file contains tRPC's HTTP response handler
 */
import { appRouter } from '@routers';
import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from 'server/context';

export default trpcNext.createNextApiHandler({
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },

  /**
   * @link https://trpc.io/docs/context
   */
  createContext,

  /**
   * @link https://trpc.io/docs/error-handling
   */
  onError({ error }) {
    if (error.code === 'INTERNAL_SERVER_ERROR') {
      // send to bug reporting
      console.error('Something went wrong', error);
    }
  },

  router: appRouter,
  /**
   * @link https://trpc.io/docs/caching#api-response-caching
   */
  // responseMeta() {
  //   // ...
  // },
});
