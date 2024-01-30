import React from 'react'
import { StoreContextProvider } from './context/StoreContext'
import Navbar from './components/navbar/Navbar'
import { Route, Routes } from 'react-router'
import ItemsPage from './pages/ItemsPage'

export default function MerchantApp() {
    return (
        <StoreContextProvider>
            <div className='main'>
                <Navbar />
                <Routes>
                    <Route path='*' element={<div></div>} />
                    <Route path='orders' element={<div></div>} />
                    <Route path='items' element={<ItemsPage />} />
                </Routes>
            </div>
        </StoreContextProvider>
    )
}
