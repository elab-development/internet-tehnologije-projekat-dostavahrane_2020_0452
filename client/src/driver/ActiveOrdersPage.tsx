import React, { useEffect, useState } from 'react'
import { DriverStatus, Order } from '../types';
import axios from 'axios';
import OrdersTable from '../merchant/components/OrdersTable';

const statusMap = {
    'assigned': 'assign',
    'picked_up': 'pick-up',
    'delivered': 'deliver'
}

export default function ActiveOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedTab, setSelectedTab] = useState<'free' | 'assigned' | 'pickedUp'>('free');
    const free = orders.filter(o => !o.driver);
    const assigned = orders.filter(o => o.driverStatus === 'assigned');
    const pickedUp = orders.filter(o => o.driverStatus === 'picked_up');

    const changeStatus = (status: DriverStatus) => async (order: Order) => {
        const res = await axios.put('/api/orders/' + order.id + '/' + statusMap[status]);
        setOrders(prev => {
            return prev.map(o => {
                if (o === order) {
                    return res.data;
                }
                return 0;
            })
        })
    }

    useEffect(() => {
        axios.get('/api/active-orders')
            .then(res => {
                setOrders(res.data);
            })
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
        <div className='px-5'>
            <div className='d-flex justify-content-center my-2'>
                <div className='btn-group '>
                    <button className={`btn ${selectedTab === 'free' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedTab('free')}>
                        Pending({free.length})
                    </button>
                    <button className={`btn ${selectedTab === 'assigned' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedTab('assigned')}>
                        Assigned({assigned.length})
                    </button>
                    <button className={`btn ${selectedTab === 'pickedUp' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedTab('pickedUp')}>
                        Picked up({pickedUp.length})
                    </button>
                </div>
            </div>
            {
                selectedTab === 'free' && (
                    <OrdersTable actions={[
                        {
                            name: 'Assign',
                            onClick: changeStatus('assigned')
                        }
                    ]} orders={free} />
                )
            }
            {
                selectedTab === 'assigned' && (
                    <OrdersTable actions={[
                        {
                            name: 'Pick up',
                            onClick: changeStatus('picked_up')
                        }
                    ]} orders={assigned} />
                )
            }
            {
                selectedTab === 'pickedUp' && (
                    <OrdersTable actions={[
                        {
                            name: 'Pick up',
                            onClick: changeStatus('delivered')
                        }
                    ]} orders={pickedUp} />
                )
            }
        </div>
    )
}
