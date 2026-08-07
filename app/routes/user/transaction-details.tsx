
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

function Row({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-5">
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

  const isWithdrawal =
    tx?.title?.toLowerCase() === 'withdrawal'

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <Link to="/user/transfer">
          <BsArrowLeft className="text-2xl text-slate-700" />
        </Link>

        <h1 className="text-lg font-semibold text-slate-800">
          Transaction details
        </h1>

        <div className="w-6" />
      </div>

      {isLoading && (
        <div className="mt-20 animate-pulse space-y-6 px-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-200" />
          <div className="mx-auto h-12 w-56 rounded bg-slate-200" />

          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-16 rounded-lg bg-slate-100"
            />
          ))}
        </div>
      )}

      {!isLoading && tx && (
        <>
          {/* Icon + Amount */}
          <div className="mt-10 flex flex-col items-center">
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                isWithdrawal
                  ? 'bg-red-100'
                  : 'bg-emerald-100'
              }`}
            >
              <HiOutlineArrowPath
                className={`text-[2rem] ${
                  isWithdrawal
                    ? 'text-red-600'
                    : 'text-emerald-600'
                }`}
              />
            </span>

            <h2
              className={`mt-5 text-[56px] font-normal leading-none ${
                isWithdrawal
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }`}
            >
              {isWithdrawal ? '-' : '+'}$
              {Number(tx.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </h2>

            <p className="mt-3 text-sm capitalize text-slate-500">
              {tx.status}
            </p>
          </div>

          {/* Details */}
          <div className="mx-6 mt-12 rounded-xl border border-slate-200 bg-white px-5">
            <Row
              label="Status"
              value={
                tx.status.charAt(0).toUpperCase() +
                tx.status.slice(1)
              }
            />

            <Row
              label="Posted on"
              value={formatDate(tx.date)}
            />

            <Row
              label="Amount"
              value={`${isWithdrawal ? '-' : '+'}$${Number(
                tx.amount
              ).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}`}
            />

            <Row
              label="Category"
              value={
                isWithdrawal
                  ? 'Withdrawal'
                  : tx.category ?? 'Deposit'
              }
            />

            <Row
              label={isWithdrawal ? 'Destination' : 'From'}
              value={
                isWithdrawal
                  ? tx.acctnumber
                    ? `******${tx.acctnumber.slice(-4)}`
                    : 'Bank Account'
                  : tx.sendername || 'Admin Panel'
              }
            />

            {tx.to && (
              <Row
                label="To"
                value={tx.to}
              />
            )}
          </div>

          {/* Disclaimer */}
          <div className="mx-6 mt-10">
            <p className="text-sm leading-6 text-slate-400">
              Transfers are processed by our banking partner and
              may take 1–3 business days to fully settle.
            </p>
          </div>
        </>
      )}
    </div>
  )
}