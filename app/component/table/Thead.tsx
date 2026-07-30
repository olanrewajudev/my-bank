

import React from 'react'

export default function Thead(props: {children: React.ReactNode, className?: string}) {
  return (
    <thead className={`${props.className}`}>{props.children}</thead>
  )
}
