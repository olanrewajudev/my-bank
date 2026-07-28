import React from 'react'
import { useNavigate } from 'react-router'
import { HiOutlineChevronLeft } from 'react-icons/hi2'
import { TransferIcon } from '~/component/general/constant'

const details = [
  { label: 'Status', value: 'Posted' },
  { label: 'Posted on', value: 'July 17, 2026' },
  { label: 'Resulting balance', value: '$32,890.00' },
  { label: 'Category', value: 'Deposit' },
  {
    label: 'From',
    value: 'Internet transfer from FIRST HAWAIIAN BANK DDA account ****************9058',
  },
  { label: 'To', value: 'Online Savings – 8057' },
]

export default function TransactionDetails() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="relative flex items-center justify-center px-6 pt-6">
        <button onClick={() => navigate(-1)} className="absolute left-6" aria-label="Back">
          <HiOutlineChevronLeft className="text-2xl text-slate-700" />
        </button>
        <h1 className="text-xl text-slate-800">Transaction details</h1>
      </div>

      <div className="mt-12 flex flex-col items-center">
        <TransferIcon className="h-9 w-9 text-slate-800" />
        <p className="mt-6 text-3xl text-emerald-700">+$32,890.00</p>
      </div>

      <div className="mt-12 divide-y divide-slate-100 px-6">
        {details.map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-6 py-6">
            <span className="shrink-0 text-slate-700">{label}</span>
            <span className="text-right text-slate-800">{value}</span>
          </div>
        ))}
      </div>

      <p className="px-6 pt-6 text-xs leading-relaxed text-slate-500">
        Beacon Gold Crest by Goldman Sachs® is a brand of Beacon Gold Crest Bank USA, Salt Lake City Branch.
        Member FDIC. References to FDIC insurance on this page relate to Beacon Gold Crest Bank USA
        and do not reflect FDIC insurance availability at other financial institutions.
      </p>

      <div className="px-6 pt-8">
        <button className="w-full rounded-md bg-blue-700 py-4 font-medium text-white">
          Track my transfer
        </button>
      </div>
    </div>
  )
}