// import React, { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import { Outlet, useLocation } from 'react-router'
// import Footer from '~/component/general/footer'
// import Header from '~/component/general/header'
// import Cookies from 'js-cookie'
// import { CookieName } from '~/component/Apis'
// import { isExpired } from 'react-jwt'
// import { User_urls } from '~/component/endpoints/user'
// import { dispatchUser } from '~/lib/reducer'
// export default function UserLayout() {
//   const dispatch = useDispatch()
//   const { pathname } = useLocation()

//   const [show, setShow] = useState(false)

//   useEffect(() => {
//     (async () => {
//       try {
//         const token = Cookies.get(CookieName)
//         const exp = isExpired(token || '')

//         if(!exp) {
//           const response = await User_urls.profile()
//           dispatch(dispatchUser(response.data))
//         }
//       } catch (error) {

//       }
//     })
//   }, [])

//   useEffect(() => {
//     (() => {
//       setShow(false)
//       setTimeout(() => {
//         setShow(true)
//       }, 2000);
//     })()
//   }, [pathname])

//   if (!show) return (
//     <div>
      
//     </div>
//   )

//   if (show) return (
//     <>
//       <Header />
//       <Outlet />
//       <Footer />
//     </>
//   )
// }

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
                }else {
                    setLogin(true)
                    dispatch(dispatchUser(response.data.msg))
                }
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

    if (login) return (
        <>
          <Outlet />
          <UserHeader />
        </>
    )
}
