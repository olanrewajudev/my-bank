
import React from 'react'

export default function Tbody(props: {children: React.ReactNode, className?: string}) {
  return (
    <tbody className={`${props.className}`}>{props.children}</tbody>
  )
}
