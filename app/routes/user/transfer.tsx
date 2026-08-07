
// import { Modal } from '@mantine/core'
// import { useDisclosure } from '@mantine/hooks'
// import { useQuery } from '@tanstack/react-query'
// import React, { useState } from 'react'
// import { HiOutlineArrowsRightLeft, HiOutlineChevronRight, HiOutlineArrowPath } from 'react-icons/hi2'
// import { Link } from 'react-router'
// import { transact_urls } from '~/component/endpoints/transact'
// import Formbutton from '~/component/general/form-button'
// import Forminput from '~/component/general/form-input'
// import type { Transaction } from '../../../global'
// import { ErrorAlert } from '~/component/utils'
// import { useSelector } from 'react-redux'
// import type { RootState } from '~/lib/store'

// function formatDateHeader(dateStr: string) {
//   const date = new Date(dateStr)
//   return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
// }

// function groupByDate(transactions: Transaction[]) {
//   const groups: Record<string, Transaction[]> = {}
//   transactions.forEach((tx) => { const key = tx.date; if (!groups[key]) groups[key] = []; groups[key].push(tx) })
//   return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
// }

// const initialWithdrawForm = { country: '', accName: '', bank: '', recieveracctnumber: '', routineNumber: '', amount: '', }
// type WithdrawField = keyof typeof initialWithdrawForm

// // letters, spaces, apostrophes, hyphens only — no digits/symbols
// const TEXT_ONLY_REGEX = /[^a-zA-Z\s'-]/g
// const TEXT_ONLY_FIELDS: WithdrawField[] = ['country', 'accName']

// export default function Transfer() {
//   const {user} = useSelector((state: RootState) => state.data)
//   const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
//     queryKey: ['all-transactions'],
//     queryFn: async () => {
//       const res = await transact_urls.getAllUserTransact()
//       return res.data.msg || []
//     },
//   })

//   const grouped = groupByDate(transactions)
//   const [opened, { open, close }] = useDisclosure(false)

//   const [form, setForm] = useState(initialWithdrawForm)
//   const [submitting, setSubmitting] = useState(false)
//   const [formError, setFormError] = useState<Record<string, string>>({})

//   const handleChange = (field: WithdrawField) => (arg: any) => {
//     let nextValue = arg
//     if (arg && typeof arg === 'object') {
//       if ('target' in arg) nextValue = arg.target.value
//       else if ('value' in arg) nextValue = arg.value
//     }

//     if (TEXT_ONLY_FIELDS.includes(field)) {
//       nextValue = String(nextValue).replace(TEXT_ONLY_REGEX, '')
//     }

//     setForm((prev) => ({ ...prev, [field]: nextValue }))
//     setFormError((prev) => ({ ...prev, [field]: '' }))
//   }

//   const validate = () => {
//     const errors: Record<string, string> = {}
//     if (!form.country) errors.country = 'Country is required'
//     if (!form.accName) errors.accName = 'Account holder name is required'
//     if (!form.bank) errors.bank = 'Bank name is required'
//     if (!form.recieveracctnumber) errors.recieveracctnumber = 'Account number is required'
//     if (!form.routineNumber) errors.routineNumber = 'Routing number is required'

//     const amountNum = Number(form.amount)
//     if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
//       errors.amount = 'Enter a valid amount'
//     }

//     setFormError(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handleSubmitWithdraw = async () => {
//     if (!validate()) return

//     const payload = { country: form.country, accName: form.accName, bank: form.bank, recieveracctnumber: form.recieveracctnumber, routineNumber: form.routineNumber, amount: Number(form.amount), }
//     try {
//       setSubmitting(true)
//       await transact_urls.bankWithdrawal(payload)
//       setForm(initialWithdrawForm)
//       close()
//     } catch (error) {
//       ErrorAlert((error as Error).message)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <div className="">
//       <Modal size="32rem" centered withCloseButton={false} opened={opened} onClose={close}>
//         <div>
//           <div className="mb-6 text-center text-2xl font-semibold">Withdrawal Request</div>
//           <form onSubmit={(e) => { e.preventDefault(); handleSubmitWithdraw() }}>
//             <Forminput error={formError.country} content="Country" type='text'  placeholder="Country" value={form.country} onChange={handleChange('country')} />
//             <Forminput error={formError.accName} content="Account Holder Name" type='text' placeholder="Account Holder Name" value={form.accName} onChange={handleChange('accName')}/>
//             <Forminput error={formError.bank} content="Bank Name" placeholder="Bank Name" value={form.bank} onChange={handleChange('bank')}/>
//             <Forminput error={formError.recieveracctnumber} content="Account Number" type='number' placeholder="Account Number" value={form.recieveracctnumber} onChange={handleChange('recieveracctnumber')}/>
//             <Forminput error={formError.routineNumber} content="Routing Number" placeholder="Routing Number" type='number' value={form.routineNumber} onChange={handleChange('routineNumber')}/>
//             <Forminput error={formError.amount} content="Amount" placeholder="$0.00" type="number" value={form.amount} onChange={handleChange('amount')}/>
//             <Formbutton title={submitting ? 'Submitting...' : 'Submit Withdrawal'} />
//           </form>
//         </div>
//       </Modal>

//       <div className="min-h-screen bg-[#eef1f3] py-5 pb-24">
//         <div className="relative px-6 pt-6 pb-10 ">
//           <h1 className="max-w-[65%] lg:text-3xl text-xl texce font-medium leading-snug text-slate-800">Move your money with ease</h1>
//           <svg className="absolute right-6 top-4 h-28 w-32" viewBox="0 0 120 120">
//             <polygon points="90,30 120,90 60,90" fill="#0f7a52" opacity="0.9" />
//             <polygon points="70,50 100,110 40,110" fill="#0a5c3e" opacity="0.6" />
//             <path d="M60 15 L85 25 V60 C85 80 73 92 60 98 C47 92 35 80 35 60 V25 Z" fill="#1d4ed8" />
//             <path d="M60 15 V98 C73 92 85 80 85 60 V25 Z" fill="#3b82f6" />
//             <path d="M50 55 l7 7 14 -14" stroke="#0a1a3c" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </div>

//         <div className="bg-white px-6 py-5">
//           <p className="text-sm italic text-slate-700">
//             <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
//             FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
//             Sachs Bank USA, Salt Lake City Branch.
//           </p>
//         </div>

//         <div className="bg-white" onClick={open}>
//           <button className="flex w-full items-center justify-between px-6 py-6">
//             <div className="flex items-center gap-4">
//               <HiOutlineArrowsRightLeft className="text-xl text-slate-700" />
//               <div className="text-left">
//                 <p className="text-slate-800">Make a transfer</p>
//                 <p className="text-sm text-slate-500">Move money to/from savings</p>
//               </div>
//             </div>
//             <HiOutlineChevronRight className="text-slate-400" />
//           </button>
//         </div>

//         <div className="mt-4 bg-white">
//           <h2 className="px-6 pt-6 pb-3 text-2xl font-semibold text-slate-800">Transactions</h2>

//           {isLoading && <p className="px-6 py-6 text-sm text-slate-500">Loading transactions...</p>}

//           {!isLoading && transactions.length === 0 && (
//             <p className="px-6 py-6 text-sm text-slate-500">No transactions yet.</p>
//           )}

//           {grouped.map(([date, txs]) => (
//             <div key={date}>
//               <div className="bg-[#eef1f3] px-6 py-3">
//                 <p className="text-sm text-slate-600">{formatDateHeader(date)}</p>
//               </div>

//               {txs.map((tx) => {
//                 const isWithdrawal = tx.title?.toLowerCase() === 'withdrawal'
//                 return (
//                   <div key={tx.id} className="flex items-center justify-between border-b border-slate-100 px-6 py-5 last:border-b-0">
//                     <div className="flex items-start gap-4">
//                       <span className={`mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${isWithdrawal ? 'bg-red-100' : 'bg-emerald-100'}`}>
//                         <HiOutlineArrowPath className={`text-lg ${isWithdrawal ? 'text-red-600' : 'text-emerald-600'}`} />
//                       </span>
//                       <div>
//                         <p className="text-[15px] font-medium text-slate-800">
//                           {isWithdrawal ? (
//                             'Withdrawal Request'
//                           ) : (
//                             <>
//                               {tx.sendername || 'Admin Panel'}
//                               {tx.acctnumber && (
//                                 <>
//                                   {' '}·{' '}
//                                   {'*'.repeat(Math.max(tx.acctnumber.length - 4, 0))}
//                                   {tx.acctnumber.slice(-4)}
//                                 </>
//                               )}
//                             </>
//                           )}
//                         </p>
//                         <p className="mt-1 text-sm text-slate-500 capitalize">{tx.status}</p>
//                         <p className={`mt-1 text-[16px] font-semibold ${isWithdrawal ? 'text-red-600' : 'text-emerald-600'}`}>
//                           {isWithdrawal ? '-' : '+'}$
//                           {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                         </p>
//                       </div>
//                     </div>
//                     <Link to={`/user/transaction/${tx.id}`} className="rounded-lg border border-slate-300 px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
//                       Track
//                     </Link>
//                   </div>
//                 )
//               })}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }



import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { HiOutlineArrowsRightLeft, HiOutlineChevronRight, HiOutlineArrowPath } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router'
import { transact_urls } from '~/component/endpoints/transact'
import Formbutton from '~/component/general/form-button'
import Forminput from '~/component/general/form-input'
import type { Transaction } from '../../../global'
import { ErrorAlert } from '~/component/utils'
import { useSelector } from 'react-redux'
import type { RootState } from '~/lib/store'

function formatDateHeader(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {}
  transactions.forEach((tx) => { const key = tx.date; if (!groups[key]) groups[key] = []; groups[key].push(tx) })
  return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
}

const initialWithdrawForm = { country: '', accName: '', bank: '', recieveracctnumber: '', routineNumber: '', amount: '', }
type WithdrawField = keyof typeof initialWithdrawForm

// letters, spaces, apostrophes, hyphens only — no digits/symbols
const TEXT_ONLY_REGEX = /[^a-zA-Z\s'-]/g
const TEXT_ONLY_FIELDS: WithdrawField[] = ['country', 'accName']

export default function Transfer() {
  const {user} = useSelector((state: RootState) => state.data)
  const navigate = useNavigate()

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['all-transactions'],
    queryFn: async () => {
      const res = await transact_urls.getAllUserTransact()
      return res.data.msg || []
    },
  })

  const grouped = groupByDate(transactions)
  const [opened, { open, close }] = useDisclosure(false)
  const [kycNoticeOpened, { open: openKycNotice, close: closeKycNotice }] = useDisclosure(false)

  const [form, setForm] = useState(initialWithdrawForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<Record<string, string>>({})

  const isVerified = user?.verified === 'verified'

  const handleTransferClick = () => {
    if (!isVerified) {
      openKycNotice()
      return
    }
    open()
  }

  const handleChange = (field: WithdrawField) => (arg: any) => {
    let nextValue = arg
    if (arg && typeof arg === 'object') {
      if ('target' in arg) nextValue = arg.target.value
      else if ('value' in arg) nextValue = arg.value
    }

    if (TEXT_ONLY_FIELDS.includes(field)) {
      nextValue = String(nextValue).replace(TEXT_ONLY_REGEX, '')
    }

    setForm((prev) => ({ ...prev, [field]: nextValue }))
    setFormError((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!form.country) errors.country = 'Country is required'
    if (!form.accName) errors.accName = 'Account holder name is required'
    if (!form.bank) errors.bank = 'Bank name is required'
    if (!form.recieveracctnumber) errors.recieveracctnumber = 'Account number is required'
    if (!form.routineNumber) errors.routineNumber = 'Routing number is required'

    const amountNum = Number(form.amount)
    if (!form.amount || isNaN(amountNum) || amountNum <= 0) {
      errors.amount = 'Enter a valid amount'
    }

    setFormError(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitWithdraw = async () => {
    if (!isVerified) {
      close()
      openKycNotice()
      return
    }
    if (!validate()) return

    const payload = { country: form.country, accName: form.accName, bank: form.bank, recieveracctnumber: form.recieveracctnumber, routineNumber: form.routineNumber, amount: Number(form.amount), }
    try {
      setSubmitting(true)
      await transact_urls.bankWithdrawal(payload)
      setForm(initialWithdrawForm)
      close()
    } catch (error) {
      ErrorAlert((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="">
      <Modal size="32rem" centered withCloseButton={false} opened={opened} onClose={close}>
        <div>
          <div className="mb-6 text-center text-2xl font-semibold">Withdrawal Request</div>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitWithdraw() }}>
            <Forminput error={formError.country} content="Country" type='text'  placeholder="Country" value={form.country} onChange={handleChange('country')} />
            <Forminput error={formError.accName} content="Account Holder Name" type='text' placeholder="Account Holder Name" value={form.accName} onChange={handleChange('accName')}/>
            <Forminput error={formError.bank} content="Bank Name" placeholder="Bank Name" value={form.bank} onChange={handleChange('bank')}/>
            <Forminput error={formError.recieveracctnumber} content="Account Number" type='number' placeholder="Account Number" value={form.recieveracctnumber} onChange={handleChange('recieveracctnumber')}/>
            <Forminput error={formError.routineNumber} content="Routing Number" placeholder="Routing Number" type='number' value={form.routineNumber} onChange={handleChange('routineNumber')}/>
            <Forminput error={formError.amount} content="Amount" placeholder="$0.00" type="number" value={form.amount} onChange={handleChange('amount')}/>
            <Formbutton title={submitting ? 'Submitting...' : 'Submit Withdrawal'} />
          </form>
        </div>
      </Modal>

      <Modal size="26rem" centered withCloseButton={false} opened={kycNoticeOpened} onClose={closeKycNotice}>
        <div className="flex flex-col items-center px-2 py-4 text-center">
          <div className="mb-2 text-lg font-semibold text-slate-800">KYC Verification Required</div>
          <p className="mb-6 text-sm text-slate-500">
            You need to submit your KYC documents before you can make a transfer. You can do this from Settings → Verify Identity.
          </p>
          <div className="flex w-full gap-3">
            <button onClick={closeKycNotice} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Close
            </button>
            <button onClick={() => { closeKycNotice(); navigate('/user/profile') }} className="flex-1 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800">
              Go to Settings
            </button>
          </div>
        </div>
      </Modal>

      <div className="min-h-screen bg-[#eef1f3] py-5 pb-24">
        <div className="relative px-6 pt-6 pb-10 ">
          <h1 className="max-w-[65%] lg:text-3xl text-xl texce font-medium leading-snug text-slate-800">Move your money with ease</h1>
          <svg className="absolute right-6 top-4 h-28 w-32" viewBox="0 0 120 120">
            <polygon points="90,30 120,90 60,90" fill="#0f7a52" opacity="0.9" />
            <polygon points="70,50 100,110 40,110" fill="#0a5c3e" opacity="0.6" />
            <path d="M60 15 L85 25 V60 C85 80 73 92 60 98 C47 92 35 80 35 60 V25 Z" fill="#1d4ed8" />
            <path d="M60 15 V98 C73 92 85 80 85 60 V25 Z" fill="#3b82f6" />
            <path d="M50 55 l7 7 14 -14" stroke="#0a1a3c" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="bg-white px-6 py-5">
          <p className="text-sm italic text-slate-700">
            <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
            FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
            Sachs Bank USA, Salt Lake City Branch.
          </p>
        </div>

        <div className="bg-white" onClick={handleTransferClick}>
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

        <div className="mt-4 bg-white">
          <h2 className="px-6 pt-6 pb-3 text-2xl font-semibold text-slate-800">Transactions</h2>

          {isLoading && <p className="px-6 py-6 text-sm text-slate-500">Loading transactions...</p>}

          {!isLoading && transactions.length === 0 && (
            <p className="px-6 py-6 text-sm text-slate-500">No transactions yet.</p>
          )}

          {grouped.map(([date, txs]) => (
            <div key={date}>
              <div className="bg-[#eef1f3] px-6 py-3">
                <p className="text-sm text-slate-600">{formatDateHeader(date)}</p>
              </div>

              {txs.map((tx) => {
                const isWithdrawal = tx.title?.toLowerCase() === 'withdrawal'
                return (
                  <div key={tx.id} className="flex items-center justify-between border-b border-slate-100 px-6 py-5 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <span className={`mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${isWithdrawal ? 'bg-red-100' : 'bg-emerald-100'}`}>
                        <HiOutlineArrowPath className={`text-lg ${isWithdrawal ? 'text-red-600' : 'text-emerald-600'}`} />
                      </span>
                      <div>
                        <p className="text-[15px] font-medium text-slate-800">
                          {isWithdrawal ? (
                            'Withdrawal Request'
                          ) : (
                            <>
                              {tx.sendername || 'Admin Panel'}
                              {tx.acctnumber && (
                                <>
                                  {' '}·{' '}
                                  {'*'.repeat(Math.max(tx.acctnumber.length - 4, 0))}
                                  {tx.acctnumber.slice(-4)}
                                </>
                              )}
                            </>
                          )}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 capitalize">{tx.status}</p>
                        <p className={`mt-1 text-[16px] font-semibold ${isWithdrawal ? 'text-red-600' : 'text-emerald-600'}`}>
                          {isWithdrawal ? '-' : '+'}$
                          {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
    </div>
  )
}