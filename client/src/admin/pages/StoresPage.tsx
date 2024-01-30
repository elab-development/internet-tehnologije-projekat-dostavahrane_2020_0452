import React, { useEffect, useState } from 'react'
import Container from '../../components/container/Container'
import { Store } from '../../types'
import axios from 'axios'
import StoreForm from '../components/StoreForm'

export default function StoresPage() {
    const [stores, setStores] = useState<Store[]>([])
    const [selectedStore, setSelectedStore] = useState<Store | undefined>(undefined);
    useEffect(() => {
        axios.get('/api/stores')
            .then(res => {
                setStores(res.data);
            })
    }, [])

    return (
        <Container header='Stores'>
            <div className='row'>
                <div className='col-7'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Lat</th>
                                <th>Lng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                stores.map(store => {
                                    return (
                                        <tr className={store === selectedStore ? "table-secondary" : ''} key={store.id}
                                            onClick={() => {
                                                setSelectedStore(prev => prev === store ? undefined : store)
                                            }}
                                        >
                                            <td>{store.id}</td>
                                            <td>{store.name}</td>
                                            <td>{store.address}</td>
                                            <td>{store.lat}</td>
                                            <td>{store.lng}</td>

                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='col-5'>
                    {
                        selectedStore && (
                            <>
                                <StoreForm
                                    store={selectedStore}
                                    onSubmit={async val => {
                                        const res = await axios.put('/api/stores/' + selectedStore.id, val);
                                        setStores(prev => {
                                            return prev.map(s => {
                                                if (s === selectedStore) {
                                                    return res.data;
                                                }
                                                return s;
                                            })
                                        })
                                    }}
                                />
                                <button className='btn btn-danger form-control mt-2' onClick={async () => {
                                    await axios.delete('/api/stores/' + selectedStore.id);
                                    setStores(prev => prev.filter(s => s !== selectedStore));
                                    setSelectedStore(undefined);
                                }}>Delete</button>
                            </>
                        )
                    }
                </div>
            </div>
        </Container>
    )
}
