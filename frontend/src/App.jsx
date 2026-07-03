import './App.css';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Orders from './pages/orders/Orders';
import Holdings from './pages/holdings/Holdings';
import Positions from './pages/positions/Positions';

function App() {
  
  return (
    <Routes>
      <Route path='/' element={<Layout />} >
      <Route index element={<Dashboard />} />
      <Route path='orders' element={<Orders />} />
      <Route path='holdings' element={<Holdings />} />
      <Route path='positions' element={<Positions />} />
      </Route>
    </Routes>
  )
}

export default App
