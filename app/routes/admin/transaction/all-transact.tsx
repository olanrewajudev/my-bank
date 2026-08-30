import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { transact_urls } from '~/component/endpoints/transact'
import Table from '~/component/table/Table'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'
import { formatAmount } from '~/component/utils'

const Headers = ['Name', 'Sender Name', 'Account Number', 'Title', 'Amount', 'Status', 'Date']

const statusStyle = (status: string) => {
    switch (status) {
        case 'successful': return 'bg-green-50 text-green-700'
        case 'pending': return 'bg-yellow-50 text-yellow-700'
        default: return 'bg-red-50 text-red-700'
    }
}

export default function AllTransaction() {
    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['all-transactions'],
        queryFn: async () => {
            const res = await transact_urls.getAllTransact()
            return res.data.msg || []
        },
    })

    return (
        <div>
            <div className="m-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[1.9rem] font-semibold text-gray-900">All Transactions</div>
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
                                            <Td className="text-gray-600">{item.sendername || 'N/A'}</Td>
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