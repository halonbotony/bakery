import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './assets/css/style.css';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import StaffDashboard from './pages/Staff.tsx';
import POS from './pages/PosSystem.tsx';
import ManageInventory from './pages/ManageInventory.tsx';
import ExpiringSoon from './pages/ExpiringSoon.tsx';
import SalesReport from './pages/SalesReport.tsx';
import PaymentMethod from './pages/PaymentMethod.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/manage-invetory" element={<ManageInventory />} />
        <Route path="/expiring-soon" element={<ExpiringSoon />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
