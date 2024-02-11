import React, { useEffect, useState } from 'react'
import { Item } from '../../types'
import Input from '../../components/Input';
import axios from 'axios';

interface Props {
    item?: Item,
    onSubmit: (val: any) => void
}

export default function ItemForm(props: Props) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('')
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setName(props.item?.name || '');
        setImage(props.item?.image || '');
        setDisabled(props.item?.disabled || false);
        setPrice(props.item ? (props.item.price + '') : '')
    }, [props.item])

    return (
        <div>
            <h4 className='text-center'>{props.item ? 'Update item' : 'Create item'}</h4>
            <form onSubmit={e => {
                e.preventDefault();
                props.onSubmit({
                    name,
                    image,
                    disabled,
                    price: Number(price)
                })
            }}>
                <Input label='Name' placeholder='Name...' required value={name} onChange={setName} />
                <Input label='Price' placeholder='Price...' required value={price} onChange={setPrice} type='number' />
                <Input label='Image link' placeholder='Link...' required value={image} onChange={setImage} />
                <input type="file" className='mt-2' onChange={async e => {
                    const files = e.currentTarget.files;
                    if (!files || files.length === 0) {
                        return;
                    }
                    const file = files[0];
                    const fd = new FormData();
                    fd.set('file', file);
                    const res = await axios.post('/api/item-upload', fd);
                    const fileName = res.data.fileName;
                    setImage(`/api/files/${fileName.split('/')[1]}`);
                }} />
                <div className="form-check my-2">
                    <input className="form-check-input" type="checkbox" value="" checked={disabled} onChange={() => {
                        setDisabled(p => !p)
                    }} />
                    <label className="form-check-label" >
                        Disabled
                    </label>
                </div>
                <button className='btn btn-primary form-control'>Save</button>
            </form>
        </div>
    )
}
