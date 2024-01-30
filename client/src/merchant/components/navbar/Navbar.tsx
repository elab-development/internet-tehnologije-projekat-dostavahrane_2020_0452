import React from 'react'
import Logo from '../../../components/logo/Logo'
import { useUserContext } from '../../../context/UserContext'
import { NavLink } from 'react-router-dom';
import UserInfo from '../../../components/userInfo/UserInfo';
import NavButton from '../../../components/navButton/NavButton';

export default function Navbar() {
    const { user } = useUserContext();
    return (
        <div className='navbar'>
            <NavLink style={{ height: '100%' }} to='/'>
                <Logo />
            </NavLink>

            <div className='content'>
                <div className='buttons'>

                    <NavButton>
                        <NavLink className='link' to='/login'>Active orders</NavLink>
                    </NavButton>
                    <NavButton>
                        <NavLink className='link' to='/register'>Order history</NavLink>
                    </NavButton>
                    <NavButton>
                        <NavLink className='link' to='/register'>Items</NavLink>
                    </NavButton>
                </div>
            </div>
            <UserInfo />
        </div>
    )
}
