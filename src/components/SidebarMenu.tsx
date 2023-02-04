import { ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/react/24/solid';
import { trpc } from '@lib/trpc';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type LinkProps = {
  href: string;
  icon: JSX.Element;
  label: string;
};

export const SidebarMenu = () => {
  const links: LinkProps[] = [
    {
      href: '/',
      icon: <HomeIcon fill="white" />,
      label: 'Home',
    },
  ];
  const router = useRouter();
  const currentPath = router.pathname;
  const logout = trpc.auth.logout.useMutation();

  const onLogout = async () => {
    await logout.mutateAsync();
    await router.push('/auth/login');
  };

  return (
    <nav className="flex flex-col h-screen bg-slate-800">
      {links.map((link) => {
        return (
          <MenuLink
            key={link.href}
            {...link}
            isActive={link.href === currentPath}
          />
        );
      })}
      <div
        className="absolute bottom-0"
        onClick={onLogout}
      >
        <LogoutMenuLink />
      </div>
    </nav>
  );
};

type MenuLinkProps = LinkProps & { isActive: boolean };

const MenuLinkButton = ({
  icon,
  isActive,
}: Pick<MenuLinkProps, 'icon' | 'isActive'>) => {
  return (
    <button
      className={`
  text-lg
  p-2
  cursor-pointer
  w-12
  hover:bg-red-500
  ${isActive ? 'bg-rose-500' : ''}`}
    >
      {icon}
    </button>
  );
};

const MenuLink = ({ href, icon, isActive }: MenuLinkProps) => {
  return (
    <Link href={href}>
      <MenuLinkButton
        icon={icon}
        isActive={isActive}
      />
    </Link>
  );
};

const LogoutMenuLink = () => {
  return (
    <MenuLinkButton
      icon={<ArrowRightOnRectangleIcon fill="white" />}
      isActive={false}
    />
  );
};
