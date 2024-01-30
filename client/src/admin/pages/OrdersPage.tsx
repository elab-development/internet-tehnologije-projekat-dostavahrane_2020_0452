import React, { useEffect, useState } from 'react'
import Container from '../../components/container/Container'
import OrdersTable from '../../merchant/components/OrdersTable'
import axios from 'axios';
import { Pagination, Order } from '../../types';
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

            <OrdersTable
                actions={[]}
                orders={orders?.data || []}
            />
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
