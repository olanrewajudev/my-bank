import { Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import { transact_urls } from "~/component/endpoints/transact"
import Table from "~/component/table/Table"
import Tbody from "~/component/table/Tbody"
import Td from "~/component/table/Td"
import Thead from "~/component/table/Thead"
import Tr from "~/component/table/Tr"
import { ErrorAlert, formatDate, HotAlert } from "~/component/utils"

const Headers = ["Title", "Name", "Amount", "Status", "Date", "Action"]

const statusStyle = (status: string) => {
    switch (status) {
        case 'successful': return 'bg-green-50 text-green-700'
        case 'pending': return 'bg-yellow-50 text-yellow-700'
        default: return 'bg-red-50 text-red-700'
    }
}

export default function Withdraw() {
    const [note, setNote] = useState('')
    const [selectedDeposit, setSelectedDeposit] = useState<any>(null)
    const [declineOpened, { open: openDecline, close: closeDecline }] = useDisclosure(false)
    const [confirmingId, setConfirmingId] = useState<string | null>(null)

    const { data: transactions = [] } = useQuery({
        queryKey: ['admin-withdraws'],
        queryFn: async () => {
            const res = await transact_urls.getAllTransact()
            return res.data.msg
        },
    })

    const withdraw = transactions.filter(
        (item: any) => item.title?.toLowerCase() === 'withdrawal'
    )

    const verifyWithdrawal = async (item: any) => {
        setConfirmingId(item.id)
        try {
            const payload = { userid: item.user, withid: item.id }
            const res = await transact_urls.confirmWithdrawal(payload)
            if (res.status === 200) {
                HotAlert(res.data.msg)
            } else {
                ErrorAlert(res.data.msg)
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        } finally {
            setConfirmingId(null)
        }
    }

    const declineWithdrawal = async (item: any) => {
        if (!item) return ErrorAlert('No withdrawal selected')
        try {
            const payload = { userid: item.user, withid: item.id, note }
            const res = await transact_urls.declineWithdrawal(payload)
            if (res.status === 404 || res.status === 400) {
                ErrorAlert(res.data.msg)
            } else if (res.status === 200) {
                setNote('')
                setSelectedDeposit(null)
                closeDecline()
                HotAlert(res.data.msg)
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    return (
        <div>
            <Modal size="30rem" centered withCloseButton={false} opened={declineOpened} onClose={closeDecline}>
                <div className="my-2">
                    <div className="text-[1.3rem] font-bold text-center mb-1 text-gray-900">Decline Withdrawal</div>
                    <p className="text-sm text-gray-500 text-center mb-5">
                        {selectedDeposit ? `${selectedDeposit.sendername || 'this user'} — $${selectedDeposit.amount}` : ''}
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
                        <button onClick={() => declineWithdrawal(selectedDeposit)} className="w-full py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">Submit</button>
                    </div>
                </div>
            </Modal>

            <div className="m-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[1.9rem] font-semibold text-gray-900">All Withdrawals</div>
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
                                {withdraw.length > 0 ? (
                                    withdraw.map((item: any, index: number) => (
                                        <Tr key={index} last={index === withdraw.length - 1}>
                                            <Td className="capitalize text-gray-700">{item.title}</Td>
                                            <Td className="font-medium text-gray-900">{item.sendername || 'N/A'}</Td>
                                            <Td className="font-semibold text-gray-900">${item.amount}</Td>
                                            <Td>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </Td>
                                            <Td className="text-gray-500">{formatDate(item.date)}</Td>
                                            <Td>
                                                {item.status === 'pending' ? (
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => verifyWithdrawal(item)}
                                                            disabled={confirmingId === item.id}
                                                            className="text-[#7c5cf0] font-semibold text-sm hover:underline disabled:opacity-50"
                                                        >
                                                            {confirmingId === item.id ? 'Confirming…' : 'Confirm'}
                                                        </button>
                                                        <button
                                                            onClick={() => { setSelectedDeposit(item); openDecline() }}
                                                            className="text-red-600 font-semibold text-sm hover:underline"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300 text-sm">—</span>
                                                )}
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr last><Td><div className="py-6 text-center text-gray-400">No withdrawals found</div></Td></Tr>
                                )}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}