import React from 'react'
interface Props {
  children?: React.ReactNode,
  onClick?: any
}
export default function NavButton(props: Props) {
  return (
    <button onClick={props.onClick} className='nav-button'>
      {props.children}
    </button>
  )
}
