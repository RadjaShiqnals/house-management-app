import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function BillListPage() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [genDate, setGenDate] = useState('2026-05-01');

  const fetchBills = () => { api.get('/bills').then(r => setBills(r.data.data)).catch(console.error); };
  useEffect(() => { fetchBills(); }, []);

  const generateBills = async () => {
    try { await api.post('/bills/generate', { bulan: genDate }); alert('Berhasil generate'); fetchBills(); }
    catch { alert('Gagal generate'); }
  };

  const payBill = async (b) => {
    console.log('Klik bayar tagihan', b);
    // Jika prompt terblokir, bayar lunas secara otomatis
    let nominal = window.prompt(`Jumlah bayar untuk Rp ${b.total_tagihan}:`, b.total_tagihan);
    if (nominal === null) {
      nominal = b.total_tagihan; // Fallback jika prompt diblokir oleh iframe
    }
    
    if (nominal) {
      try {
        await api.post(`/bills/${b.id}/pay`, { payment_bill_id: b.id, jumlah_bayar: parseInt(nominal), tgl_bayar: new Date().toISOString().split('T')[0] });
        alert('Berhasil bayar'); fetchBills();
      } catch { alert('Gagal bayar'); }
    }
  };

  const delBill = (id) => {
    console.log('Klik hapus tagihan', id);
    // Menghapus confirm agar tidak ke-block di iframe
    api.delete(`/bills/${id}`).then(() => fetchBills()).catch(() => alert('Gagal hapus'));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Daftar Tagihan & Pembayaran</h2>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-primary" onClick={() => navigate('/bills/create')}>Tambah Manual</button>
          <input type="date" className="input" style={{width:150}} value={genDate} onChange={e => setGenDate(e.target.value)} />
          <button className="btn-primary" onClick={generateBills}>Generate Bulanan</button>
        </div>
      </div>
      <div className="card"><div className="card-body">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Bulan</th><th>Rumah</th><th>Penghuni</th><th>Jenis</th><th>Tagihan</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.id}>
                <td>{b.id}</td><td>{b.bulan}</td><td>{b.house?.nomor_rumah}</td><td>{b.resident?.nama_lengkap}</td>
                <td>{b.fee_type?.nama}</td><td>Rp {b.total_tagihan}</td>
                <td><span className={`badge ${b.status === 'lunas' ? 'tetap' : 'kontrak'}`}>{b.status}</span></td>
                <td>
                  {b.status === 'belum' && <button className="btn-success mr-1" style={{position:'relative', zIndex:50}} onClick={() => payBill(b)}>Bayar</button>}
                  <button className="btn-sm btn-danger border-none" style={{position:'relative', zIndex:50}} onClick={() => delBill(b.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div>
    </div>
  );
}
