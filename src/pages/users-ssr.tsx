import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { db } from '@db';
import Link from 'next/link';
import { Layout } from '@components';

const loginRedirect = {
  redirect: {
    destination: '/auth/login',
    permanent: false,
  },
};

export const getServerSideProps = async ({ req, query }: GetServerSidePropsContext) => {
  const sessionId = req.cookies.sid || '';
  if (!sessionId) {
    return loginRedirect;
  }
  const session = await db.session.findFirst({ where: { id: sessionId } });
  if (!session || session.expires < new Date()) {
    return loginRedirect;
  }
  const page = query.page ? Number(query.page) : 1;
  const users = await db.user.findMany({
    select: { id: true, email: true },
    skip: (page - 1) * 20,
    take: 20,
  });
  const count = await db.user.count();
  return { props: { users, count } };
};

const Users: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  { count, users }
) => {
  const router = useRouter();
  const pageFromQuery = Number(router.query.page) || 1;
  const pagesCount = Math.ceil(count / 20);
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);
  return <Layout>
    <main className='p-4'>
      <h1>Users</h1>
      <ul>
        {users.map((user) => <li key={user.id}>{user.email}</li>)}
      </ul>
      <ul className='flex justify-center items-center gap-2 flex-wrap'>
        {pages.map((page) => <li key={page}>
          <Link className='text-lg cursor-pointer' href={`/users-ssr?page=${page}`}
              style={{ color: page === pageFromQuery ? 'blue' : 'inherit' }}>
          {page}
        </Link>
        </li>)}
    </ul>
  </main>
  </Layout >;
};

export default Users;
