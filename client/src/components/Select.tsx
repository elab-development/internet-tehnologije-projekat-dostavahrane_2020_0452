import React from 'react'


interface Option {
    value: any,
    label: string
}

interface Props {
    label: string,
    value: any,
    onChange: (val: string) => void,
    options: Option[]
}

export default function Select(props: Props) {
    return (
        <div className='form-group'>
            {props.label && <label >{props.label}</label>}
            <select className='form-control'
                value={props.value} onChange={e => props.onChange?.(e.currentTarget.value)}>
                <option value="">Select...</option>
                {
                    props.options.map(op => {
                        return (
                            <option key={op.value} value={op.value}>{op.label}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}
