import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Store } from '../../../types';
import axios from 'axios';
import Container from '../../../components/container/Container';
import { MapContainer, TileLayer, Marker, } from 'react-leaflet';
import CenterTooltip from '../home/CenterTooltip';
import StoreItem from './StoreItem';
import { useCartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import CostBreakdown from './CostBreakdown';
import { useUserContext } from '../../../context/UserContext';

export default function StorePage() {
    const id = useParams().id;
    const [store, setStore] = useState<Store | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const { setStore: setCartStore, setItems, store: cartStore, items } = useCartContext();
    const navigate = useNavigate();
    const { user } = useUserContext();
    useEffect(() => {
        axios.get('/api/stores/' + id)
            .then(res => {
                setStore(res.data)
            })
            .catch(() => {

            })
            .finally(() => {
                setLoading(false);
            })
    }, [id])

    useEffect(() => {
        if (id == cartStore?.id || !store) {
            return;
        }
        setCartStore(store);
        setItems([]);
    }, [id, store])

    if (loading) {
        return (
            <Container>
                <div className="spinner-border" role="status">
                    <span className="sr-only"></span>
                </div>
            </Container>
        )
    }

    if (!store) {
        navigate('/');
        return null;
    }
    const center = {
        lat: store.lat,
        lng: store.lng
    }
    return (
        <Container header={store?.name} >
            <div className='row'>
                <div className='col-8 items'>
                    {
                        store.items.map(item => {
                            return (
                                <StoreItem key={item.id} item={item} />
                            )
                        })
                    }
                </div>
                <div className='col-4'>
                    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className='map'>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <CenterTooltip lat={center.lat} lng={center.lng} />
                        <Marker position={center} key={store.id}>

                        </Marker>
                    </MapContainer>
                    <div className='pt-2'>
                        <h4>Adress: <span>{store.address}</span></h4>
                    </div>
                    <CostBreakdown />
                    {
                        user && items.length > 0 && (<Link to='/cart'>
                            <button className='mt-3 btn order-button form-control'>Order</button>
                        </Link>
                        )
                    }
                </div>
            </div>
        </Container>
    )
}
