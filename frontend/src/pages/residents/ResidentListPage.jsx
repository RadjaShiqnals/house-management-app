import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function ResidentListPage() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchResidents = (p = page) => {
    setLoading(true);
    let url = `/residents?page=${p}`;
    if (search) url += `&filter[nama_lengkap]=${search}`;
    api.get(url).then(res => {
      setResidents(res.data.data);
      setLastPage(res.data.last_page);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchResidents(); }, [page]);

  const delResident = (id) => {
    if (window.confirm('Yakin hapus penghuni ini?')) {
      api.delete(`/residents/${id}`).then(() => fetchResidents()).catch(() => alert('Gagal hapus'));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Daftar Penghuni</h2>
        <button className="btn-primary" onClick={() => navigate('/residents/create')}>Tambah Penghuni</button>
      </div>
      <div className="card">
        <div className="card-body">
          <input type="text" className="input mb-4" style={{maxWidth:300}} placeholder="Cari nama..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} onKeyUp={() => fetchResidents(1)} />
          <table className="data-table">
            <thead><tr><th>Nama</th><th>Status</th><th>Nikah</th><th>Telepon</th><th>Aksi</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="text-center">Loading...</td></tr> :
               residents.length === 0 ? <tr><td colSpan="5" className="text-center">Belum ada data</td></tr> :
               residents.map(r => (
                <tr key={r.id}>
                  <td>{r.nama_lengkap}</td>
                  <td><span className={`badge ${r.status_penghuni}`}>{r.status_penghuni}</span></td>
                  <td>{r.status_nikah}</td>
                  <td>{r.nomor_telepon}</td>
                  <td>
                    <button className="btn-sm btn-edit mr-1" onClick={() => navigate(`/residents/${r.id}/edit`)}>Edit</button>
                    <button className="btn-sm bg-blue-500 text-white mr-1 border-none" onClick={() => navigate(`/residents/${r.id}`)}>Detail</button>
                    <button className="btn-sm btn-danger border-none" onClick={() => delResident(r.id)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {lastPage > 1 && (
            <div className="flex gap-2 mt-4 items-center">
              <button className="btn-sm" disabled={page===1} onClick={() => setPage(page-1)}>Prev</button>
              <span>Page {page} / {lastPage}</span>
              <button className="btn-sm" disabled={page===lastPage} onClick={() => setPage(page+1)}>Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
