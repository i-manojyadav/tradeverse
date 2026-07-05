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

function App() {
  
  return (
    <AuthProvider>
    <Routes>
      <Route path='/' element={<Layout />} >
      <Route index element={<Dashboard />} />
      <Route path='orders' element={<Orders />} />
      <Route path='holdings' element={<Holdings />} />
      <Route path='positions' element={<Positions />} />
      <Route path='signin' element={<SignIn />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='chart' element={<Chart />} />
      </Route>
    </Routes>
    </AuthProvider>
  )
}

export default App
