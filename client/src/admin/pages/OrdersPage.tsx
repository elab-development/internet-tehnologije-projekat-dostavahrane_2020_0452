import React, { useEffect, useState } from 'react'
import Container from '../../components/container/Container'
import OrdersTable from '../../merchant/components/OrdersTable'
import axios from 'axios';
import { Pagination, Order, Store, User } from '../../types';
import PaginationComponent from '../../components/Pagination';
import Input from '../../components/Input';
import Select from '../../components/Select';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Pagination<Order> | undefined>(undefined);
    const [filters, setFilters] = useState({
        page: 0,
        size: 20,
        from: '',
        to: '',
        driverId: 0,
        clientId: 0,
        storeId: 0
    })
    const [stores, setStores] = useState<Store[]>([]);
    const [drivers, setDrivers] = useState<User[]>([]);
    const [clients, setClients] = useState<User[]>([])


    useEffect(() => {
        axios.get('/api/stores')
            .then(res => {
                setStores(res.data)
            })
        axios.get('/api/drivers')
            .then(res => {
                setDrivers(res.data)
            })
        axios.get('/api/clients')
            .then(res => {
                setClients(res.data)
            })
    }, [])

    useEffect(() => {
        const params: any = {};
        if (filters.clientId) {
            params.clientId = filters.clientId
        }
        if (filters.driverId) {
            params.driverId = filters.driverId
        }
        if (filters.storeId) {
            params.storeId = filters.storeId
        }
        if (filters.from) {
            params.from = filters.from
        }
        if (filters.to) {
            params.to = filters.to
        }
        axios.get('/api/orders', {
            params
        }).then(res => {
            setOrders(res.data)
        })
    }, [filters])

    const updateFilter = (name: (keyof typeof filters)) => (val: any) => {
        setFilters(prev => {
            return {
                ...prev,
                [name]: val
            }
        })
    }

    return (
        <Container header='Orders'>
            <div className='row'>
                <div className='col-4'>
                    <Input type='date' label='From' value={filters.from} onChange={updateFilter('from')} />
                    <Input type='date' label='To' value={filters.to} onChange={updateFilter('to')} />
                    <Select
                        label='Store'
                        value={filters.storeId}
                        onChange={updateFilter('storeId')}
                        options={stores.map(store => {
                            return {
                                value: store.id,
                                label: store.name
                            }
                        })}
                    />
                    <Select
                        label='Driver'
                        value={filters.driverId}
                        onChange={updateFilter('driverId')}
                        options={drivers.map(driver => {
                            return {
                                value: driver.id,
                                label: driver.name
                            }
                        })}
                    />
                    <Select
                        label='Client'
                        value={filters.clientId}
                        onChange={updateFilter('clientId')}
                        options={clients.map(client => {
                            return {
                                value: client.id,
                                label: client.name
                            }
                        })}
                    />
                </div>
                <div className='col-8'>
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
                </div>
            </div>
        </Container>
    )
}
