import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { DarkModeButton, Layout } from '@components';
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

  return <Layout>
    <Head>
      <title>Twittota</title>
    </Head>

    <div className="absolute top-0 right-0 p-2">
      <DarkModeButton />
    </div>

    <main className="">

    </main>
  </Layout>;
};

export default Home;
