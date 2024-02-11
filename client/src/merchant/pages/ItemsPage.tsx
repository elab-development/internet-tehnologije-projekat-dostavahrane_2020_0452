import React, { useState } from 'react'
import { useStoreContext } from '../context/StoreContext'
import Container from '../../components/container/Container';
import Input from '../../components/Input';
import ItemCard from '../components/itemCard/ItemCard';
import axios from 'axios';
import { mkConfig, generateCsv, download } from 'export-to-csv';

export default function ItemsPage() {
    const { store, updateItem } = useStoreContext();
    const [search, setSearch] = useState('')
    return (
        <Container header='Items'>
            <div className='my-2'>
                <Input placeholder='Search...' value={search} onChange={setSearch} />
            </div>
            <div>
                <button className='btn btn-success m-2' onClick={() => {
                    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: 'items', fieldSeparator: ';' })
                    const csv = generateCsv(csvConfig)(store.items.map(item => {
                        return {
                            ...item,
                            store: store.name
                        }
                    }) as any);
                    download(csvConfig)(csv)
                }}> Export items</button>
            </div>
            <div className='flex'>
                {
                    store.items
                        .filter(item => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                        .map(item => {
                            return (
                                <ItemCard item={item}
                                    onClickDisable={async () => {
                                        const res = await axios.put('/api/items/' + item.id, { disabled: !item.disabled });
                                        updateItem(item.id, res.data);
                                    }}
                                />
                            )
                        })
                }
            </div>
        </Container>
    )
}
