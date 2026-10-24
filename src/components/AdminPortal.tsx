import React from 'react';
import { useWineStore } from '../context/WineStoreContext';
import { AdminLoginScreen } from './AdminLoginScreen';
import { AdminDashboard } from './AdminDashboard';

export const AdminPortal: React.FC = () => {
  const { isAdminAuthenticated } = useWineStore();

  if (!isAdminAuthenticated) {
    return <AdminLoginScreen />;
  }

  return <AdminDashboard />;
};
