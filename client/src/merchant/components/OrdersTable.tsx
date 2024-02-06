import React from 'react'
import { Order } from '../../types'
import { format } from 'date-fns';

interface Props {
    orders: Order[],
    actions: {
        name: string,
        onClick: (order: Order) => Promise<void>
    }[]
}

export default function OrdersTable(props: Props) {
    if (props.orders.length === 0) {
        return null;
    }
    return (
        <table className='table'>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Created at</th>
                    <th>Store</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Items</th>
                    <th>Delivery</th>
                    <th>Total</th>
                    {
                        props.actions.length > 0 && (
                            <th>Actions</th>
                        )
                    }
                </tr>
            </thead>
            <tbody>
                {
                    props.orders.map(order => {
                        const itemPrice = (order.items || []).reduce((acc, item) => {
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
                                {
                                    props.actions.length > 0 && (
                                        <td>
                                            <div className='btn-group'>
                                                {
                                                    props.actions.map(ac => {
                                                        return (
                                                            <button className='btn btn-primary' onClick={() => {
                                                                ac.onClick(order);
                                                            }} key={ac.name}>{ac.name}</button>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </td>
                                    )
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
