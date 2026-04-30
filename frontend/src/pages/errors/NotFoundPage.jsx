import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-bg-light">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">Maaf, halaman yang Anda tuju tidak tersedia atau telah dipindahkan.</p>
      <button onClick={() => navigate('/')} className="btn-primary">Kembali ke Beranda</button>
    </div>
  );
}
