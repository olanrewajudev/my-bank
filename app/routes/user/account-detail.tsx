import React from 'react'
import { useNavigate } from 'react-router'
import { HiOutlineChevronLeft, HiOutlinePencil, HiOutlineInformationCircle, HiOutlineEllipsisHorizontal } from 'react-icons/hi2'
import { TransferIcon } from '~/component/general/constant'

const transactions = [
  {
    date: 'July 17, 2026',
    description: 'Internet transfer from FIRST HAWAIIAN BANK DDA account ****************9058',
    amount: '+$32,890.00',
    trackable: true,
  },
]

export default function AccountDetail() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#eef1f3] pb-10">
      {/* Header */}
      <div className="bg-[#171a2e] px-6 pb-8 pt-6 text-white">
        <div className="relative flex items-center justify-center">
          <button onClick={() => navigate(-1)} className="absolute left-0" aria-label="Back">
            <HiOutlineChevronLeft className="text-2xl" />
          </button>
          <h1 className="text-xl">Savings</h1>
        </div>
      </div>

      {/* Account card */}
      <div className="-mt-4 px-6">
        <div className="rounded-xl bg-white px-6 py-6 shadow-sm">
          <div className="flex justify-end">
            <HiOutlineEllipsisHorizontal className="text-2xl text-slate-400" />
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            <p className="text-slate-700">Online Savings – 8057</p>
            <HiOutlinePencil className="text-slate-500" />
          </div>
          <p className="mt-4 text-center text-4xl font-medium text-emerald-700">$32,890.00</p>
          <p className="mt-2 text-center text-slate-500">Current balance</p>

          <div className="mt-8 divide-y divide-slate-100">
            <Row label="Annual Percentage Yield" infoIcon value="3.40%" />
            <Row label="Earnings YTD" value="$0.00" />
            <Row label="Available to use" infoIcon value="$0.00" />
            <Row label="Account & routing numbers" infoIcon value={<span className="text-blue-700 underline">View</span>} />
            <Row label="Interest rate" infoIcon value="3.34%" />
          </div>
        </div>
      </div>

      {/* FDIC banner */}
      <div className="mt-6 bg-[#dde3e7] px-6 py-5">
        <p className="text-sm italic text-slate-700">
          <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
          Sachs Bank USA, Salt Lake City Branch.
        </p>
      </div>

      {/* Transactions */}
      <div className="px-6 pt-6">
        <h2 className="text-xl font-medium text-slate-800">Transactions</h2>

        {transactions.map((group) => (
          <div key={group.date} className="mt-4">
            <p className="rounded-t-md bg-[#dde3e7] px-4 py-2 text-sm text-slate-600">{group.date}</p>
            <button className="flex w-full items-start justify-between rounded-b-md bg-white px-4 py-5 text-left">
              <div className="flex items-start gap-3">
                <TransferIcon className="mt-1 h-5 w-5 text-slate-700" />
                <div>
                  <p className="text-slate-800">{group.description}</p>
                  <p className="mt-2 text-emerald-700">{group.amount}</p>
                </div>
              </div>
              {group.trackable && (
                <span className="ml-3 shrink-0 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700">
                  Track
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Disclosure */}
      <p className="px-6 pt-6 text-xs leading-relaxed text-slate-500">
        Beacon Gold Crest by Beacon Gold Crest® is a brand of Beacon Gold Crest Bank USA, Salt Lake City Branch.
        Member FDIC.
      </p>

      {/* CTA */}
      <div className="px-6 pt-8">
        <button className="w-full rounded-md bg-blue-700 py-4 font-medium text-white">
          Make a transfer
        </button>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  infoIcon,
}: {
  label: string
  value: React.ReactNode
  infoIcon?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="flex items-center gap-2 text-slate-700">
        {label}
        {infoIcon && <HiOutlineInformationCircle className="text-slate-400" />}
      </span>
      <span className="text-slate-800">{value}</span>
    </div>
  )
}