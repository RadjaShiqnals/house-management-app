import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function HouseListPage() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHouses = () => {
    api.get('/houses').then(r => setHouses(r.data.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchHouses(); }, []);

  const delHouse = (id) => {
    if (window.confirm('Yakin hapus rumah ini?')) {
      api.delete(`/houses/${id}`).then(() => fetchHouses()).catch(() => alert('Gagal hapus'));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h2>Daftar Rumah</h2><button className="btn-primary" onClick={() => navigate('/houses/create')}>Tambah Rumah</button></div>
      <div className="card"><div className="card-body">
        <table className="data-table">
          <thead><tr><th>Nomor</th><th>Status</th><th>Penghuni Aktif</th><th>Aksi</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="4" className="text-center">Loading...</td></tr> :
             houses.map(h => (
              <tr key={h.id}>
                <td>{h.nomor_rumah}</td>
                <td><span className={`badge ${h.status === 'dihuni' ? 'tetap' : 'kontrak'}`}>{h.status}</span></td>
                <td>{h.active_resident ? h.active_resident.nama_lengkap : '-'}</td>
                <td>
                  <button className="btn-sm btn-edit mr-1" onClick={() => navigate(`/houses/${h.id}/edit`)}>Edit</button>
                  <button className="btn-sm bg-blue-500 text-white mr-1 border-none" onClick={() => navigate(`/houses/${h.id}`)}>Detail</button>
                  <button className="btn-sm btn-danger border-none" onClick={() => delHouse(h.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}
