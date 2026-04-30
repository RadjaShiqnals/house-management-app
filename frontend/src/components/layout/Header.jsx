import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="h-[60px] bg-white flex justify-between items-center px-5 shadow-sm sticky top-0 z-10">
      <button className="bg-transparent text-primary text-2xl border-none cursor-pointer">☰</button>
      <div className="flex items-center gap-5">
        <div className="relative flex items-center gap-2.5 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
          <span className="text-sm text-gray-500 uppercase">ADMIN RT</span>
          <div className="w-[35px] h-[35px] rounded-full bg-gray-800 text-white flex justify-center items-center font-bold">A</div>
          {showDropdown && (
            <div className="absolute top-[50px] right-0 bg-white border border-gray-200 rounded shadow-md min-w-[150px] z-20">
              <a href="#" className="block px-4 py-2.5 text-gray-800 hover:bg-gray-100 no-underline">Profile</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="block px-4 py-2.5 text-gray-800 hover:bg-gray-100 no-underline">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
