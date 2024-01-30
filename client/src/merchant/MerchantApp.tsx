import React from 'react'
import { StoreContextProvider } from './context/StoreContext'
import Navbar from './components/navbar/Navbar'
import { Route, Routes } from 'react-router'
import ItemsPage from './pages/ItemsPage'
import OrdersPage from './pages/OrdersPage'
import ActiveOrdersPage from './pages/ActiveOrdersPage'

export default function MerchantApp() {
    return (
        <StoreContextProvider>
            <div className='main'>
                <Navbar />
                <Routes>
                    <Route path='*' element={<ActiveOrdersPage />} />
                    <Route path='orders' element={<OrdersPage />} />
                    <Route path='items' element={<ItemsPage />} />
                </Routes>
            </div>
        </StoreContextProvider>
    )
}
