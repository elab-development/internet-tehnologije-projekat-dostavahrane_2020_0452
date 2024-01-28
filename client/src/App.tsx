import React from 'react';
import './App.scss';
import { useUserContext } from './context/UserContext';
import ClientApp from './client/ClientApp';
import DriverApp from './driver/DriverApp';
import MerchantApp from './merchant/MerchantApp';
import AdminApp from './admin/AdminApp';

function App() {
  const { user } = useUserContext();
  if (user?.userType === 'admin') {
    return (
      <AdminApp />
    )
  }
  if (user?.userType === 'driver') {
    return (
      <DriverApp />
    )
  }
  if (user?.userType === 'merchant') {
    return (
      <MerchantApp />
    )
  }
  return <ClientApp />
}

export default App;
