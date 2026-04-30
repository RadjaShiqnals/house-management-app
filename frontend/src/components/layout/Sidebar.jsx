import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', icon: '🏠', label: 'Beranda' },
];
const menuItems = [
  { to: '/residents', icon: '👥', label: 'Penghuni' },
  { to: '/houses', icon: '🏘️', label: 'Rumah' },
];
const keuanganItems = [
  { to: '/bills', icon: '💰', label: 'Tagihan' },
  { to: '/expenses', icon: '📉', label: 'Pengeluaran' },
  { to: '/reports', icon: '📊', label: 'Laporan' },
];

const linkClass = "flex items-center px-5 py-3 text-white/80 transition-all hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-white no-underline";
const activeClass = "bg-white/10 text-white border-l-4 border-white";

function NavLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`${linkClass} ${isActive ? activeClass : ''}`}>
      <span className="mr-4 text-xl">{icon}</span> {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-[250px] bg-primary text-white h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="p-5 flex justify-center items-center">
        <div className="bg-white text-primary px-5 py-2.5 rounded font-bold text-lg">RT-OFFICE</div>
      </div>
      <div className="px-5 pb-5">
        <input type="text" placeholder="Cari menu..." className="w-full p-2.5 rounded border-none bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>
      <nav className="flex-1 overflow-y-auto">
        {navItems.map(i => <NavLink key={i.to} {...i} />)}
        <div className="px-5 pt-4 pb-1 text-xs text-white/60 uppercase tracking-wider">MENU</div>
        {menuItems.map(i => <NavLink key={i.to} {...i} />)}
        <div className="px-5 pt-4 pb-1 text-xs text-white/60 uppercase tracking-wider">KEUANGAN</div>
        {keuanganItems.map(i => <NavLink key={i.to} {...i} />)}
      </nav>
    </aside>
  );
}
