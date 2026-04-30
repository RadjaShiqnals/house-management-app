import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@rt.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="bg-white p-10 rounded-lg w-full max-w-md shadow-lg">
        <div className="text-center mb-8 text-primary">
          <h2 className="text-2xl font-bold m-0">RT-OFFICE</h2>
        </div>
        <form onSubmit={handleLogin}>
          {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">{errorMsg}</div>}
          <div className="mb-5">
            <label className="block mb-1.5 text-gray-600 font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="mb-6">
            <label className="block mb-1.5 text-gray-600 font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <button type="submit" disabled={loading} className="w-full p-3 bg-primary text-white font-bold rounded cursor-pointer transition-colors hover:bg-blue-900 disabled:opacity-50 border-none">
            {loading ? 'Sedang Login...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
