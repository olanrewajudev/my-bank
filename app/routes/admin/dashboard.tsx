import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FaUsers, FaMoneyBillWave, FaWallet, FaBoxOpen, FaBitcoin, FaCommentDots } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Admin_urls } from '~/component/endpoints/admin'
import { transact_urls } from '~/component/endpoints/transact'
import Table from '~/component/table/Table'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'
import { formatAmount } from '~/component/utils'
import type { RootState } from '~/lib/store'

const Headers = ['Name', 'Account Number', 'Title', 'Amount', 'Status', 'Date']

const statusStyle = (status: string) => {
    switch (status) {
        case 'successful': return 'bg-green-50 text-green-700'
        case 'pending': return 'bg-yellow-50 text-yellow-700'
        default: return 'bg-red-50 text-red-700'
    }
}

export default function AdminDashboard() {
    const { data: admindashboard = [] } = useQuery({
        queryKey: ['admin-dashboards'],
        queryFn: async () => {
            const res = await Admin_urls.adminDashboard()
            return res.data.msg
        },
    })
    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['all-transactions'],
        queryFn: async () => {
            const res = await transact_urls.getAllTransact()
            return res.data.msg || []
        },
    })

    const { user } = useSelector((state: RootState) => state.data)

    const getIcon = (title: string) => {
        switch (title) {
            case 'registered users': return <FaUsers size={20} />
            case 'total withdrawals':
            case 'total deposits': return <FaMoneyBillWave size={20} />
            case 'total wallets': return <FaWallet size={20} />
            case 'total packages': return <FaBoxOpen size={20} />
            case 'mining investments':
            case 'active mining':
            case 'in-active mining': return <FaBitcoin size={20} />
            case 'feedbacks': return <FaCommentDots size={20} />
            default: return <FaUsers size={20} />
        }
    }

    return (
        <div className="pt-6 px-5 pb-10">
            <div className="mb-6">
                <div className="text-[1.9rem] font-semibold text-gray-900">Welcome back, {user?.firstname}</div>
                <p className="text-gray-500 text-sm mt-1">Here's what's happening across your platform today.</p>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                {admindashboard.map((item: any, index: number) => (
                    <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#7c5cf0]/40 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                                style={{ background: item.color || '#7c5cf0' }}
                            >
                                {getIcon(item.title)}
                            </div>
                        </div>
                        <h2 className="text-[1.6rem] font-bold text-gray-900 leading-none">{item.total}</h2>
                        {item.totalAmounts && (
                            <p className="text-sm text-gray-400 mt-1">${formatAmount(item.totalAmounts)}</p>
                        )}
                        <div className="capitalize text-sm font-medium text-gray-500 mt-2">{item.title}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-gray-900">Recent Transactions</div>
                </div>
                <div className="border rounded-2xl border-gray-200 bg-white">
                    <div className="w-full overflow-x-auto no-scrolls">
                        <Table>
                            <Thead>
                                <Tr header last={false}>
                                    {Headers.map((header) => (
                                        <Td key={header} className="font-semibold text-gray-500 text-xs uppercase tracking-wide">{header}</Td>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {isLoading ? (
                                    <Tr last><Td><div className="py-6 text-center text-gray-400">Loading transactions...</div></Td></Tr>
                                ) : transactions.length > 0 ? (
                                    transactions.map((item: any, index: number) => (
                                        <Tr className="my-4" key={item.id} last={index === transactions.length - 1}>
                                            <Td className="font-medium text-gray-900">{item.username || 'N/A'}</Td>
                                            <Td className="text-gray-500">{item.acctnumber || 'N/A'}</Td>
                                            <Td className="capitalize text-gray-700">{item.title || 'N/A'}</Td>
                                            <Td className="font-semibold text-gray-900">${formatAmount(item.amount)}</Td>
                                            <Td>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle(item.status)}`}>
                                                    {item.status || 'N/A'}
                                                </span>
                                            </Td>
                                            <Td className="text-gray-500">{item.date || new Date(item.createdAt).toLocaleDateString()}</Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr last><Td><div className="py-6 text-center text-gray-400">No transactions found</div></Td></Tr>
                                )}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}