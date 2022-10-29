import Link from 'next/link';
import { HomeIcon, UsersIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import React from 'react';
import { trpc } from '@lib/trpc';

type LinkProps = {
  href: string;
  label: string;
  icon: JSX.Element;
}

export const SidebarMenu = () => {
  const links: LinkProps[] = [
    { href: '/', label: 'Home', icon: <HomeIcon fill='white' /> },
    { href: '/users', label: 'Users', icon: <UsersIcon fill='white' /> },
    { href: '/users-ssr', label: 'Users SSR', icon: <UsersIcon fill='white' /> },
  ];
  const router = useRouter();
  const currentPath = router.pathname;
  const logout = trpc.auth.logout.useMutation();

  const onLogout = async () => {
    await logout.mutateAsync();
    await router.push('/auth/login');
  };

  return <nav className='flex flex-col h-screen bg-slate-800'>
    {links.map((link) =>
      <MenuLink key={link.href} {...link}
        isActive={link.href === currentPath} />
    )}
    <div className='absolute bottom-0' onClick={onLogout} >
      <LogoutMenuLink />
    </div>
  </nav>;
};

type MenuLinkProps = LinkProps & { isActive: boolean };

const MenuLinkButton = (
  { icon, isActive }: Pick<MenuLinkProps, 'icon' | 'isActive'>
) => <button className={`
  text-lg
  p-2
  cursor-pointer
  w-12
  hover:bg-red-500
  ${isActive ? 'bg-rose-500' : ''}`}>
    {icon}
  </button>;

const MenuLink = ({ href, icon, isActive }: MenuLinkProps) => <Link href={href}>
  <MenuLinkButton icon={icon} isActive={isActive} />
</Link>;

const LogoutMenuLink = () => <MenuLinkButton isActive={false}
  icon={<ArrowRightOnRectangleIcon fill='white' />} />;
