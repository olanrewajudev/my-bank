import React from 'react'
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineLockClosed,
  HiOutlinePencil,
  HiOutlineExclamationCircle,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineChevronRight,
} from 'react-icons/hi2'

const menuItems = [
  { label: 'Security & login', icon: HiOutlineLockClosed },
  { label: 'Give feedback', icon: HiOutlinePencil },
  { label: 'Alerts', icon: HiOutlineExclamationCircle },
  { label: 'Documents', icon: HiOutlineDocumentText },
  { label: 'Linked external accounts', icon: HiOutlineLink },
]

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#eef1f3] pb-24">
      <div className="flex justify-end px-6 pt-6">
        <button className="flex items-center gap-2 text-slate-700">
          <HiOutlineArrowRightOnRectangle />
          Log out
        </button>
      </div>

      {/* Identity card */}
      <div className="mt-4 px-6">
        <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-2xl text-slate-800">sheila Gatewood</p>
          <p className="mt-1 text-slate-500">gatewoodsheila04@gmail.com</p>
          <button className="mt-6 w-full rounded-md border border-blue-700 py-3 font-medium text-blue-700">
            Contact info
          </button>
        </div>
      </div>

      {/* Referral banner */}
      <div className="mt-4 px-6">
        <div className="relative overflow-hidden rounded-xl bg-white px-6 py-6 shadow-sm">
          <p className="text-slate-500">Beacon Gold Crest Referred</p>
          <p className="mt-2 max-w-[65%] text-slate-800">
            Invite a friend to Beacon Gold Crest: Earn a rate boost
          </p>
          <button className="mt-3 text-blue-700">Refer a friend &gt;</button>
          <svg className="pointer-events-none absolute right-0 bottom-0 h-24 w-32" viewBox="0 0 140 100">
            <polygon points="70,10 130,95 10,95" fill="#0f7a52" />
          </svg>
        </div>
      </div>

      {/* FDIC banner */}
      <div className="mt-4 bg-[#dde3e7] px-6 py-5">
        <p className="text-sm italic text-slate-700">
          <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
          Sachs Bank USA, Salt Lake City Branch.
        </p>
      </div>

      {/* Menu */}
      <div className="divide-y divide-slate-100 bg-white">
        {menuItems.map(({ label, icon: Icon }) => (
          <button key={label} className="flex w-full items-center justify-between px-6 py-6">
            <div className="flex items-center gap-4">
              <Icon className="text-xl text-slate-700" />
              <span className="text-slate-800">{label}</span>
            </div>
            <HiOutlineChevronRight className="text-slate-400" />
          </button>
        ))}
      </div>

      {/* <UserHeader /> */}
    </div>
  )
}