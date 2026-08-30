import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { HiOutlineArrowDown, HiOutlineArrowUp, HiOutlineExclamationTriangle } from 'react-icons/hi2'
import { Link, useParams } from 'react-router'
import { transact_urls } from '~/component/endpoints/transact'

interface TransactionDetail {
  id: number
  user: number
  username: string
  sendername: string
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

function statusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case 'successful': return 'bg-emerald-50 text-emerald-700'
    case 'pending': return 'bg-yellow-50 text-yellow-700'
    default: return 'bg-red-50 text-red-700'
  }
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-5 last:border-b-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
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

  const isWithdrawal = tx?.title?.toLowerCase() === 'withdrawal'

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <Link to="/user/transfer" className="text-slate-500 hover:text-slate-800 transition-colors">
          <BsArrowLeft className="text-xl" />
        </Link>
        <h1 className="text-base font-semibold text-slate-900">Transaction Details</h1>
        <div className="w-5" />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-16 animate-pulse px-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100" />
          <div className="mx-auto mt-5 h-10 w-44 rounded-lg bg-slate-100" />
          <div className="mx-auto mt-3 h-5 w-20 rounded-full bg-slate-100" />

          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-slate-100 bg-white px-5">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between border-b border-slate-100 py-5 last:border-b-0">
                <div className="h-4 w-20 rounded bg-slate-100" />
                <div className="h-4 w-28 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not found / failed */}
      {!isLoading && !tx && (
        <div className="mt-20 flex flex-col items-center px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <HiOutlineExclamationTriangle className="text-2xl text-slate-400" />
          </span>
          <p className="mt-4 font-semibold text-slate-700">Transaction not found</p>
          <p className="mt-1 text-sm text-slate-400">This transaction may have been removed or the link is incorrect.</p>
          <Link
            to="/user/transfer"
            className="mt-6 rounded-full bg-[#075c40] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#064d35] transition-colors"
          >
            Back to Transactions
          </Link>
        </div>
      )}

      {/* Loaded */}
      {!isLoading && tx && (
        <>
          <div className="mt-10 flex flex-col items-center px-6">
            <span className={`flex h-16 w-16 items-center justify-center rounded-full ${isWithdrawal ? 'bg-red-50' : 'bg-emerald-50'}`}>
              {isWithdrawal ? (
                <HiOutlineArrowUp className="text-2xl text-red-600" />
              ) : (
                <HiOutlineArrowDown className="text-2xl text-emerald-600" />
              )}
            </span>

            <h2 className={`mt-5 text-[3.2rem] font-bold leading-none tracking-tight ${isWithdrawal ? 'text-red-600' : 'text-emerald-600'}`}>
              {isWithdrawal ? '-' : '+'}$
              {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>

            <span className={`mt-4 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle(tx.status)}`}>
              {tx.status}
            </span>
          </div>

          <div className="mx-auto mt-10 max-w-md px-6">
            <div className="rounded-2xl border border-slate-100 bg-white px-5 shadow-sm">
              <Row label="Posted on" value={formatDate(tx.date)} />

              <Row
                label="Amount"
                value={`${isWithdrawal ? '-' : '+'}$${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              />

              <Row label="Category" value={isWithdrawal ? 'Withdrawal' : (tx.category ?? 'Deposit')} />

              <Row
                label={isWithdrawal ? 'Destination' : 'From'}
                value={
                  isWithdrawal
                    ? tx.acctnumber
                      ? `••••${tx.acctnumber.slice(-4)}`
                      : 'Bank Account'
                    : tx.title || ''
                }
              />

              {tx.to && <Row label="To" value={tx.to} />}
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              Transfers are processed by our banking partner and may take 1–3 business days to fully settle.
            </p>
          </div>
        </>
      )}
    </div>
  )
}