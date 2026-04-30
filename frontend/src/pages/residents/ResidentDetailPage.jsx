import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function ResidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resident, setResident] = useState(null);

  useEffect(() => { api.get(`/residents/${id}`).then(r => setResident(r.data)).catch(console.error); }, [id]);

  if (!resident) return <p>Loading...</p>;
  return (
    <div className="page-container">
      <div className="page-header"><h2>Detail Penghuni</h2><button className="btn-secondary" onClick={() => navigate('/residents')}>Kembali</button></div>
      <div className="card"><div className="card-body">
        <p><strong>Nama Lengkap:</strong> {resident.nama_lengkap}</p>
        <p><strong>Status Penghuni:</strong> {resident.status_penghuni}</p>
        <p><strong>Status Nikah:</strong> {resident.status_nikah}</p>
        <p><strong>Nomor Telepon:</strong> {resident.nomor_telepon}</p>
        {resident.foto_ktp && <><p><strong>Foto KTP:</strong></p><img src={`http://localhost:8000/storage/${resident.foto_ktp}`} alt="KTP" style={{maxWidth:300}} /></>}
      </div></div>
    </div>
  );
}
