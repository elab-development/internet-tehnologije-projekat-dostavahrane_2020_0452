import React, { useEffect, useState } from 'react'
import Container from '../../components/container/Container'
import Input from '../../components/Input';
import axios from 'axios';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


interface StatisticsItem {
    store_id: number,
    name: string,
    total: number,
}

export default function StatisticsPage() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('')
    const [statistics, setStatistics] = useState([] as StatisticsItem[]);
    useEffect(() => {
        axios.get('/api/orders/statistics', {
            params: {
                from, to
            }
        })
            .then(res => setStatistics(res.data))
            .catch(() => setStatistics([]))
    }, [from, to])
    return (
        <Container header='Store statistics'>
            <div className='flex'>
                <div>
                    <Input label='From' type='date' value={from} onChange={setFrom} />
                </div>
                <div>
                    <Input label='To' type='date' value={to} onChange={setTo} />
                </div>
            </div>
            <div className='mt-3'>
                <ResponsiveContainer width="100%" aspect={2}>
                    <BarChart
                        data={statistics}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Container>
    )
}
