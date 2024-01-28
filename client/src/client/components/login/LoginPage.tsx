import React, { useState } from 'react'
import Input from '../../../components/Input'
import { useUserContext } from '../../../context/UserContext'
import { useNavigate } from 'react-router'
import Container from '../../../components/container/Container'

export default function LoginPage() {
    const { login } = useUserContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    return (
        <Container header='Login'>
            <form onSubmit={async e => {
                e.preventDefault();
                await login(email, password);
                navigate('/')
            }} >
                <Input
                    label='Email'
                    onChange={setEmail}
                    value={email}
                    required
                    type='email'
                />
                <Input
                    label='Password'
                    onChange={setPassword}
                    value={password}
                    required
                    type='password'
                />
                <button className='form-control btn btn-primary mt-3'>Login</button>
            </form>
        </Container>
    )
}
