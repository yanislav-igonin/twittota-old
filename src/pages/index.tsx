import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Layout, Spinner } from '@components';
import { db } from '@db';
import { trpc } from '@lib/trpc';
import { ThemeMode, useDarkMode } from '@lib/hooks/useDarkMode';
import { useEffect, useState } from 'react';

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

const darkThemeStroke = 'rgb(248 250 252)';
const lightThemeStroke = '#8884d8';

const Home: NextPage = () => {
  const [theme] = useDarkMode();
  const firstRenderStroke = theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke;
  const [strokeColor, setStrokeColor] = useState(firstRenderStroke);

  useEffect(() => {
    setStrokeColor(theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke);
  }, [theme]);

  const { data } = trpc.trends.getByKeywords.useQuery({});
  // get window width from brower
  const width = typeof window !== 'undefined' ? window.innerWidth - 48 - 16 - 16 : 1000;
  return <Layout>
    <Head>
      <title>Trends</title>
    </Head>

    {data
      ? data.map((trend) => {
        const { keyword, meta, data: trendData } = trend;
        if (!trendData) {
          return null;
        }
        return <div key={keyword} className="w-full mb-4">
          <h1 className='dark:text-slate-50 font-medium text-2xl'>{keyword}</h1>
          <LineChart width={width} height={400} data={trendData}>
            <Line type="monotone" dataKey="tweet_count" stroke={strokeColor} />
            <CartesianGrid stroke="#ccc" />
            <Tooltip labelFormatter={(v: string) => new Date(v).toLocaleString()} />
            <XAxis dataKey="start"
              angle={20}
              interval={24}
              stroke={strokeColor}
              tickFormatter={(v: string) => new Date(v).toLocaleDateString()} />
            <YAxis dataKey="tweet_count" stroke={strokeColor} />
          </LineChart>
          <h1 className='dark:text-slate-50 font-medium text-2xl'>Total tweets count for period: {meta?.total_tweet_count}</h1>
        </div>;
      })
      : <div className='w-screen h-screen flex justify-center items-center'>
        <Spinner width={40} height={40} />
      </div>}
  </Layout>;
};

export default Home;
