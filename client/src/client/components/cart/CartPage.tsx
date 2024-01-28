import React, { useEffect, useState } from 'react'
import Container from '../../../components/container/Container'
import { useCartContext } from '../../context/CartContext'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import axios from 'axios';
import { useNavigate } from 'react-router';
import CenterTooltip from '../home/CenterTooltip';
import ClickListener from './ClickListener';
import Input from '../../../components/Input';
import CostBreakdown from '../store/CostBreakdown';

interface Address {
    lat: number,
    lng: number
}

export default function CartPage() {
    const { store, items, setItems, setStore } = useCartContext();
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined)
    const [address, setAddress] = useState('')
    const [delivery, setDelivery] = useState(0)
    const navigate = useNavigate();
    useEffect(() => {
        if (!selectedAddress?.lat || !selectedAddress.lng || !store?.id) {
            return;
        }
        axios.get('/api/travel-time', {
            params: {
                lat: selectedAddress.lat,
                lng: selectedAddress.lng,
                store_id: store.id
            }
        })
            .then(res => {
                setDelivery(res.data.distance.value * 0.06)
            })
    }, [selectedAddress?.lat, selectedAddress?.lng, store?.id])

    if (!store) {
        navigate('/')
        return null;
    }
    const center = {
        lat: Number(store.lat),
        lng: Number(store.lng)
    }
    return (
        <div className='cart-page'>
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} className='map'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center} key={store.id}>
                    <Popup>{'Store: ' + store.name}</Popup>
                </Marker>
                <ClickListener
                    onClick={(lat, lng) => {
                        setSelectedAddress({ lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) })
                    }}
                />
                {
                    selectedAddress && (
                        <CenterTooltip lat={(selectedAddress.lat + center.lat) / 2} lng={(selectedAddress.lng + center.lng) / 2} />
                    )
                }
                {
                    selectedAddress && (
                        <Marker position={selectedAddress}>
                            <Popup>Your location</Popup>
                        </Marker>
                    )
                }
            </MapContainer>
            <Container header='Choose your location'>
                <Input label='Enter your address' value={address} onChange={setAddress} />
                <div className='pt-3 pb-3'>
                    <CostBreakdown delivery={delivery} />
                </div>
                <button onClick={async () => {
                    await axios.post('/api/orders', {
                        lat: selectedAddress?.lat,
                        lng: selectedAddress?.lng,
                        address,
                        items
                    })
                    setItems([]);
                    setStore(undefined);
                    navigate('/')
                }} className='btn btn-primary form-control mt-2 mb-4' disabled={address.length < 5 || !selectedAddress}>Place your order</button>
            </Container>
        </div>
    )
}
