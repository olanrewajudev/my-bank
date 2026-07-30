import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation } from 'react-router'
import Footer from '~/component/general/footer'
import Header from '~/component/general/header'
import Cookies from 'js-cookie'
import { CookieName } from '~/component/Apis'
import { isExpired } from 'react-jwt'
import { User_urls } from '~/component/endpoints/user'
import { dispatchUser } from '~/lib/reducer'
export default function GeneralLayout() {
  const dispatch = useDispatch()
  const { pathname } = useLocation()

  const [show, setShow] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const token = Cookies.get(CookieName)
        const exp = isExpired(token || '')

        if(!exp) {
          const response = await User_urls.profile()
          dispatch(dispatchUser(response.data))
        }
      } catch (error) {

      }
    })
  }, [])

  useEffect(() => {
    (() => {
      setShow(false)
      setTimeout(() => {
        setShow(true)
      }, 2000);
    })()
  }, [pathname])

  if (!show) return (
    <div>
      
    </div>
  )

  if (show) return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
