import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

export default function HomePage() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    api.get(`/reports/monthly-detail?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
      .then(res => {
        const inc = (res.data.income_details || []).reduce((s, i) => s + Number(i.jumlah_bayar), 0);
        const exp = (res.data.expense_details || []).reduce((s, i) => s + Number(i.jumlah), 0);
        setIncome(inc);
        setExpense(exp);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="welcome-section">
        <h1>Selamat Datang ADMIN RT di SISTEM IURAN RT</h1>
        <p className="time">{time}</p>
        <p className="date">{date}</p>
      </div>
      <div className="card">
        <div className="card-header"><h2 className="m-0 text-base text-blue-500 font-semibold">Ringkasan Keuangan (Bulan Ini)</h2></div>
        <div className="card-body summary-body">
          <div className="summary-item text-green"><h3>Pemasukan</h3><p>{formatCurrency(income)}</p></div>
          <div className="summary-item text-red"><h3>Pengeluaran</h3><p>{formatCurrency(expense)}</p></div>
          <div className="summary-item text-blue"><h3>Saldo</h3><p>{formatCurrency(income - expense)}</p></div>
        </div>
      </div>
    </div>
  );
}
