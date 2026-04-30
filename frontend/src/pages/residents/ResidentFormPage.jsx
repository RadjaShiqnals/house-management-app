import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function ResidentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ nama_lengkap: '', status_penghuni: 'tetap', status_nikah: 'belum', nomor_telepon: '' });

  useEffect(() => {
    if (isEdit) {
      api.get(`/residents/${id}`).then(res => setForm(res.data)).catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nama_lengkap', form.nama_lengkap);
      fd.append('status_penghuni', form.status_penghuni);
      fd.append('status_nikah', form.status_nikah);
      fd.append('nomor_telepon', form.nomor_telepon);
      if (file) fd.append('foto_ktp', file);
      if (isEdit) {
        fd.append('_method', 'PUT');
        await api.post(`/residents/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/residents', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/residents');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{isEdit ? 'Edit' : 'Tambah'} Penghuni</h2>
        <button className="btn-secondary" onClick={() => navigate('/residents')}>Kembali</button>
      </div>
      <div className="card"><div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Nama Lengkap</label><input type="text" className="input" value={form.nama_lengkap} onChange={e => setForm({...form, nama_lengkap: e.target.value})} required /></div>
          <div className="form-group"><label>Status Penghuni</label><select className="input" value={form.status_penghuni} onChange={e => setForm({...form, status_penghuni: e.target.value})}><option value="tetap">Tetap</option><option value="kontrak">Kontrak</option></select></div>
          <div className="form-group"><label>Status Nikah</label><select className="input" value={form.status_nikah} onChange={e => setForm({...form, status_nikah: e.target.value})}><option value="menikah">Menikah</option><option value="belum">Belum</option></select></div>
          <div className="form-group"><label>Nomor Telepon</label><input type="text" className="input" value={form.nomor_telepon} onChange={e => setForm({...form, nomor_telepon: e.target.value})} required /></div>
          <div className="form-group"><label>Foto KTP (Opsional)</label><input type="file" className="input" accept="image/*" onChange={e => setFile(e.target.files[0])} /></div>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </form>
      </div></div>
    </div>
  );
}
