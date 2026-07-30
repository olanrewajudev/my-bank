
import React from 'react'

export default function Tr(props: { children: React.ReactNode, className?: string, header?: boolean, last: boolean, onClick?: () => void }) {
  return (
    <tr onClick={props.onClick} className={`${props.className}   ${props.last ? '' : 'border-b border-zinc-400'}  cursor-pointer relative`}>
      {props.children}
      {/* {!props.header && <Td className='text-lime-dark capitalize font-semibold'>view</Td>} */}
    </tr>
  )
}
