import { ReactNode } from 'react';
import { SidebarMenu } from './SidebarMenu';

export const Layout = ({ children }: { children: ReactNode }) =>
  <div className='flex flex-row'>
    <SidebarMenu />
    {children}
  </div>;
