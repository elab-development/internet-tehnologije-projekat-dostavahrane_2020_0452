import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../../types';
import axios from 'axios';

interface StoreContextType {
    store: Store,
}

const StoreContext = React.createContext<StoreContextType | null>(null);

export function useStoreContext() {
    const c = useContext(StoreContext);
    if (!c) {
        throw new Error('Missing context');
    }
    return c.store;
}

export function StoreContextProvider(props: React.PropsWithChildren) {
    const [store, setStore] = useState<Store | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        axios.get('/api/merchant-store')
            .then(res => {
                setStore(res.data)
            })
            .catch(() => {
                setStore(undefined);
            })
            .finally(() => {
                setLoading(false);
            })
    }, [])
    if (loading) {
        return null;
    }
    if (!store) {
        return (
            <div>
                Missing store
            </div>
        )
    }
    return (
        <StoreContext.Provider
            value={{
                store
            }}
        >
            {props.children}
        </StoreContext.Provider>
    )
}