import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Layout, Spinner } from '@components';
import { db } from '@db';
import { trpc } from '@lib/trpc';
import { useMemo } from 'react';
import { AxisOptions } from 'react-charts';
import { types } from 'twitter-api-sdk';
import dynamic from 'next/dynamic';
import { ThemeMode, useDarkMode } from '@lib/hooks/useDarkMode';
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-charts').then((mod) => mod.Chart), {
  ssr: false,
});

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

const removeDoubleQuotes = (str: string) => str.replace(/"/g, '');

type TweetsCountData = types.components['schemas']['SearchCount'];

const MyChart = ({ series, label }: { series: TweetsCountData[], label: string }) => {

  const data = [
    {
      label,
      data: series,
      dataType: 'time',
    },
  ];


  const primaryAxis = useMemo((): AxisOptions<TweetsCountData> => ({
    getValue: datum => new Date(datum.start),
    scaleType: 'time',
  }), []);

  const secondaryAxes = useMemo((): AxisOptions<TweetsCountData>[] => [{
    getValue: datum => datum.tweet_count,
    elementType: 'line',
  }], []);

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
};


const Home: NextPage = () => {
  const [theme] = useDarkMode();
  const firstRenderStroke = theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke;
  const [strokeColor, setStrokeColor] = useState(firstRenderStroke);

  useEffect(() => {
    setStrokeColor(theme === ThemeMode.Dark ? darkThemeStroke : lightThemeStroke);
  }, [theme]);

  const { data } = trpc.trends.getByKeywords.useQuery({});
  // get window width from brower
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
          <h1 className='dark:text-slate-50 font-medium text-2xl'>{removeDoubleQuotes(keyword)}</h1>
          <div className='w-full h-96'>
            <MyChart series={trendData} label={removeDoubleQuotes(keyword)} />
          </div>
          
          <div className='w-full h-96'>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData}>
                <Line type="monotone" dataKey="tweet_count" stroke={strokeColor} strokeWidth={3} dot={false}/>
                <CartesianGrid stroke="#ccc" />
                <Tooltip labelFormatter={(v: string) => new Date(v).toLocaleString()} />
                <XAxis dataKey="start"
                  angle={20}
                  interval={24}
                  tickLine={false}
                  stroke={strokeColor}
                  tickFormatter={(v: string) => new Date(v).toLocaleDateString()} />
                <YAxis 
                dataKey="tweet_count" stroke={strokeColor} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <h1 className='dark:text-slate-50 font-medium text-2xl'>Total tweets count for period: {meta?.total_tweet_count}</h1>
        </div>;
      })
      : <div className='w-screen h-screen flex justify-center items-center'>
        <Spinner width={40} height={40} />
      </div>}
  </Layout>;
};

export default Home;

