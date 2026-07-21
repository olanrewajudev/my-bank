import React from 'react'
import { Outlet } from 'react-router'
import Footer from '~/component/general/footer'
import Header from '~/component/general/header'

export default function GeneralLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
