import React from 'react'
import { HiOutlineArrowsRightLeft, HiOutlineChevronRight } from 'react-icons/hi2'

export default function Transfer() {
  return (
    <div className="min-h-screen bg-[#eef1f3] pb-24">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-10">
        <h1 className="max-w-[65%] text-3xl font-medium leading-snug text-slate-800">
          Move your money with ease
        </h1>

        {/* shield illustration */}
        <svg className="absolute right-6 top-4 h-28 w-28" viewBox="0 0 120 120">
          <polygon points="90,30 120,90 60,90" fill="#0f7a52" opacity="0.9" />
          <polygon points="70,50 100,110 40,110" fill="#0a5c3e" opacity="0.6" />
          <path d="M60 15 L85 25 V60 C85 80 73 92 60 98 C47 92 35 80 35 60 V25 Z" fill="#1d4ed8" />
          <path d="M60 15 V98 C73 92 85 80 85 60 V25 Z" fill="#3b82f6" />
          <path d="M50 55 l7 7 14 -14" stroke="#0a1a3c" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* FDIC banner */}
      <div className="bg-white px-6 py-5">
        <p className="text-sm italic text-slate-700">
          <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
          Sachs Bank USA, Salt Lake City Branch.
        </p>
      </div>

      {/* Actions */}
      <div className="bg-white">
        <button className="flex w-full items-center justify-between px-6 py-6">
          <div className="flex items-center gap-4">
            <HiOutlineArrowsRightLeft className="text-xl text-slate-700" />
            <div className="text-left">
              <p className="text-slate-800">Make a transfer</p>
              <p className="text-sm text-slate-500">Move money to/from savings</p>
            </div>
          </div>
          <HiOutlineChevronRight className="text-slate-400" />
        </button>
      </div>

    </div>
  )
}