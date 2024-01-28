import React from 'react'
import { useCartContext } from '../../context/CartContext'

interface Props {
    delivery?: number
}

export default function CostBreakdown(props: Props) {
    const { store, items } = useCartContext();
    if (!store) {
        return null;
    }
    return (
        <div>
            <h4>Cost breakdown</h4>
            <div className='items-summary'>
                {items.map(cartItem => {
                    const storeItem = store.items.find(i => i.id === cartItem.itemId)
                    return (
                        <div key={cartItem.itemId} >
                            <div>
                                {storeItem?.name || ''}
                            </div>
                            <div className='calc-row'>
                                <div>
                                    {`${cartItem.count} X ${storeItem?.price}`}
                                </div>
                                <div>
                                    {(cartItem.count * (storeItem?.price || 0)) + ' RSD'}
                                </div>
                            </div>
                        </div>
                    )
                })}
                {
                    (props.delivery !== undefined && props.delivery > 0) && (
                        <div key='delivery' >
                            <div>
                                Delivery
                            </div>
                            <div className='calc-row'>
                                <div>

                                </div>
                                <div>
                                    {props.delivery.toFixed(2) + ' RSD'}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div className='total'>
                <div>
                    Total
                </div>
                <div>
                    {(props.delivery || 0) + items.reduce((acc, cartItem) => {
                        return acc + cartItem.count * (store.items.find(i => i.id === cartItem.itemId)?.price || 0);
                    }, 0) + ' RSD'}
                </div>
            </div>
        </div>
    )
}
