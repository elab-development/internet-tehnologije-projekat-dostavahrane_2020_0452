import React, { useEffect, useState } from 'react'
import Container from '../../components/container/Container'
import { useParams } from 'react-router'
import { Item, Store } from '../../types';
import axios from 'axios';
import ItemForm from '../components/ItemForm';
import { download, generateCsv, mkConfig } from 'export-to-csv';

export default function ItemsPage() {
    const id = useParams().id;
    const [store, setStore] = useState<Store | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
    useEffect(() => {
        setLoading(true)
        axios.get('/api/stores/' + id)
            .then(res => setStore(res.data))
            .catch(() => setStore(undefined))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return null;
    }
    if (!store) {
        return (
            <Container header='Invalid store id'>

            </Container>
        )
    }
    return (
        <Container header='Store items'>
            <div>
                <button className='btn btn-success m-2' onClick={() => {
                    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: 'items', fieldSeparator: ';' })
                    const csv = generateCsv(csvConfig)(store.items as any);
                    download(csvConfig)(csv)
                }}> Export items</button>
            </div>
            <div className='row'>
                <div className='col-6'>
                    <table className='table  table-hover'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Link</th>
                                <th>Disabled</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                store.items.map(item => {
                                    return (
                                        <tr className={item === selectedItem ? "table-secondary" : ''} key={item.id}
                                            onClick={() => {
                                                setSelectedItem(prev => prev === item ? undefined : item)
                                            }}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.price}</td>
                                            <td>
                                                <a href={item.image} target='_blank'>Link</a>
                                            </td>
                                            <td>{item.disabled ? 'Disabled' : 'Enabled'}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className='col-6'>
                    <ItemForm
                        item={selectedItem}
                        onSubmit={async val => {
                            if (selectedItem) {
                                const res = await axios.put('/api/items/' + id, {
                                    ...val,
                                    storeId: id
                                })
                                setStore(prev => {
                                    if (!prev) {
                                        return prev;
                                    }
                                    return {
                                        ...prev,
                                        items: prev.items.map(i => i === selectedItem ? res.data : i)
                                    }
                                })
                                setSelectedItem(undefined);
                                return;
                            }
                            const res = await axios.post('/api/items', {
                                ...val,
                                storeId: id
                            })
                            setStore(prev => {
                                if (!prev) {
                                    return prev;
                                }
                                return {
                                    ...prev,
                                    items: [...prev.items, res.data]
                                }
                            })
                        }}
                    />
                    {
                        selectedItem && (
                            <button className='mt-2 btn btn-danger form-control' onClick={async () => {
                                await axios.delete('/api/items/' + selectedItem.id);
                                setStore(prev => {
                                    if (!prev) {
                                        return prev;
                                    }
                                    return {
                                        ...prev,
                                        items: prev.items.filter(i => i !== selectedItem)
                                    }
                                })
                                setSelectedItem(undefined);
                            }}>Delete item</button>
                        )
                    }
                </div>
            </div>
        </Container>
    )
}
