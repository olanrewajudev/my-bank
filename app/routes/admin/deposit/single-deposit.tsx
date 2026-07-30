import React from 'react'
import { useParams } from 'react-router'
import { BiCheckCircle, BiTime, BiXCircle } from 'react-icons/bi'
import { FiArrowLeft, FiCopy } from 'react-icons/fi'
import { formatAmount } from '~/component/utils'
import { useQuery } from '@tanstack/react-query'
import {Link} from 'react-router'
export default function SingleDeposit() {
    const { depositid } = useParams()

      const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

    const copyText = async (text: string) => { navigator.clipboard.writeText(text) }

    // const statusColor = deposit?.status === 'approved' ? 'bg-primary-dark text-white' : deposit?.status === 'rejected' ? 'bg-error text-white' : 'bg-yellow-dark '

    return (
        <div className="w-full p-4 md:p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-lightest overflow-hidden">
                <div className="bg-linear-to-r from-yellow-dark to-primary-dark  p-6 text-white">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <Link to='/admin/deposit'>  <FiArrowLeft size={22} /></Link>
                                <h1 className="text-3xl font-bold">Deposit Details</h1>
                            </div>
                            <p className="text-sm opacity-90 mt-1">View complete deposit information</p>
                        </div>
                        {/* <div className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor}`}>
                            {deposit?.status === 'approved' && (<div className="flex items-center gap-1"><BiCheckCircle />Approved</div>)}
                            {deposit?.status === 'pending' && (<div className="flex items-center gap-1"><BiTime />Pending</div>)}
                            {deposit?.status === 'rejected' && (<div className="flex items-center gap-1"><BiXCircle />Rejected</div>)}
                        </div> */}
                    </div>
                </div>

                {/* <div className="grid md:grid-cols-2 gap-8 p-6">
                    <div>
                        <div className="border rounded-2xl flex items-center py-5 justify-center overflow-hidden bg-gray-50"><img src={`${offlineServer}/deposit/${deposit?.image}`} alt="Deposit Proof" className="object-contain" /></div>
                    </div>
                    <div className="space-y-5">
                        <div className="bg-gray-50 rounded-2xl p-5">
                            <p className="text-sm text-gray-500 mb-1">Amount</p>
                            <h2 className="text-3xl font-bold text-primary-dark">${formatAmount(deposit?.amount)}</h2>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-5">
                            <p className="text-sm text-gray-500 mb-1">Description</p>
                            <p className="text-gray-800 leading-relaxed">{deposit?.content}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
                                    <p className="text-sm break-all font-medium text-gray-800">{deposit?.txid}</p>
                                </div>
                                <button onClick={() => copyText(deposit?.txid)} className="min-w-[45px] h-[45px] rounded-xl bg-primary text-white flex items-center justify-center"><FiCopy /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <p className="text-sm text-gray-500 mb-1">Date</p>
                                <p className="font-semibold">{formatDate(deposit?.date)}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <p className="text-sm text-gray-500 mb-1">Submitted</p>
                                <p className="font-semibold capitalize">{deposit?.submitted}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <p className="text-sm text-gray-500 mb-1">Wallet ID</p>
                                <p className="font-semibold">#{deposit?.wallet}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <p className="text-sm text-gray-500 mb-1">Deposit ID</p>
                                <p className="font-semibold">#{deposit?.id}</p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}