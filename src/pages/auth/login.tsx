import { Button, Input } from '@components';
import { trpc } from '@lib/trpc';
import { TRPCClientError } from '@trpc/client';
import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import { type FC, type PropsWithChildren, useState } from 'react';

const CredLabel: FC<PropsWithChildren> = ({ children }) => {
  return <span className="font-medium text-2xl">{children}</span>;
};

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = trpc.auth.login.useMutation();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({
        email,
        password,
      });
      router.push('/');
    } catch (error) {
      if (error instanceof TRPCClientError) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="flex flex-col w-full px-4 md:w-1/4"
        onSubmit={onSubmit}
      >
        <div className="m-1">
          <CredLabel>email: admin@admin.com</CredLabel>
          <Input
            disabled={login.isLoading}
            onChange={(e) => {
              return setEmail(e.target.value);
            }}
            placeholder="Email"
            type="email"
            value={email}
          />
        </div>
        <div className="m-1">
          <CredLabel>pass: 1234qwerA_</CredLabel>
          <Input
            disabled={login.isLoading}
            onChange={(e) => {
              return setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
            value={password}
          />
        </div>
        <div className="m-1">
          <Button
            disabled={login.isLoading}
            loading={login.isLoading}
            type="submit"
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
