import React from 'react'
import { StoreContextProvider } from './context/StoreContext'
import Navbar from './components/navbar/Navbar'

export default function MerchantApp() {
    return (
        <StoreContextProvider>
            <div className='main'>
                <Navbar />
            </div>
        </StoreContextProvider>
    )
}
