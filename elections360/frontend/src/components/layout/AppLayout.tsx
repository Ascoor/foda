import { PropsWithChildren } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const AppLayout = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Sidebar />
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1 p-6">{children}</main>
      <Footer />
    </div>
  </div>
);

export default AppLayout;
