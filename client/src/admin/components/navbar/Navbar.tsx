import React from 'react'
import Logo from '../../../components/logo/Logo'
import { useUserContext } from '../../../context/UserContext'
import { NavLink } from 'react-router-dom';
import UserInfo from '../../../components/userInfo/UserInfo';
import NavButton from '../../../components/navButton/NavButton';

export default function Navbar() {
    return (
        <div className='navbar'>
            <NavLink style={{ height: '100%' }} to='/'>
                <Logo />
            </NavLink>

            <div className='content'>
                <div className='buttons'>

                    <NavButton>
                        <NavLink className='link' to='/'>Orders</NavLink>
                    </NavButton>
                    <NavButton>
                        <NavLink className='link' to='/stores'>Stores</NavLink>
                    </NavButton>
                    <NavButton>
                        <NavLink className='link' to='/create-store'>Create store</NavLink>
                    </NavButton>
                    <NavButton>
                        <NavLink className='link' to='/items'>Items</NavLink>
                    </NavButton>
                    <NavButton>
                        <NavLink className='link' to='/statistics'>Statistics</NavLink>
                    </NavButton>
                </div>
            </div>
            <UserInfo />
        </div>
    )
}
