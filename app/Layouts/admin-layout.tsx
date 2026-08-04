

import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { isExpired } from 'react-jwt'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'
import Header from '~/component/admin/header'
import AdminSidebar from '~/component/admin/sidebar'
import { CookieName } from '~/component/Apis'
import { User_urls } from '~/component/endpoints/user'
import UserHeader from '~/component/user/user-header'
import { dispatchUser } from '~/lib/reducer'

export default function AdminLayout() {
    const [login, setLogin] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            try {
                const token = Cookies.get(CookieName)
                if (!token) return navigate('/admin/login')
                const exp = isExpired(token)
                if (exp) {
                    Cookies.remove(CookieName)
                    console.log('Session Expired', 'Your session has expired, please login again', 'error')
                    return navigate('/admin/login')

                }
                const response = await User_urls.profile()
                if (!response) {
                    console.log('Unauthorized', 'Kindly verify your email address to proceed', 'error')
                    setLogin(false)
                    return navigate('/admin/login')
                }else {
                    setLogin(true)
                    dispatch(dispatchUser(response.data.msg))
                }
            } catch (error) {
                console.log('Error Occured', 'error')
                return navigate('/admin/login')
            }
        })()
        // eslint-disable-next-line
    }, [navigate])

    if (!login) return (
        <div className='fixed top-0 left-0 w-full h-screen flex items-center justify-center'>
            <div className="lds-ripple"><div></div><div></div></div>
        </div>
    )

    if (login) return (
    <div className="h-screen">
      <Header />
      <div className="hidden lg:block"><AdminSidebar /></div>
      <div className="lg:ml-[20rem] overflow-y-auto"><Outlet /></div>
    </div>
  )
}
