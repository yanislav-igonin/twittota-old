import '../styles/globals.css';
import { ErrorBoundary } from '@components';
import { trpc } from '@lib/trpc';
import { type AppType } from 'next/dist/shared/lib/utils';
import Head from 'next/head';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary>
      <Head>
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width"
          name="viewport"
        />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
};

export default trpc.withTRPC(MyApp);
