import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';
import type { AppRouter } from '@routers';
import { config } from './config';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${config.port}`;
};

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,

          // headers() {
          //   if (ctx?.req) {
          //     // To use SSR properly, you need to forward the client's headers to the server
          //     // This is so you can pass through things like cookies when we're server-side rendering
          //     // If you're using Node 18, omit the "connection" header
          //     const {
          //       connection: _connection,
          //       ...headers
          //     } = ctx.req.headers;
          //     return {
          //       ...headers,
          //       // Optional: inform server that it's an SSR request
          //       'x-ssr': '1',
          //     };
          //   }
          //   return {};
          // },
        }),
      ],
      transformer: superjson,
      /**
       * @link https://react-query-v3.tanstack.com/reference/QueryClient
       **/
      queryClientConfig: { defaultOptions: { queries: { refetchOnWindowFocus: false } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  // ssr: true,
});
// => { useQuery: ..., useMutation: ...}
