import React from 'react'
import Navbar from './components/navbar/Navbar'
import { Route, Routes } from 'react-router'
import OrdersPage from '../merchant/pages/OrdersPage'
import ActiveOrdersPage from './ActiveOrdersPage'

export default function DriverApp() {
    return (
        <div className='main'>
            <Navbar />
            <Routes>
                <Route path='*' element={<ActiveOrdersPage />} />
                <Route path='orders' element={<OrdersPage />} />
            </Routes>
        </div>
    )
}
