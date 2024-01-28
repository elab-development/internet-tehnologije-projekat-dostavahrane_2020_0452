
import React, { useContext, useState } from 'react'
import { Store } from '../../types'

export interface ContextType {
    store?: Store;
    setStore: (s: Store | undefined) => void;
    items: { itemId: number, count: number }[],
    setItems: (val: any) => void
}

const CartContext = React.createContext(null as ContextType | null)

export const useCartContext = () => {
    const c = useContext(CartContext);
    if (!c) {
        throw new Error('Missing context');
    }
    return c;
}
interface Props {
    children: React.ReactNode;
}
export function CartContextProvider(props: Props) {
    const [store, setStore] = useState<Store | undefined>(undefined)
    const [items, setItems] = useState<{ itemId: number, count: number }[]>([])
    return (
        <CartContext.Provider value={{ items, setItems, store, setStore }}>
            {props.children}
        </CartContext.Provider>
    )
}
