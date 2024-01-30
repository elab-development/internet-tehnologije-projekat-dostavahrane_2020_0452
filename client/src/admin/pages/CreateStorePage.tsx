import React, { useState } from 'react'
import Container from '../../components/container/Container'
import Input from '../../components/Input';
import axios from 'axios';

export default function CreateStorePage() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('')
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [merchantEmail, setMerchantEmail] = useState('')
    const [merchantPassword, setMerchantPassword] = useState('');
    const [merchantPhone, setMerchantPhone] = useState('')
    const [message, setMessage] = useState('')
    return (
        <Container header='Create store'>
            {
                message && (
                    <div className='my-3'>
                        {message}
                    </div>
                )
            }
            <form onSubmit={async e => {
                e.preventDefault();
                try {
                    await axios.post('/api/stores', {
                        store: {
                            name,
                            address,
                            lat: Number(lat),
                            lng: Number(lng)
                        },
                        user: {
                            name: merchantName,
                            email: merchantEmail,
                            phone: merchantPhone,
                            password: merchantPassword
                        }
                    });
                    setMessage('Successfully created new restaurant');
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        setMessage(error.response?.data.message)
                    } else {
                        setMessage('There has been an error');
                    }
                }
            }} >
                <h5 className='text-center'>Store info</h5>
                <Input label='Name' onChange={setName} value={name} required placeholder='Name...' />
                <Input label='Address' onChange={setAddress} value={address} required placeholder='Address...' />
                <Input label='Lat' onChange={setLat} value={lat} required placeholder='Lat...' type='number' />
                <Input label='Lng' onChange={setLng} value={lng} required placeholder='Lng...' type='number' />
                <h5 className='text-center mt-4'>Merchant info</h5>
                <Input label='Name' onChange={setMerchantName} value={merchantName} required placeholder='Name...' />
                <Input label='Email' onChange={setMerchantEmail} value={merchantEmail} required placeholder='Email...' type='email' />
                <Input label='Phone number' onChange={setMerchantPhone} value={merchantPhone} required placeholder='Phone...' />
                <Input label='Password' onChange={setMerchantPassword} value={merchantPassword} required type='password' />
                <button className='btn btn-primary form-control mt-2'>Create </button>
            </form>
        </Container>
    )
}
