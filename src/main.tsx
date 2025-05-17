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
import ProtectedRoute from '../src/Auth/ProtectedRoutes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <POS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-inventory"
          element={
            <ProtectedRoute>
              <ManageInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expiring-soon"
          element={
            <ProtectedRoute>
              <ExpiringSoon />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-report"
          element={
            <ProtectedRoute>
              <SalesReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);