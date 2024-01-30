import React, { useEffect, useState } from 'react'
import { Order } from '../../types'
import axios from 'axios'
import OrdersTable from '../components/OrdersTable';
import Input from '../../components/Input';

export default function ActiveOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const pending = orders.filter(o => o.status === 'pending');
    const accepted = orders.filter(o => o.status === 'accepted');
    const [prepTime, setPrepTime] = useState('');
    const [selectedPending, setSelectedPending] = useState(true);
    useEffect(() => {
        axios.get('/api/active-orders')
            .then(res => {
                setOrders(res.data);
            })
    }, [])
    useEffect(() => {
        const ref = setInterval(() => {
            axios.get('/api/active-orders')
                .then(res => {
                    setOrders(res.data);
                })

        }, 5000);
        return () => {
            clearInterval(ref);
        }
    }, [])

    return (
        <div className='px-3'>
            <div className='d-flex justify-content-center my-2'>
                <div className='btn-group '>
                    <button className={`btn ${selectedPending ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedPending(true)}>Pending</button>
                    <button className={`btn ${!selectedPending ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedPending(false)}>Accepted</button>
                </div>
            </div>
            <div className='row'>
                {
                    selectedPending && (
                        <>
                            <Input placeholder='Prep time...' value={prepTime} onChange={setPrepTime} />
                            <OrdersTable actions={[
                                {
                                    name: 'Accept',
                                    onClick: async (order) => {
                                        const res = await axios.put('/api/orders/' + order.id + '/accept', {
                                            prepTime: Number(prepTime)
                                        });
                                        setOrders(prev => {
                                            return prev.map(ord => {
                                                if (ord === order) {
                                                    return res.data;
                                                }
                                                return ord;
                                            })
                                        })
                                    }
                                },
                                {
                                    name: 'Reject',
                                    onClick: async (order) => {
                                        const res = await axios.put('/api/orders/' + order.id + '/reject');
                                        setOrders(prev => {
                                            return prev.filter(o => o !== order);
                                        })
                                    }
                                }
                            ]} orders={pending} />
                        </>
                    )
                }
                {
                    !selectedPending && (
                        <OrdersTable actions={[{
                            name: 'Finish',
                            onClick: async (order) => {
                                const res = await axios.put('/api/orders/' + order.id + '/prepare');
                                setOrders(prev => {
                                    return prev.filter(o => o !== order);
                                })
                            }
                        }]} orders={accepted} />

                    )
                }
            </div>
        </div>
    )
}
