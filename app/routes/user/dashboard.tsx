import React from 'react'
import { HiOutlinePlus, HiOutlineArrowRight } from 'react-icons/hi2'
import { useSelector } from 'react-redux'
import UserHeader from '~/component/user/user-header'
import type { RootState } from '~/lib/store'

const discoverCards = [
  { tag: 'Refer a friend', title: 'Earn a rate boost', bg: 'bg-emerald-700', text: 'text-white' },
  { tag: 'Open a No-Penalty CD', title: 'Fixed rate & flexible access', bg: 'bg-slate-900', text: 'text-white' },
  { tag: 'Compare products and rates', title: 'Our savings options', bg: 'bg-blue-700', text: 'text-white' },
]

export default function Dashboard() {
  const {user} = useSelector((state: RootState) => state.data)
  console.log(user?.firstname)
  return (
    <div className="min-h-screen bg-[#eef1f3] pb-24">
      {/* Logo + welcome banner */}
      <div className="relative overflow-hidden px-6 pt-6 pb-10">
        <h1 className="text-3xl font-bold text-slate-800">
          M<span className="text-blue-500">:</span>
        </h1>
        <p className="mt-10 text-3xl font-medium text-slate-800">Welcome, {user?.firstname}</p>

        {/* decorative mountain motif */}
        <svg
          className="pointer-events-none absolute -right-6 bottom-0 h-40 w-64 opacity-90"
          viewBox="0 0 260 160"
        >
          <polygon points="120,20 200,150 40,150" fill="#0f7a52" />
          <polygon points="180,50 260,150 100,150" fill="#0a5c3e" opacity="0.85" />
          <path d="M60 70 q20 -18 40 0" stroke="#1e3a5f" strokeWidth="4" fill="none" />
        </svg>
      </div>

      {/* FDIC banner */}
      <div className="bg-[#dde3e7] px-6 py-5">
        <p className="text-sm italic text-slate-700">
          <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Beacon Gold Crest Bank USA, Salt Lake City Branch.
        </p>
      </div>

      {/* Accounts */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-slate-800">Accounts</h2>
          <button aria-label="Add account" className="text-slate-700">
            <HiOutlinePlus className="text-2xl" />
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
          <p className="text-slate-600">Online Savings – {user?.phone.slice(0, 4)}</p>
          <p className="mt-2 text-3xl font-medium text-emerald-700">${user?.currbonus}</p>
          <p className="mt-1 text-sm text-slate-500">Current balance</p>
        </div>
      </div>

      {/* Discover more */}
      <div className="mt-8 px-6">
        <h2 className="text-xl font-medium text-slate-800">Discover more</h2>
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrolls pb-2">
          {discoverCards.map((card) => (
            <div
              key={card.title}
              className={`min-w-[160px] shrink-0 rounded-md p-5 ${card.bg} ${card.text}`}
            >
              <p className="text-sm">{card.tag}</p>
              <p className="mt-4 text-2xl font-medium leading-snug">{card.title}</p>
              <HiOutlineArrowRight className="mt-8 text-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Disclosures */}
      <div className="mt-8 space-y-4 px-6 text-xs leading-relaxed text-slate-500">
        <p>
          Beacon Gold Crest by Beacon Gold Crest® is a brand of Beacon Gold Crest Bank USA. All deposit products
          are provided or issued by Beacon Gold Crest Bank USA, Salt Lake City Branch. Member FDIC.
        </p>
        <p>
          Important information about procedures for opening a new account: To help the
          government fight the funding of terrorism and money laundering activities, federal
          law requires all financial institutions to obtain, verify, and record information
          that identifies each person who opens an account.
        </p>
        <p>
          What this means for you: When you open an account, we will ask for your name,
          address, date of birth, and other information that will allow us to identify you.
        </p>
      </div>

      {/* <UserHeader /> */}
    </div>
  )
}