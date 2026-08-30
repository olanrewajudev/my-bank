import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router'
import { Admin_urls } from '~/component/endpoints/admin'
import Table from '~/component/table/Table'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'
import { formatAmount } from '~/component/utils'

const Headers = ['Name', 'Email', 'Last Login', 'Phone', 'Role', 'Balance', 'Action']

export default function AllKyc() {
    const { data: user = [] } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const res = await Admin_urls.getAllUser()
            return res.data.msg
        },
    })

    return (
        <div>
            <div className="m-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[1.9rem] font-semibold text-gray-900">All Users Kyc</div>
                </div>

                <div className="border rounded-2xl border-gray-200 bg-white">
                    <div className="w-full overflow-x-auto no-scrolls">
                        <Table>
                            <Thead>
                                <Tr header last={false}>
                                    {Headers.map((h, i) => (
                                        <Td key={i} className="font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</Td>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {user.length > 0 ? (
                                    user.map((item: any, index: React.Key) => (
                                        <Tr className="my-4" key={index} last={index === user.length - 1}>
                                            <Td className="font-medium text-gray-900">{item.firstName} {item.lastName}</Td>
                                            <Td className="text-gray-600">{item.email}</Td>
                                            <Td className="text-gray-500">{item.lastlogin || 'Not logged in yet'}</Td>
                                            <Td className="text-gray-600">{item.phone}</Td>
                                            <Td className="capitalize text-gray-700">{item.role}</Td>
                                            <Td className="font-semibold text-gray-900">${formatAmount(item.currbal)}</Td>
                                            <Td>
                                                <Link
                                                    to={`/admin/customer/single/${item.id}`}
                                                    className="text-[#7c5cf0] font-semibold text-sm hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr last><Td><div className="py-6 text-center text-gray-400">No users found</div></Td></Tr>
                                )}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}