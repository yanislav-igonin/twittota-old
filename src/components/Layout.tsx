import { ReactNode } from 'react';
import { DarkModeButton } from './DarkModeButton';
import { SidebarMenu } from './SidebarMenu';

export const Layout = ({ children }: { children: ReactNode }) =>
  <div className='flex flex-row'>
    <div className="absolute top-0 right-0 p-2">
      <DarkModeButton />
    </div>

    <SidebarMenu />

    <main className="p-4 w-screen h-screen bg-white dark:bg-slate-600 overflow-y-scroll">
      {children}
    </main>
  </div>;
