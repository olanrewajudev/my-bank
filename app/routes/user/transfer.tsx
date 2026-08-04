// import { useQuery } from '@tanstack/react-query'
// import React from 'react'
// import { HiOutlineArrowsRightLeft, HiOutlineChevronRight } from 'react-icons/hi2'
// import { transact_urls } from '~/component/endpoints/transact'

// export default function Transfer() {
//       const { data: transactions = [], isLoading } = useQuery({
//         queryKey: ['all-transactions'],
//         queryFn: async () => {                          
//             const res = await transact_urls.getAllUserTransact()
//             return res.data.msg || []
//         },
//     })

//   return (
//     <div className="min-h-screen bg-[#eef1f3] py-5 pb-24">
//       {/* Header */}
//       <div className="relative px-6 pt-6 pb-10 ">
//         <h1 className="max-w-[65%] lg:text-3xl text-xl texce font-medium leading-snug text-slate-800">
//           Move your money with ease
//         </h1>

//         {/* shield illustration */}
//         <svg className="absolute right-6 top-4 h-28 w-32" viewBox="0 0 120 120">
//           <polygon points="90,30 120,90 60,90" fill="#0f7a52" opacity="0.9" />
//           <polygon points="70,50 100,110 40,110" fill="#0a5c3e" opacity="0.6" />
//           <path d="M60 15 L85 25 V60 C85 80 73 92 60 98 C47 92 35 80 35 60 V25 Z" fill="#1d4ed8" />
//           <path d="M60 15 V98 C73 92 85 80 85 60 V25 Z" fill="#3b82f6" />
//           <path d="M50 55 l7 7 14 -14" stroke="#0a1a3c" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//       </div>

//       {/* FDIC banner */}
//       <div className="bg-white px-6 py-5">
//         <p className="text-sm italic text-slate-700">
//           <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
//           FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
//           Sachs Bank USA, Salt Lake City Branch.
//         </p>
//       </div>

//       {/* Actions */}
//       <div className="bg-white">
//         <button className="flex w-full items-center justify-between px-6 py-6">
//           <div className="flex items-center gap-4">
//             <HiOutlineArrowsRightLeft className="text-xl text-slate-700" />
//             <div className="text-left">
//               <p className="text-slate-800">Make a transfer</p>
//               <p className="text-sm text-slate-500">Move money to/from savings</p>
//             </div>
//           </div>
//           <HiOutlineChevronRight className="text-slate-400" />
//         </button>
//       </div>

//     </div>
//   )
// }

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { HiOutlineArrowsRightLeft, HiOutlineChevronRight, HiOutlineArrowPath } from 'react-icons/hi2'
import { Link } from 'react-router'
import { transact_urls } from '~/component/endpoints/transact'

interface Transaction {
  id: number
  user: number
  username: string
  acctnumber: string
  status: string
  amount: number
  content: string
  title: string
  date: string
  createdAt: string
  updatedAt: string
}

function formatDateHeader(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {}
  transactions.forEach((tx) => {
    const key = tx.date
    if (!groups[key]) groups[key] = []
    groups[key].push(tx)
  })
  // newest date first
  return Object.entries(groups).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  )
}

export default function Transfer() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['all-transactions'],
    queryFn: async () => {
      const res = await transact_urls.getAllUserTransact()
      return res.data.msg || []
    },
  })

  const grouped = groupByDate(transactions)

  return (
    <div className="min-h-screen bg-[#eef1f3] py-5 pb-24">
      {/* Header */}
      <div className="relative px-6 pt-6 pb-10 ">
        <h1 className="max-w-[65%] lg:text-3xl text-xl texce font-medium leading-snug text-slate-800">
          Move your money with ease
        </h1>

        {/* shield illustration */}
        <svg className="absolute right-6 top-4 h-28 w-32" viewBox="0 0 120 120">
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

      {/* Transaction History */}
      <div className="mt-4 bg-white">
        <h2 className="px-6 pt-6 pb-3 text-2xl font-semibold text-slate-800">
          Transactions
        </h2>

        {isLoading && (
          <p className="px-6 py-6 text-sm text-slate-500">Loading transactions...</p>
        )}

        {!isLoading && transactions.length === 0 && (
          <p className="px-6 py-6 text-sm text-slate-500">No transactions yet.</p>
        )}

        {grouped.map(([date, txs]) => (
          <div key={date}>
            {/* Date header row */}
            <div className="bg-[#eef1f3] px-6 py-3">
              <p className="text-sm text-slate-600">{formatDateHeader(date)}</p>
            </div>

            {/* Transactions for this date */}
            {txs.map((tx) => {
              const isPositive = tx.amount >= 0
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border-b border-slate-100 px-6 py-5 last:border-b-0"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <HiOutlineArrowPath className="text-lg text-slate-600" />
                    </span>
                    <div>
                      <p className="text-[15px] leading-snug text-slate-800">
                        {tx.title} {tx.acctnumber && (
                          <>
                            {'· '}
                            {'*'.repeat(Math.max(tx.acctnumber.length - 4, 0))}
                            {tx.acctnumber.slice(-4)}
                          </>
                        )}
                      </p>
                      <p
                        className={`mt-1 text-[15px] font-medium ${
                          isPositive ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {isPositive ? '+' : '-'}$
                        {Math.abs(tx.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <Link to={`/user/transaction/${tx.id}`} className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    Track
                  </Link>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}