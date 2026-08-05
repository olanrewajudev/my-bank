import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { HiOutlineArrowPath } from 'react-icons/hi2'
import { Link, useParams } from 'react-router'
import { transact_urls } from '~/component/endpoints/transact'

interface TransactionDetail { id: number, user: number, username: string, acctnumber: string, status: string, amount: number, content: string, title: string, category?: string, from?: string, to?: string, date: string, createdAt: string, updatedAt: string , sendername:string}
function formatDate(dateStr: string) { return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', }) }

function Row({ label, value, }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-5">
      <p className="text- text-slate-500">{label}</p>
      <div className="max-w-[65%] text-right text- leading-8 text-slate-900">{value}</div>
    </div>
  )
}

export default function SingleTransaction() {
  const { id } = useParams()

  const { data: tx, isLoading } = useQuery<TransactionDetail>({
    queryKey: ['single-transaction', id],
    queryFn: async () => {
      const res = await transact_urls.getSingleTransact(id as string)
      return res.data.msg
    },
    enabled: !!id,
  })

  const isPositive = (tx?.amount ?? 0) >= 0

  return (
    <div className="min-h-screen mt-10 bg-white ">
      {/* Header */}
      <div className="flex items-center px-6 pt-8">
        <Link to="/user/transfer"><BsArrowLeft className="text-2xl text-slate-800" /></Link>
        <h1 className="flex-1 text-center text-lg font-medium text-slate-900">Transaction details</h1>

        {/* keeps title centered */}
        <div className="w-6" />
      </div>

      {isLoading && (
        <div className="mt-20 animate-pulse space-y-6 px-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-200" />
          <div className="mx-auto h-12 w-56 rounded bg-slate-200" />
          {[...Array(5)].map((_, index) => (<div key={index} className="h-16 rounded-lg bg-slate-100" />))}
        </div>
      )}

      {!isLoading && tx && (
        <>
          {/* Icon + Amount */}
          <div className="mt-10 flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full"><HiOutlineArrowPath className="text-[2rem] text-slate-700" /></span>

            <h2 className={`mt-5 text-[56px] font-normal leading-none ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? '+' : '-'}$
              {Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, })}
            </h2>
          </div>

          {/* Details */}
          <div className="mx-6 mt-12">
            <Row label="Status" value={tx.status.charAt(0).toUpperCase() + tx.status.slice(1)} />
            <Row label="Posted on" value={formatDate(tx.date)} />
            <Row label="Resulting balance" value={`$${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, })}`} />
            <Row label="Category" value={tx.category ?? tx.title} />
            <Row label="From" value={tx.sendername} />

            {tx.to && (<Row label="To" value={tx.to}/>)}
          </div>

          {/* Disclaimer */}
          <div className="mx-6 mt-10">
            <p className="text-sm leading-6 text-slate-400">Transfers are processed by our banking partner and may take 1–3 business days to fully settle.</p>
            {/* <div className="fixed inset-x-0 bottom-0 px-5 py-5 mb-14 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => {
                  // TODO: Implement transfer tracking
                }}
                className="h-14 w-full rounded-xl bg-blue-700 text-lg font-medium text-white transition hover:bg-blue-800"
              >
                Track my transfer
              </button>
            </div> */}
          </div>
        </>
      )}
    </div>
  )
}