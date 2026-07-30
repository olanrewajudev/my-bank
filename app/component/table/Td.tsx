
import React from 'react'

export default function Td(props: {children: React.ReactNode, className?: string, onClick?: () => void}) {
  return (
    <td onClick={props.onClick} className={`${props.className} truncate font-light py-6 px-4`}>{props.children}</td>
  )
}
