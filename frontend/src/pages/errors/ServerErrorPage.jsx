import { useNavigate } from 'react-router-dom';

export default function ServerErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-bg-light">
      <h1 className="text-9xl font-bold text-red-600 mb-4">500</h1>
      <h2 className="text-3xl text-gray-800 mb-2">Terjadi Kesalahan Internal</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">Mohon maaf, terjadi kesalahan pada server kami. Silakan coba beberapa saat lagi.</p>
      <button onClick={() => navigate('/')} className="btn-primary">Kembali ke Beranda</button>
    </div>
  );
}
