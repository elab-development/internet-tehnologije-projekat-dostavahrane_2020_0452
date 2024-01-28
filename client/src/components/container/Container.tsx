import React from 'react'

interface Props {
    className?: string,
    children?: React.ReactNode,
    header?: string
}
export default function Container(props: Props) {
    return (
        <div className={'app-container ' + (props.className || '')}>
            {
                props.header && (
                    <h2 className='header'>{[props.header]}</h2>
                )
            }
            {props.children}
        </div>
    )
}
