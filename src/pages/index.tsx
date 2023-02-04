import { Layout, LineChart, Spinner } from '@components';
import { db } from '@db';
import { trpc } from '@lib/trpc';
import { type GetServerSidePropsContext, type NextPage } from 'next';
import Head from 'next/head';

const loginRedirect = {
  redirect: {
    destination: '/auth/login',
    permanent: false,
  },
};

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
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

const removeDoubleQuotes = (string: string) => string.replaceAll('"', '');

const Home: NextPage = () => {
  const { data } = trpc.trends.getByKeywords.useQuery({});
  return (
    <Layout>
      <Head>
        <title>Trends</title>
      </Head>

      {data ? (
        data.map((trend) => {
          const { keyword, meta, data: trendData } = trend;
          if (!trendData) {
            return null;
          }

          return (
            <div
              className="w-full mb-4"
              key={keyword}
            >
              <h1 className="dark:text-slate-50 font-medium text-2xl">
                {removeDoubleQuotes(keyword)}
              </h1>
              <LineChart
                data={trendData}
                xKey="start"
                yKey="tweet_count"
              />
              <h1 className="dark:text-slate-50 font-medium text-2xl">
                Total tweets count for period: {meta?.total_tweet_count}
              </h1>
            </div>
          );
        })
      ) : (
        <div className="w-screen h-screen flex justify-center items-center">
          <Spinner
            height={40}
            width={40}
          />
        </div>
      )}
    </Layout>
  );
};

export default Home;
