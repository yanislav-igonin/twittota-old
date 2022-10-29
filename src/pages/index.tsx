import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Layout } from '@components';
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
  const { data } = trpc.trends.getByKeywords.useQuery({});
  // get window width from brower
  const width = typeof window !== 'undefined' ? window.innerWidth - 48 - 16 - 16 : 1000;
  return <Layout>
    <Head>
      <title>Trends</title>
    </Head>

    {data
      ? data.map((trend) => {
        const { keyword, data: trendData } = trend;
        if (!trendData) {
          return null;
        }
        return <div key={keyword} className="w-full">
          <h1 className='dark:text-slate-50 font-medium text-2xl'>{keyword}</h1>
          <LineChart width={width} height={400} data={trendData}>
            <Line type="monotone" dataKey="tweet_count" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <Tooltip labelFormatter={(v: string) => new Date(v).toLocaleString()} />
            <XAxis dataKey="start"
              angle={20}
              interval={24}
              tickFormatter={(v: string) => new Date(v).toLocaleDateString()} />
            <YAxis dataKey="tweet_count" />
          </LineChart>
        </div>;
      })
      : <div>Loading...</div>}
  </Layout>;
};

export default Home;
