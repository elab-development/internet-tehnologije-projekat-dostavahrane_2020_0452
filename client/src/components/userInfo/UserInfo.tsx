import React from 'react'
import { useUserContext } from '../../context/UserContext'
import NavButton from '../navButton/NavButton';
export default function UserInfo() {
    const { user, logout } = useUserContext();
    return (
        <div className='user-info'>
            <div className='info'>
                {user?.name || ''}
            </div>
            <NavButton onClick={logout}>
                Logout
            </NavButton>
        </div>
    )
}
