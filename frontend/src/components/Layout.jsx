import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 font-sans">
      {/* Shared Header Navigation */}
      <Header />

      {/* Main Page Content Body */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Shared Footer Navigation */}
      <Footer />
    </div>
  );
}
