import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]);
  const [isForm, setIsForm] = useState(false);
  const [form, setForm] = useState({ kategori: 'perbaikan_jalan', judul: '', jumlah: '', tgl_pengeluaran: '' });

  const fetchEx = () => { api.get('/expenses').then(r => setExpenses(r.data.data)).catch(console.error); };
  useEffect(() => { fetchEx(); }, []);

  const saveExpense = async (e) => {
    e.preventDefault();
    try { await api.post('/expenses', form); setIsForm(false); fetchEx(); }
    catch { alert('Gagal simpan'); }
  };

  const delExpense = (id) => {
    // Menghapus confirm agar tidak ke-block di iframe / IDE preview
    api.delete(`/expenses/${id}`).then(() => fetchEx()).catch(() => alert('Gagal hapus'));
  };

  return (
    <div className="page-container">
      <div className="page-header"><h2>Daftar Pengeluaran</h2><button className="btn-primary" onClick={() => { setIsForm(true); setForm({ kategori: 'perbaikan_jalan', judul: '', jumlah: '', tgl_pengeluaran: '' }); }}>Tambah Pengeluaran</button></div>

      {isForm && (
        <div className="card"><div className="card-body">
          <h3>Tambah Pengeluaran</h3>
          <form onSubmit={saveExpense}>
            <div className="form-group"><select className="input" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}><option value="perbaikan_jalan">Perbaikan Jalan</option><option value="perbaikan_selokan">Perbaikan Selokan</option><option value="gaji_satpam">Gaji Satpam</option><option value="token_listrik">Token Listrik</option><option value="lainnya">Lainnya</option></select></div>
            <div className="form-group"><input className="input" placeholder="Judul" value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} required /></div>
            <div className="form-group"><input className="input" type="number" placeholder="Jumlah" value={form.jumlah} onChange={e => setForm({...form, jumlah: e.target.value})} required /></div>
            <div className="form-group"><input className="input" type="date" value={form.tgl_pengeluaran} onChange={e => setForm({...form, tgl_pengeluaran: e.target.value})} required /></div>
            <button type="submit" className="btn-primary">Simpan</button>
            <button type="button" className="btn-secondary ml-2" onClick={() => setIsForm(false)}>Batal</button>
          </form>
        </div></div>
      )}

      {!isForm && (
        <div className="card"><div className="card-body">
          <table className="data-table">
            <thead><tr><th>Kategori</th><th>Judul</th><th>Jumlah</th><th>Tanggal</th><th>Aksi</th></tr></thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id}><td>{e.kategori}</td><td>{e.judul}</td><td>Rp {e.jumlah}</td><td>{e.tgl_pengeluaran}</td>
                  <td><button className="btn-danger" style={{position:'relative', zIndex:50}} onClick={() => delExpense(e.id)}>Hapus</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
    </div>
  );
}
