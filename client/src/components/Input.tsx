import React from 'react'

interface Props {
    label: string,
    value: string,
    onChange: (val: string) => void,
    type: string,
    placeholder: string,
    required: boolean
}

export default function Input(props: Partial<Props>) {
    return (
        <div className='form-group'>
            {props.label && <label >{props.label}</label>}
            <input className='form-control' required={props.required} type={props.type}
                value={props.value} placeholder={props.placeholder} onChange={e => props.onChange?.(e.currentTarget.value)} />
        </div>
    )
}
