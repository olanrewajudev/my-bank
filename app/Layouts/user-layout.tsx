import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { isExpired } from 'react-jwt'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'
import { CookieName } from '~/component/Apis'
import { User_urls } from '~/component/endpoints/user'
import UserHeader from '~/component/user/user-header'
import { dispatchUser } from '~/lib/reducer'

export default function AuthLayout() {
    const [login, setLogin] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            try {
                const token = Cookies.get(CookieName)
                if (!token) return navigate('/login')
                const exp = isExpired(token)
                if (exp) {
                    Cookies.remove(CookieName)
                    console.log('Session Expired', 'Your session has expired, please login again', 'error')
                    return navigate('/login')
                }
                const response = await User_urls.profile()
                if (!response) {
                    console.log('Unauthorized', 'Kindly verify your email address to proceed', 'error')
                    setLogin(false)
                    return navigate('/login')
                }

                const user = response.data.msg
                if (user.tag !== 'user') {
                    // logged in, but this is an admin account — send them to their own area
                    console.log('Forbidden', 'You do not have access to this area', 'error')
                    setLogin(false)
                    return navigate('/admin/login')
                }

                setLogin(true)
                dispatch(dispatchUser(user))
            } catch (error) {
                console.log('Error Occured', 'error')
                return navigate('/login')
            }
        })()
        // eslint-disable-next-line
    }, [navigate])

    if (!login) return (
        <div className='fixed top-0 left-0 w-full h-screen flex items-center justify-center'>
            <div className="lds-ripple"><div></div><div></div></div>
        </div>
    )

    return (
        <>
            <Outlet />
            <UserHeader />
        </>
    )
}