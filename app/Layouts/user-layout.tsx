import React from 'react'
import { Outlet } from 'react-router'
import UserHeader from '~/component/user/user-header'

export default function UserLayout() {
    return (
        <div>
            <UserHeader />
            <Outlet />
        </div>
    )
}
