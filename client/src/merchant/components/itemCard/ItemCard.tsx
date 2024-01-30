import React from 'react'
import { Item } from '../../../types'


interface Props {
    item: Item,
    onClickDisable: () => Promise<void>
}

export default function ItemCard(props: Props) {
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
                <div className="btn-group" role="group" >
                    <button className='btn btn-primary form-control' onClick={props.onClickDisable}>{props.item.disabled ? 'Disabled' : 'Enabled'}</button>
                </div>
            </div>
        </div>
    )
}
