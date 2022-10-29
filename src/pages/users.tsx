import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { db } from '@db';
import { trpc } from '@lib/trpc';
import { Layout } from '@components';

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

const Users: NextPage = () => {
  const router = useRouter();
  const pageFromQuery = Number(router.query.page) || 1;
  const [activePage, setActivePage] = useState(pageFromQuery);

  const onPaginationChange = async (page: number) => {
    setActivePage(page);
    router.push(`/users?page=${page}`, undefined, { shallow: true });
  };

  const { data } = trpc.users.getAll.useQuery({ page: activePage });
  const pagesCount = data ? Math.ceil(data?.count / 20) : 0;
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
  return <Layout>
    <main className='p-4'>
      <h1>Users</h1>
      <ul>
        {!data
          ? 'loading...'
          : data.users.map((user) => <li key={user.id}>{user.email}</li>)}
      </ul>
      <ul className='flex justify-center items-center gap-2 flex-wrap'>
        {pages.map((page) => <li key={page}>
          <p onClick={() => onPaginationChange(page)}
            className='text-lg cursor-pointer'
            style={{ color: page === activePage ? 'blue' : 'inherit' }}>
            {page}
          </p>
        </li>)}
      </ul>
    </main>
  </Layout>;
};

export default Users;
