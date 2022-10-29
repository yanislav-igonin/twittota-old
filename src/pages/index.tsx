import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { DarkModeButton, Layout, MainCard } from '@components';
import { db } from '@db';
import { trpc } from '@lib/trpc';

const loginRedirect = {
  redirect: {
    destination: '/auth/login',
    permanent: false,
  },
};

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const sessionId = req.cookies.sid || '';
  if (!sessionId) {
    return loginRedirect;
  }
  const session = await db.session.findFirst({ where: { id: sessionId } });
  if (!session || session.expires < new Date()) {
    return loginRedirect;
  }
  return { props: {} };
};

const Home: NextPage = () => {
  const helloQuery = trpc.example.hello.useQuery({ text: 'trpc' });
  const meQuery = trpc.users.me.useQuery();
  const me = meQuery.isLoading ? 'loading...' : meQuery.data?.email;

  return <Layout>
    <Head>
      <title>NextJS Template</title>
    </Head>

    <div className="absolute top-0 right-0 p-2">
      <DarkModeButton />
    </div>

    <main className="flex flex-col w-screen h-screen justify-center items-center bg-gradient-to-tr from-emerald-400 to-fuchsia-400 dark:from-emerald-600 dark:to-fuchsia-600">
      {helloQuery.data
        ? <h1 className="text-2xl mb-2 text-center dark:text-white">
          <>{helloQuery.data.message}</> at <>{helloQuery.data.time.toLocaleString()}</>
        </h1>
        : <h1 className="text-2xl mb-2 text-center dark:text-white">loading...</h1>}

      <h1 className='dark:text-white text-2xl mb-2'>email: {me}</h1>

      <MainCard />
    </main>
  </Layout>;
};

export default Home;
