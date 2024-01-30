import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Pagination, Order } from '../../types';
import Container from '../../components/container/Container';
import { format } from 'date-fns';
import PaginationComponent from '../../components/Pagination';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Pagination<Order> | undefined>(undefined);
    const [filters, setFilters] = useState({ page: 0, size: 20 })

    useEffect(() => {
        axios.get('/api/orders', {
            params: filters
        }).then(res => {
            setOrders(res.data)
        })
    }, [filters])
    return (
        <Container header='Orders'>
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
                                <tr className='order-row' key={order.id}>
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
                    totalElements={orders?.total || 0}
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
        </Container>
    )
}
