import React, { useEffect, useState } from 'react'
import Input from '../../../components/Input'
import { Store } from '../../../types'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CenterTooltip from './CenterTooltip';

export default function HomePage() {
    const [search, setSearch] = useState('')
    const [stores, setStores] = useState<Store[]>([]);
    const [center, setCenter] = useState({
        lat: 44.81985,
        lng: 20.46422
    })

    useEffect(() => {
        axios.get('/api/stores').then(res => {
            setStores(res.data);
        })
    }, [])

    return (
        <div className='home-page'>
            <div className='list'>
                <Input placeholder='Search' onChange={setSearch} value={search} />
                {
                    stores
                        .filter(store => {
                            return store.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
                                store.address.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                        })
                        .map(store => {
                            return (
                                <div onClick={() => {
                                    setCenter({ lat: store.lat, lng: store.lng })
                                }} className='store' key={store.id}>
                                    <div>
                                        <div>
                                            {store.name}
                                        </div>
                                        <div>
                                            {store.address}
                                        </div>
                                    </div>
                                    <NavLink to={'/store/' + store.id}>
                                        <button className='btn btn'>
                                            Open
                                        </button>
                                    </NavLink>
                                </div>
                            )
                        })
                }
            </div>
            <div className='map-container'>
                <MapContainer center={center} zoom={13} scrollWheelZoom={false} className='map'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CenterTooltip lat={center.lat} lng={center.lng} />
                    {
                        stores.map(store => {
                            return (
                                <Marker position={{ lat: store.lat, lng: store.lng }} key={store.id}>
                                    <Popup>
                                        <NavLink className='link' to={'/store/' + store.id}>{store.name}</NavLink>
                                    </Popup>
                                </Marker>
                            )
                        })
                    }
                </MapContainer>
            </div>
        </div>
    )
}
