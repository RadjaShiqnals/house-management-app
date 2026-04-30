import { useState, useEffect, useMemo } from 'react';
import api from '../../api/axiosInstance';

const getMonthName = (m) => new Date(2000, m - 1, 1).toLocaleString('id-ID', { month: 'long' });

export default function ReportPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(Array(12).fill({ pemasukan: 0, pengeluaran: 0 }));

  const fetchReport = () => {
    api.get(`/reports/monthly-summary?year=${year}`).then(res => {
      const result = Array(12).fill(null).map(() => ({ pemasukan: 0, pengeluaran: 0 }));
      if (Array.isArray(res.data)) {
        res.data.forEach(item => {
          const idx = parseInt(item.month) - 1;
          result[idx] = { pemasukan: parseFloat(item.income) || 0, pengeluaran: parseFloat(item.expense) || 0 };
        });
      }
      setData(result);
    }).catch(console.error);
  };

  useEffect(() => { fetchReport(); }, []);

  const totalIn = useMemo(() => data.reduce((s, x) => s + x.pemasukan, 0), [data]);
  const totalOut = useMemo(() => data.reduce((s, x) => s + x.pengeluaran, 0), [data]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Laporan Keuangan Tahunan</h2>
        <div className="flex gap-2">
          <input type="number" className="input" style={{width:100}} value={year} onChange={e => setYear(e.target.value)} />
          <button className="btn-primary" onClick={fetchReport}>Tampilkan</button>
        </div>
      </div>
      <div className="card"><div className="card-body">
        <table className="data-table">
          <thead><tr><th>Bulan</th><th>Pemasukan</th><th>Pengeluaran</th><th>Saldo</th></tr></thead>
          <tbody>
            {data.map((val, idx) => (
              <tr key={idx}>
                <td>{getMonthName(idx + 1)}</td>
                <td>Rp {val.pemasukan.toLocaleString('id-ID')}</td>
                <td>Rp {val.pengeluaran.toLocaleString('id-ID')}</td>
                <td className={val.pemasukan - val.pengeluaran >= 0 ? 'text-green' : 'text-red'}>Rp {(val.pemasukan - val.pengeluaran).toLocaleString('id-ID')}</td>
              </tr>
            ))}
            <tr style={{fontWeight:'bold', background:'#f5f5f5'}}>
              <td>TOTAL</td>
              <td>Rp {totalIn.toLocaleString('id-ID')}</td>
              <td>Rp {totalOut.toLocaleString('id-ID')}</td>
              <td className={totalIn - totalOut >= 0 ? 'text-green' : 'text-red'}>Rp {(totalIn - totalOut).toLocaleString('id-ID')}</td>
            </tr>
          </tbody>
        </table>
      </div></div>
    </div>
  );
}
