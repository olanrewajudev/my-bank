import React from 'react'
import { HiOutlineChevronRight, HiOutlinePhone, HiOutlineBookOpen } from 'react-icons/hi2'

const topics = [
  'Security at Marcus',
  'Deposits & Withdrawals',
  'About Deposit Accounts',
  'Marcus Referred',
  'Beneficiaries',
]

export default function Help() {
  return (
    <div className="min-h-screen bg-[#eef1f3] pb-24">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-10">
        <h1 className="max-w-[70%] text-3xl font-medium leading-snug text-slate-800">
          How can we help you today?
        </h1>
        <div className="absolute right-6 top-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900">
          <HiOutlineBookOpen className="text-4xl text-blue-300" />
        </div>
      </div>

      {/* FDIC banner */}
      <div className="bg-[#dde3e7] px-6 py-5">
        <p className="text-sm italic text-slate-700">
          <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
          Sachs Bank USA, Salt Lake City Branch.
        </p>
      </div>

      {/* Popular topics */}
      <div className="px-6 pt-6">
        <h2 className="text-xl font-medium text-slate-800">Popular Topics</h2>
        <div className="mt-4 divide-y divide-slate-100 rounded-xl bg-white shadow-sm">
          {topics.map((topic) => (
            <button
              key={topic}
              className="flex w-full items-center justify-between px-5 py-5 text-left"
            >
              <span className="text-slate-800">{topic}</span>
              <HiOutlineChevronRight className="text-slate-400" />
            </button>
          ))}
        </div>

        <button className="mt-4 w-full rounded-md bg-blue-700 py-4 font-medium text-white">
          See all FAQs
        </button>
      </div>

      {/* Chat with us */}
      <div className="px-6 pt-8">
        <h2 className="text-lg font-medium text-slate-800">Chat with us</h2>
        <button className="mt-4 flex w-full items-center justify-between rounded-xl bg-white px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div className="text-left">
              <p className="text-slate-800">Chat now</p>
              <p className="text-sm text-slate-500">Our Savings support team is online</p>
            </div>
          </div>
          <HiOutlineChevronRight className="text-slate-400" />
        </button>
      </div>

      {/* We're here to help */}
      <div className="px-6 pt-8">
        <h2 className="text-lg font-medium text-slate-800">We're here to help</h2>
        <button className="mt-4 flex w-full items-center justify-between rounded-xl bg-white px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <HiOutlinePhone className="text-xl text-slate-700" />
            <span className="text-slate-800">Contact Us</span>
          </div>
          <HiOutlineChevronRight className="text-slate-400" />
        </button>
      </div>

      {/* <UserHeader /> */}
    </div>
  )
}