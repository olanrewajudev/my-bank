

import React from 'react'

export default function Table(props: {children: React.ReactNode, className?: string}) {
  return (
    <table className={`table w-full table-auto ${props.className}`}>{props.children}</table>
    
  ) 
}
