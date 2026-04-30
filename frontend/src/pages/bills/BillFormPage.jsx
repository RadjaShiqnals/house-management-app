import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function BillFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ house_id: '', fee_type_id: '1', bulan: '', jumlah_bulan: 1 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await api.post('/bills', form); navigate('/bills'); }
    catch (err) { alert(err.response?.data?.message || 'Gagal simpan'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h2>Tambah Tagihan Manual</h2><button className="btn-secondary" onClick={() => navigate('/bills')}>Kembali</button></div>
      <div className="card"><div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>ID Rumah</label><input type="number" className="input" value={form.house_id} onChange={e => setForm({...form, house_id: e.target.value})} required /></div>
          <div className="form-group"><label>Jenis Iuran</label><select className="input" value={form.fee_type_id} onChange={e => setForm({...form, fee_type_id: e.target.value})}><option value="1">Satpam</option><option value="2">Kebersihan</option></select></div>
          <div className="form-group"><label>Bulan</label><input type="date" className="input" value={form.bulan} onChange={e => setForm({...form, bulan: e.target.value})} required /></div>
          <div className="form-group"><label>Jumlah Bulan</label><input type="number" className="input" min="1" value={form.jumlah_bulan} onChange={e => setForm({...form, jumlah_bulan: e.target.value})} required /></div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </form>
      </div></div>
    </div>
  );
}
