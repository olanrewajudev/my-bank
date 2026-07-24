import React from 'react'
import { HiOutlineHome, HiOutlineArrowsRightLeft, HiOutlineQuestionMarkCircle, HiOutlineUser } from 'react-icons/hi2'
import { Link, useLocation } from 'react-router'

const tabs = [
  { to: '/user/dashboard', label: 'Accounts', icon: HiOutlineHome },
  { to: '/user/transfer', label: 'Transfer/Pay', icon: HiOutlineArrowsRightLeft },
  { to: '/user/help', label: 'Help', icon: HiOutlineQuestionMarkCircle },
  { to: '/user/profile', label: 'Profile', icon: HiOutlineUser },
]

export default function UserHeader() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 text-xs ${
                active ? 'text-slate-900' : 'text-slate-500'
              }`}
            >
              <Icon className="text-xl" />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}