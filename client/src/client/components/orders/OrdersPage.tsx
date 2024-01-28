import React, { useEffect, useState } from 'react'
import { Order, Pagination } from '../../../types';
import { MapContainer, TileLayer, Marker, Popup, } from 'react-leaflet';
import CenterTooltip from '../home/CenterTooltip';
import axios from 'axios';
import { format } from 'date-fns'
import PaginationComponent from '../../../components/Pagination';
const center = {
    lat: 44.81985,
    lng: 20.46422
}
export default function OrdersPage() {
    const [orders, setOrders] = useState<Pagination<Order> | undefined>(undefined);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
    const [filters, setFilters] = useState({ page: 0, size: 20 })

    useEffect(() => {
        axios.get('/api/orders', {
            params: filters
        }).then(res => {
            setOrders(res.data)
        })
    }, [filters])

    return (
        <div className='orders-page' >
            <h2>Orders</h2>
            <div className='row'>
                <div className='col-7'>
                    {
                        orders && orders.data.length > 0 && (
                            <>
                                <table className='table'>
                                    <thead>
                                        <th>Order ID</th>
                                        <th>Created at</th>
                                        <th>Store</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Rating</th>
                                        <th>Items</th>
                                        <th>Delivery</th>
                                        <th>Total</th>
                                    </thead>
                                    <tbody>
                                        {
                                            (orders?.data || []).map(order => {
                                                const itemPrice = order.items.reduce((acc, item) => {
                                                    return acc + Number(item.count) * Number(item.price)
                                                }, 0)
                                                return (
                                                    <tr className='order-row' onClick={() => {
                                                        setSelectedOrder(order);
                                                    }} key={order.id}>
                                                        <td>{order.id}</td>
                                                        <td>{format(new Date(order.createdAt), 'HH:mm dd.MM.yyyy')}</td>
                                                        <td>{order.store.name}</td>
                                                        <td>{order.address}</td>
                                                        <td>{order.driverStatus || order.status}</td>
                                                        <td>{order.rating || '/'}</td>
                                                        <td>{itemPrice}</td>
                                                        <td>{order.deliveryPrice}</td>
                                                        <td>{itemPrice + Number(order.deliveryPrice)}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className='pt-3'>
                                    <PaginationComponent
                                        totalElements={orders.total || 0}
                                        size={filters.size}
                                        page={filters.page}
                                        onPageChange={val => {
                                            setFilters(prev => {
                                                return {
                                                    ...prev,
                                                    page: val
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </>
                        )
                    }
                </div>
                <div className='col-5'>
                    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className='map'>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <CenterTooltip
                            lat={selectedOrder ? (Number(selectedOrder?.lat) + Number(selectedOrder?.store.lat)) / 2 : center.lat}
                            lng={selectedOrder ? (Number(selectedOrder?.lng) + Number(selectedOrder?.store.lng)) / 2 : center.lng}
                        />
                        {selectedOrder && (
                            <>
                                <Marker position={selectedOrder.store} >
                                    <Popup>
                                        {selectedOrder.store.name}
                                    </Popup>
                                </Marker>
                                <Marker position={selectedOrder} >
                                    <Popup>
                                        {selectedOrder.address}
                                    </Popup>
                                </Marker>
                            </>
                        )}
                    </MapContainer>
                    {
                        selectedOrder && (
                            <div>
                                <h4 className='pt-2'>Order info</h4>
                                <div>
                                    Id: <span className='pl-1'>{selectedOrder.id}</span>
                                </div>
                                <div>
                                    Address: <span className='pl-1'>{selectedOrder.address}</span>
                                </div>
                                <div>
                                    Store: <span className='pl-1'>{selectedOrder.store.name}</span>
                                </div>
                                <h4 className='pt-2'>Cost breakdown</h4>
                                <div className='items-summary'>
                                    {
                                        selectedOrder.items.map(item => {
                                            return (
                                                <div key={item.id} >
                                                    <div>
                                                        {selectedOrder.store.name}
                                                    </div>
                                                    <div className='calc-row'>
                                                        <div>
                                                            {`${item.count} X ${item.price}`}
                                                        </div>
                                                        <div>
                                                            {(item.count * (item?.price || 0)) + ' RSD'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    <div key='delivery' >
                                        <div>
                                            Delivery
                                        </div>
                                        <div className='calc-row'>
                                            <div>

                                            </div>
                                            <div>
                                                {selectedOrder.deliveryPrice + ' RSD'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='total'>
                                    <div>
                                        Total
                                    </div>
                                    <div>
                                        {Number(selectedOrder.deliveryPrice) + selectedOrder.items.reduce((acc, item) => {
                                            return acc + Number(item.count) * Number(item.price);
                                        }, 0) + ' RSD'}
                                    </div>
                                </div>

                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
