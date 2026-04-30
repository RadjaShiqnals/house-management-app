import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function HouseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [residents, setResidents] = useState([]);
  const [assignForm, setAssignForm] = useState({ resident_id: '', tgl_masuk: '' });
  const [showGanti, setShowGanti] = useState(false);

  const fetchDetail = () => { api.get(`/houses/${id}`).then(r => setHouse(r.data)).catch(console.error); };
  const fetchResidents = () => { api.get('/residents?limit=100').then(r => setResidents(r.data.data || r.data)).catch(console.error); };
  
  useEffect(() => { fetchDetail(); fetchResidents(); }, [id]);

  const assignResident = async (e) => {
    e.preventDefault();
    try {
      if (house.active_resident) {
        await api.post(`/houses/${id}/unassign`, { tgl_keluar: assignForm.tgl_masuk });
      }
      await api.post(`/houses/${id}/assign`, assignForm);
      fetchDetail();
      setAssignForm({ resident_id: '', tgl_masuk: '' });
      setShowGanti(false);
      alert('Berhasil mengubah penghuni');
    } catch (err) { alert('Gagal: ' + (err.response?.data?.message || 'Error')); }
  };

  const unassignResident = async () => {
    try {
      await api.post(`/houses/${id}/unassign`, { tgl_keluar: new Date().toISOString().split('T')[0] });
      fetchDetail();
      alert('Penghuni dicabut');
    } catch (err) { alert('Gagal unassign: ' + (err.response?.data?.message || 'Error')); }
  };

  if (!house) return <p>Loading...</p>;
  return (
    <div className="page-container">
      <div className="page-header"><h2>Detail Rumah {house.nomor_rumah}</h2><button className="btn-secondary" onClick={() => navigate('/houses')}>Kembali</button></div>
      <div className="card"><div className="card-body">
        <p><strong>Alamat:</strong> {house.alamat}</p>
        <p><strong>Status:</strong> {house.status === 'dihuni' ? 'Dihuni' : 'Kosong'}</p>
        <p><strong>Penghuni Aktif:</strong> {house.active_resident ? house.active_resident.nama_lengkap : 'Kosong'}</p>

        {!house.active_resident ? (
          <div style={{marginTop:20, padding:15, background:'#f5f5f5'}}>
            <h3>Assign Penghuni</h3>
            <form onSubmit={assignResident} className="flex gap-2 flex-wrap">
              <select className="input" style={{maxWidth:200}} value={assignForm.resident_id} onChange={e => setAssignForm({...assignForm, resident_id: e.target.value})} required>
                <option value="">-- Pilih Penghuni --</option>
                {residents.map(r => <option key={r.id} value={r.id}>{r.nama_lengkap}</option>)}
              </select>
              <input type="date" className="input" style={{maxWidth:180}} value={assignForm.tgl_masuk} onChange={e => setAssignForm({...assignForm, tgl_masuk: e.target.value})} required />
              <button type="submit" className="btn-primary">Assign</button>
            </form>
          </div>
        ) : (
          <div style={{marginTop:20}} className="flex gap-2">
            <button className="btn-primary" onClick={() => setShowGanti(!showGanti)}>Ganti Penghuni</button>
            <button className="btn-danger" onClick={unassignResident}>Kosongkan Rumah</button>
          </div>
        )}

        {showGanti && house.active_resident && (
          <div style={{marginTop:10, padding:15, background:'#eef2ff', borderRadius:5}}>
            <h3 className="mt-0 mb-3 text-primary">Ubah Penghuni Rumah</h3>
            <form onSubmit={assignResident} className="flex gap-2 flex-wrap">
              <select className="input" style={{maxWidth:200}} value={assignForm.resident_id} onChange={e => setAssignForm({...assignForm, resident_id: e.target.value})} required>
                <option value="">-- Pilih Penghuni Baru --</option>
                {residents.map(r => <option key={r.id} value={r.id}>{r.nama_lengkap}</option>)}
              </select>
              <input type="date" className="input" style={{maxWidth:180}} value={assignForm.tgl_masuk} onChange={e => setAssignForm({...assignForm, tgl_masuk: e.target.value})} required />
              <button type="submit" className="btn-primary">Ganti & Assign</button>
            </form>
          </div>
        )}

        <h3 style={{marginTop:30}}>History Penghuni</h3>
        <table className="data-table">
          <thead><tr><th>Nama Penghuni</th><th>Tgl Masuk</th><th>Tgl Keluar</th></tr></thead>
          <tbody>
            {(house.histories || []).map(h => (
              <tr key={h.id}><td>{h.resident?.nama_lengkap || h.resident_id}</td><td>{h.tgl_masuk}</td><td>{h.tgl_keluar || 'Masih Menempati'}</td></tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}
