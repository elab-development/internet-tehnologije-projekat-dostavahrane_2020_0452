import React from 'react'
import { Item } from '../../../types'
import { useCartContext } from '../../context/CartContext';

interface Props {
    item: Item;
}

export default function StoreItem(props: Props) {
    const { items, setItems } = useCartContext();
    return (
        <div className='store-item'>
            <div className='image' style={{
                backgroundImage: `url('${props.item.image}')`
            }}>
            </div>
            <div className='content'>
                <div>
                    <h6>{props.item.name}</h6>
                    <h6 className='pt-1'>{props.item.price + ' RSD'}</h6>
                </div>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <button type="button" className="btn btn-danger"
                        onClick={() => {
                            setItems((prev: any[]) => {
                                return prev.map(element => {
                                    if (element.itemId !== props.item.id) {
                                        return element;
                                    }
                                    return {
                                        ...element,
                                        count: element.count - 1
                                    }
                                })
                            })
                        }}
                        disabled={props.item.disabled || !items.find(item => item.itemId == props.item.id)}
                    >-</button>
                    <button onClick={() => {
                        setItems((prev: any[]) => {
                            if (!prev.find(item => item.itemId === props.item.id)) {
                                return [...prev, { itemId: props.item.id, count: 1 }]
                            }
                            return prev.map(element => {
                                if (element.itemId !== props.item.id) {
                                    return element;
                                }
                                return {
                                    ...element,
                                    count: element.count + 1
                                }
                            })
                        })
                    }} type="button" className="btn btn-success" disabled={props.item.disabled}>+</button>
                </div>
            </div>
        </div>
    )
}
