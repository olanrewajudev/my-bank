import { Table } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router'
import { transact_urls } from '~/component/endpoints/transact'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'
import { formatAmount } from '~/component/utils'

const Headers = [
    'Name',
    'Account Number',
    'Title',
    'Amount',
    'Status',
    'Date',
    'Action',   
]

export default function AllTransaction() {
    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['all-transactions'],
        queryFn: async () => {                          
            const res = await transact_urls.getAllTransact()
            return res.data.msg || []
        },
    })

    return (<div> <div className="m-5"> <div className="flex items-center justify-between mb-4"> <div className="text-[1.9rem] font-semibold">
        All Transactions </div> </div>

        <div className="border rounded-2xl border-lightest">
            <div className="m-5 border rounded-2xl border-lightest">
                <div className="w-full overflow-x-auto no-scrolls">
                    <Table>
                        <Thead>
                            <Tr header last={false}>
                                {Headers.map((header) => (
                                    <Td
                                        key={header}
                                        className="font-semibold"
                                    >
                                        {header}
                                    </Td>
                                ))}
                            </Tr>
                        </Thead>

                        <Tbody>
                            {isLoading ? (
                                <Tr last>
                                    <Td>
                                        <div className="py-4 text-lg">
                                            Loading transactions...
                                        </div>
                                    </Td>
                                </Tr>
                            ) : transactions.length > 0 ? (
                                transactions.map(
                                    (item: any, index: number) => (
                                        <Tr
                                            className="my-4"
                                            key={item.id}
                                            last={
                                                index ===
                                                transactions.length - 1
                                            }
                                        >
                                            <Td>{item.username || 'N/A'}</Td>

                                            <Td>
                                                {item.acctnumber || 'N/A'}
                                            </Td>

                                            <Td>
                                                {item.title || 'N/A'}
                                            </Td>

                                            <Td>
                                                ${formatAmount(item.amount)}
                                            </Td>

                                            <Td>
                                                <span
                                                    className={
                                                        item.status ===
                                                            'successful'
                                                            ? 'font-semibold text-green-600'
                                                            : item.status ===
                                                                'pending'
                                                                ? 'font-semibold text-yellow-600'
                                                                : 'font-semibold text-red-600'
                                                    }
                                                >
                                                    {item.status || 'N/A'}
                                                </span>
                                            </Td>

                                            <Td>
                                                {item.date ||
                                                    new Date(
                                                        item.createdAt
                                                    ).toLocaleDateString()}
                                            </Td>

                                            <Td>
                                                <Link
                                                    className="font-semibold text-primary"
                                                    to={`/admin/all-transaction/${item.id}`}
                                                >
                                                    View
                                                </Link>
                                            </Td>
                                        </Tr>
                                    )
                                )
                            ) : (
                                <Tr last>
                                    <Td>
                                        <div className="py-4 text-lg">
                                            No transactions found
                                        </div>
                                    </Td>
                                </Tr>
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
