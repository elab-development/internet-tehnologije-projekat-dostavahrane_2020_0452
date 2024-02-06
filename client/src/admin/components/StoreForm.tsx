import React, { useEffect, useState } from 'react'
import { Store } from '../../types'
import Input from '../../components/Input';


interface Props {
    store: Store,
    onSubmit: (val: any) => void,
}

export default function StoreForm(props: Props) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    useEffect(() => {
        setName(props.store.name);
        setAddress(props.store.address);
        setLat(props.store.lat + '')
        setLng(props.store.lng + '')
    }, [props.store]);

    return (
        <form onSubmit={e => {
            e.preventDefault();
            props.onSubmit({
                name,
                address,
                lat: Number(lat),
                lng: Number(lng)
            })
        }}>
            <Input label='Name' onChange={setName} value={name} required placeholder='Name...' />
            <Input label='Address' onChange={setAddress} value={address} required placeholder='Address...' />
            <Input label='Lat' onChange={setLat} value={lat} required placeholder='Lat...' type='number' />
            <Input label='Lng' onChange={setLng} value={lng} required placeholder='Lng...' type='number' />
            <button className='btn btn-primary form-control mt-2'>Update </button>
        </form>
    )
}
