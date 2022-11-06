import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { Layout, Spinner } from '@components';
import { db } from '@db';
import { trpc } from '@lib/trpc';
import { TweetsCountChart } from '@components/TweetsCountChart';

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

const removeDoubleQuotes = (str: string) => str.replace(/"/g, '');

const Home: NextPage = () => {
  const { data } = trpc.trends.getByKeywords.useQuery({});

  return <Layout>
    <Head>
      <title>Trends</title>
    </Head>

    <div className="flex items-center justify-center flex-wrap">
      {data
        ? data.map((trend) => {
          const { keyword, data: trendData } = trend;
          if (!trendData) {
            return null;
          }
          return <div key={keyword} className="w-full mb-4">
            <h1 className='dark:text-slate-50 font-medium text-2xl'>{removeDoubleQuotes(keyword)}</h1>
            <div className='w-full h-96'>
              <TweetsCountChart series={trendData} label={removeDoubleQuotes(keyword)} />
            </div>
          </div>;
        })
        : <div className='w-screen h-screen flex justify-center items-center'>
          <Spinner width={40} height={40} />
        </div>}
    </div>
  </Layout>;
};

export default Home;

