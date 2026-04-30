import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function HouseFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nomor_rumah: '', status: 'kosong', alamat: '' });

  useEffect(() => {
    if (isEdit) {
      api.get(`/houses/${id}`).then(r => setForm({ nomor_rumah: r.data.nomor_rumah, status: r.data.status, alamat: r.data.alamat || '' })).catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await api.put(`/houses/${id}`, form);
      else await api.post('/houses', form);
      navigate('/houses');
    } catch { alert('Gagal menyimpan'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h2>{isEdit ? 'Edit' : 'Tambah'} Rumah</h2><button className="btn-secondary" onClick={() => navigate('/houses')}>Kembali</button></div>
      <div className="card"><div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Nomor Rumah</label><input type="text" className="input" value={form.nomor_rumah} onChange={e => setForm({...form, nomor_rumah: e.target.value})} required /></div>
          <div className="form-group"><label>Status</label><select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="dihuni">Dihuni</option><option value="kosong">Kosong</option></select></div>
          <div className="form-group"><label>Alamat</label><textarea className="input" rows="3" value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} /></div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </form>
      </div></div>
    </div>
  );
}
