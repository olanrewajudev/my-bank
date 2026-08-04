import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { HiOutlineArrowPath } from 'react-icons/hi2'
import { Link, useParams } from 'react-router'
import { transact_urls } from '~/component/endpoints/transact'

interface TransactionDetail {
  id: number
  user: number
  username: string
  acctnumber: string
  status: string
  amount: number
  content: string
  title: string
  category?: string
  from?: string
  to?: string
  date: string
  createdAt: string
  updatedAt: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between border-b border-slate-100 py-5">
      <p className="text-slate-500">{label}</p>
      <p className="max-w-[65%] text-right text-slate-800">{value}</p>
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
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <div className="mt-4 mx-5 flex items-center">
        <Link to="/admin/all-user" className="text-slate-800">
          <BsArrowLeft size={24} />
        </Link>
        <h1 className="mx-auto -ml-6 text-base font-medium text-slate-800">
          Transaction details
        </h1>
      </div>

      {isLoading && (
        <p className="mt-10 text-center text-sm text-slate-500">Loading...</p>
      )}

      {!isLoading && tx && (
        <>
          {/* Icon + amount */}
          <div className="mt-6 flex flex-col items-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full">
              <HiOutlineArrowPath className="text-3xl text-slate-800" />
            </span>
            <p
              className={`mt-4 text-3xl font-medium ${
                isPositive ? 'text-emerald-600' : 'text-slate-800'
              }`}
            >
              {isPositive ? '+' : '-'}$
              {Math.abs(tx.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Detail rows */}
          <div className="mt-10 mx-6">
            <Row
              label="Status"
              value={tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            />
            <Row label="Posted on" value={formatDate(tx.date)} />
            <Row
              label="Resulting balance"
              value={`$${Math.abs(tx.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}`}
            />
            <Row label="Category" value={tx.category ?? tx.title} />
            <Row
              label="From"
              value={
                tx.from ??
                `${tx.content}${
                  tx.acctnumber
                    ? ` (acct •••• ${tx.acctnumber.slice(-4)})`
                    : ''
                }`
              }
            />
            {tx.to && <Row label="To" value={tx.to} />}
          </div>

          {/* Footer disclaimer - pull from API/config, don't hardcode a bank name */}
          <div className="mx-6 mt-6 space-y-3 text-xs text-slate-400">
            <p>
              Transfers are processed by our banking partner and may take 1-3
              business days to fully settle.
            </p>
          </div>

          {/* Track button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4">
            <button
              className="w-full rounded-lg bg-blue-700 py-3.5 text-center font-medium text-white hover:bg-blue-800"
              onClick={() => {
                // hook this up to your tracking flow/modal
              }}
            >
              Track my transfer
            </button>
          </div>
        </>
      )}
    </div>
  )
}