import React from 'react'
import { Routes, Route } from 'react-router'
import Navbar from './components/navbar/Navbar'
import OrdersPage from './pages/OrdersPage'
import StoresPage from './pages/StoresPage'
import ItemsPage from './pages/ItemsPage'
import StatisticsPage from './pages/StatisticsPage'
import CreateStorePage from './pages/CreateStorePage'

export default function AdminApp() {
    return (
        <div className='main'>
            <Navbar />
            <Routes>
                <Route path='*' element={<OrdersPage />} />
                <Route path='/stores' element={<StoresPage />} />
                <Route path='/create-store' element={<CreateStorePage />} />
                <Route path='/stores/:id' element={<ItemsPage />} />
                <Route path='/statistics' element={<StatisticsPage />} />
            </Routes>
        </div>
    )
}
