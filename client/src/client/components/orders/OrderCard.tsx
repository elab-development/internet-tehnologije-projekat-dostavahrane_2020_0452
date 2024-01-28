import React from 'react'
import { Order } from '../../../types'
import { MapContainer, TileLayer, Marker, Popup, } from 'react-leaflet';
interface Props {
    order: Order;
}

export default function OrderCard(props: Props) {
    const center = {
        lat: (Number(props.order.lat) + Number(props.order.store.lat)) / 2,
        lng: (Number(props.order.lng) + Number(props.order.store.lng)) / 2
    }
    return (
        <div className='order-card'>
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} className='map'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={props.order.store} >
                    <Popup>
                        {props.order.store.name}
                    </Popup>
                </Marker>
                <Marker position={props.order} >
                    <Popup>
                        {props.order.address}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
