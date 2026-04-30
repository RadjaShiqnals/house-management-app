import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ResidentListPage from './pages/residents/ResidentListPage';
import ResidentFormPage from './pages/residents/ResidentFormPage';
import ResidentDetailPage from './pages/residents/ResidentDetailPage';
import HouseListPage from './pages/houses/HouseListPage';
import HouseFormPage from './pages/houses/HouseFormPage';
import HouseDetailPage from './pages/houses/HouseDetailPage';
import BillListPage from './pages/bills/BillListPage';
import BillFormPage from './pages/bills/BillFormPage';
import ExpenseListPage from './pages/expenses/ExpenseListPage';
import ReportPage from './pages/reports/ReportPage';
import NotFoundPage from './pages/errors/NotFoundPage';
import ServerErrorPage from './pages/errors/ServerErrorPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="residents" element={<ResidentListPage />} />
          <Route path="residents/create" element={<ResidentFormPage />} />
          <Route path="residents/:id/edit" element={<ResidentFormPage />} />
          <Route path="residents/:id" element={<ResidentDetailPage />} />
          <Route path="houses" element={<HouseListPage />} />
          <Route path="houses/create" element={<HouseFormPage />} />
          <Route path="houses/:id/edit" element={<HouseFormPage />} />
          <Route path="houses/:id" element={<HouseDetailPage />} />
          <Route path="bills" element={<BillListPage />} />
          <Route path="bills/create" element={<BillFormPage />} />
          <Route path="expenses" element={<ExpenseListPage />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
