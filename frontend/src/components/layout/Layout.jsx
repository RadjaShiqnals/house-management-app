import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[250px] flex flex-col">
        <Header />
        <main className="p-5 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
