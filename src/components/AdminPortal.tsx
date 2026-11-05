import React, { useState, useEffect } from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { isGateSessionVerified } from '../lib/adminSecurity';
import { AdminSecurityGate } from './AdminSecurityGate';
import { AdminLoginScreen } from './AdminLoginScreen';
import { AdminDashboard } from './AdminDashboard';

export const AdminPortal: React.FC = () => {
  const { isAdminAuthenticated } = useWineStore();
  const [isGateVerified, setIsGateVerified] = useState<boolean>(() => isGateSessionVerified());

  // Periodically check gate session validity
  useEffect(() => {
    const checkStatus = () => {
      setIsGateVerified(isGateSessionVerified());
    };
    window.addEventListener('storage', checkStatus);
    return () => window.removeEventListener('storage', checkStatus);
  }, []);

  // 1. Password-Protected Security Gate (Verified against secure env variable / constant)
  // Any attempt to render the admin panel requires this gate to pass first
  if (!isGateVerified) {
    return <AdminSecurityGate onVerified={() => setIsGateVerified(true)} />;
  }

  // 2. Secondary Role Authentication Check
  if (!isAdminAuthenticated) {
    return <AdminLoginScreen />;
  }

  // 3. Authorized Admin Dashboard Render
  return <AdminDashboard />;
};
