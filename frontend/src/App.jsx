import './App.css';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Orders from './pages/orders/Orders';
import Holdings from './pages/holdings/Holdings';
import Positions from './pages/positions/Positions';

import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';

import Chart from './components/chart/Chart';
import AuthProvider from './context/AuthContext';
import WatchlistProvider from './context/WatchlistContext';
import CryptoAPIProvider from './context/CryptoAPIContext';
import WalletProvider from './context/WalletContext';
import OrderPanel from './components/orderPanel/OrderPanel';
import OrdersProvider from './context/OrdersContext';

function App() {
  
  return (
    <CryptoAPIProvider>
    <WatchlistProvider>
    <AuthProvider>
    <WalletProvider>
    <OrdersProvider>
    <Routes>
      <Route path='/' element={<Layout />} >
      <Route index element={<Dashboard />} />
      <Route path='orders' element={<Orders />} />
      <Route path='holdings' element={<Holdings />} />
      <Route path='positions' element={<Positions />} />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='chart' element={<Chart />} />
      <Route path='order' element={<OrderPanel />} />
      </Route>
    </Routes>
    </OrdersProvider>
    </WalletProvider>
    </AuthProvider>
    </WatchlistProvider>
    </CryptoAPIProvider>
  )
}

export default App
