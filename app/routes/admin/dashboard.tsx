import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FaUsers, FaMoneyBillWave, FaWallet, FaBoxOpen, FaBitcoin, FaCommentDots } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { Admin_urls } from '~/component/endpoints/admin'
import { transact_urls } from '~/component/endpoints/transact'
import Table from '~/component/table/Table'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'
import { formatAmount } from '~/component/utils'
import type { RootState } from '~/lib/store'

const Headers = [
    'Name',
    'Account Number',
    'Title',
    'Amount',
    'Status',
    'Date',
    'Action',
]
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

    console.log(admindashboard)

    const { user } = useSelector((state: RootState) => state.data)
    const getIcon = (title: string) => {
        switch (title) {
            case 'registered users':
                return <FaUsers size={22} />

            case 'total withdrawals':
            case 'total deposits':
                return <FaMoneyBillWave size={22} />

            case 'total wallets':
                return <FaWallet size={22} />

            case 'total packages':
                return <FaBoxOpen size={22} />

            case 'mining investments':
            case 'active mining':
            case 'in-active mining':
                return <FaBitcoin size={22} />

            case 'feedbacks':
                return <FaCommentDots size={22} />

            default:
                return <FaUsers size={22} />
        }
    }

    return (
        <div className="pt-5 mx-5">
            <div className="text-[2rem] font-semibold mb-5">Welcome back, {user?.firstname}</div>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {admindashboard.map((item: any, index: number) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: item.color }}>{getIcon(item.title)}</div>
                            <div className="text-right">
                                <h2 className="text-[1.5rem] font-bold">{item.total}</h2>
                                {item.totalAmounts && (<p className="text-[0.9rem] text-gray-500">{item.totalAmounts}</p>)}
                            </div>
                        </div>
                        <div className="capitalize text-[0.95rem] font-medium text-gray-700">{item.title}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <div className="text-xl font-bold mb-4">All Transaction</div>
                <div className="border rounded-2xl border-gray-200">
                    <div className="m-5 border rounded-2xl border-gray-200">
                        <div className="w-full overflow-x-auto no-scrolls">
                            <Table>
                                <Thead><Tr header last={false}> {Headers.map((header) => (<Td key={header} className="font-semibold"     >         {header}     </Td>))}</Tr></Thead>

                                <Tbody>
                                    {isLoading ? (
                                        <Tr last><Td><div className="py-4 text-lg">Loading transactions...</div></Td></Tr>
                                    ) : transactions.length > 0 ? (
                                        transactions.map(
                                            (item: any, index: number) => (
                                                <Tr className="my-4" key={item.id} last={index === transactions.length - 1}>
                                                    <Td>{item.username || 'N/A'}</Td>
                                                    <Td>{item.acctnumber || 'N/A'}</Td>
                                                    <Td>{item.title || 'N/A'}</Td>
                                                    <Td>${formatAmount(item.amount)}</Td>
                                                    <Td>
                                                        <span className={item.status === 'successful' ? 'font-semibold text-green-600' : item.status === 'pending' ? 'font-semibold text-yellow-600' : 'font-semibold text-red-600'}>
                                                            {item.status || 'N/A'}
                                                        </span>
                                                    </Td>
                                                    <Td> {item.date || new Date(item.createdAt).toLocaleDateString()}</Td>

                                                    <Td><Link className="font-semibold text-primary" to={`/admin/all-transaction/${item.id}`}>View</Link></Td>
                                                </Tr>
                                            )
                                        )
                                    ) : (
                                        <Tr last><Td><div className="py-4 text-lg">No transactions found</div></Td></Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}