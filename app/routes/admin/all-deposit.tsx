import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Menu, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link } from 'react-router'
import Table from '~/component/table/Table'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import { ErrorAlert, formatDate, HotAlert } from '~/component/utils'
import { transact_urls } from '~/component/endpoints/transact'

const Headers = ['Title', 'Name', 'Amount', 'Status', 'TxID', 'Date', 'Action', '']

const statusStyle = (status: string) => {
    switch (status) {
        case 'successful': return 'bg-green-50 text-green-700'
        case 'pending': return 'bg-yellow-50 text-yellow-700'
        default: return 'bg-red-50 text-red-700'
    }
}

export default function AllDeposit() {
    const queryClient = useQueryClient()
    const [note, setNote] = useState('')
    const [selectedDeposit, setSelectedDeposit] = useState<any>(null)
    const [declineOpened, { open: openDecline, close: closeDecline }] = useDisclosure(false)
    const [verifyingId, setVerifyingId] = useState<string | null>(null)

    const { data: deposit = [] } = useQuery({
        queryKey: ['deposits'],
        queryFn: async () => {
            const res = await transact_urls.getAllDeposit()
            return res.data.msg
        },
    })

    const verifyDeposit = async (item: any) => {
        setVerifyingId(item.id)
        try {
            const payload = { userid: item.user, depositid: item.id }
            const res = await transact_urls.confirmDeposit(payload)
            if (res.data.status === 200 || res.status === 200) {
                HotAlert(res.data.msg)
                queryClient.invalidateQueries({ queryKey: ['deposits'] })
            } else {
                ErrorAlert(res.data.msg)
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        } finally {
            setVerifyingId(null)
        }
    }

    const declineDeposit = async (item: any) => {
        if (!item) return ErrorAlert('No deposit selected')
        try {
            const payload = { userid: item.user, depositid: item.id, note }
            const res = await transact_urls.declineDeposit(payload)
            if (res.data.status === 404 || res.data.status === 400) {
                ErrorAlert(res.data.msg)
            } else if (res.data.status === 200 || res.status === 200) {
                setNote('')
                setSelectedDeposit(null)
                closeDecline()
                HotAlert(res.data.msg)
                queryClient.invalidateQueries({ queryKey: ['deposits'] })
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    return (
        <div>
            {/* Decline modal */}
            <Modal size="30rem" centered withCloseButton={false} opened={declineOpened} onClose={closeDecline}>
                <div className="my-2">
                    <div className="text-[1.3rem] font-bold text-center mb-1 text-gray-900">Decline Deposit</div>
                    <p className="text-sm text-gray-500 text-center mb-5">
                        {selectedDeposit ? `${selectedDeposit.depositor?.firstname || 'this user'} — $${selectedDeposit.amount}` : ''}
                    </p>
                    <label className="font-medium text-sm text-gray-700">Reason for declining</label>
                    <textarea
                        className="w-full border border-gray-200 rounded-xl p-3 mt-2 outline-none focus:border-[#7c5cf0] transition-colors"
                        rows={4}
                        placeholder="Enter reason..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    <div className="flex gap-3 mt-5">
                        <button onClick={closeDecline} className="w-full py-2.5 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                        <button onClick={() => declineDeposit(selectedDeposit)} className="w-full py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">Submit</button>
                    </div>
                </div>
            </Modal>

            <div className="m-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[1.9rem] font-semibold text-gray-900">All Deposits</div>
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
                                {deposit.length > 0 ? (
                                    deposit.map((item: any, index: number) => (
                                        <Tr key={index} last={index === deposit.length - 1}>
                                            <Td className="capitalize text-gray-700">{item.title}</Td>
                                            <Td className="font-medium text-gray-900">{item.depositor?.firstname} {item.depositor?.lastname}</Td>
                                            <Td className="font-semibold text-gray-900">${item.amount}</Td>
                                            <Td>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </Td>
                                            <Td className="truncate max-w-[120px] text-gray-500 font-mono text-sm">{item.txid}</Td>
                                            <Td className="text-gray-500">{formatDate(item.date)}</Td>
                                            <Td>
                                                {item.status === 'pending' ? (
                                                    <Menu shadow="md" width={180} position="bottom-end">
                                                        <Menu.Target>
                                                            <button
                                                                disabled={verifyingId === item.id}
                                                                className="text-[#7c5cf0] font-semibold text-sm hover:underline disabled:opacity-50 cursor-pointer"
                                                            >
                                                                {verifyingId === item.id ? 'Verifying…' : 'Update Status'}
                                                            </button>
                                                        </Menu.Target>
                                                        <Menu.Dropdown>
                                                            <Menu.Item onClick={() => verifyDeposit(item)}>Verify</Menu.Item>
                                                            <Menu.Item
                                                                color="red"
                                                                onClick={() => { setSelectedDeposit(item); openDecline() }}
                                                            >
                                                                Decline
                                                            </Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                ) : (
                                                    <span className="text-gray-300 text-sm">—</span>
                                                )}
                                            </Td>
                                            <Td>
                                                <Link to={`/admin/deposit/single-deposit/${item.id}`} className="text-[#7c5cf0] font-semibold text-sm hover:underline">
                                                    View
                                                </Link>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr last>
                                        <Td>
                                            <div className="py-6 text-center text-gray-400">No deposits found</div>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}