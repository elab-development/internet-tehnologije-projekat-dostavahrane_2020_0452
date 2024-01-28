import React from 'react'
import Navbar from './components/navbar/Navbar'
import { Route, Routes } from 'react-router'
import { useUserContext } from '../context/UserContext'
import LoginPage from './components/login/LoginPage';
import RegisterPage from './components/register/RegisterPage';
import HomePage from './components/home/HomePage';
import StorePage from './components/store/StorePage';
import { CartContextProvider } from './context/CartContext';
import CartPage from './components/cart/CartPage';
import OrdersPage from './components/orders/OrdersPage';

export default function ClientApp() {
    const { user } = useUserContext();
    return (
        <CartContextProvider>
            <div className='main'>
                <Navbar />
                <Routes>
                    {
                        !user ? (
                            <>
                                <Route path='/login' element={<LoginPage />} />
                                <Route path='/register' element={<RegisterPage />} />
                            </>
                        ) : (
                            <>
                                <Route path='/cart' element={<CartPage />} />
                                <Route path='/orders' element={<OrdersPage />} />
                            </>
                        )
                    }
                    <Route path='/store/:id' element={<StorePage />} />
                    <Route path='/' element={<HomePage />} />
                </Routes>
            </div>
        </CartContextProvider>
    )
}
