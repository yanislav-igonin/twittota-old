import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';
import { trpc } from '@lib/trpc';
import { ErrorBoundary } from '@components';

const MyApp: AppType = ({ Component, pageProps }) => <ErrorBoundary>
  <Head>
    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
  </Head>
  <Component {...pageProps} />
</ErrorBoundary>;

export default trpc.withTRPC(MyApp);
