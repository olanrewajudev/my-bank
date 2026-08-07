

import { Menu, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router"
import { transact_urls } from "~/component/endpoints/transact"
import Table from "~/component/table/Table"
import Tbody from "~/component/table/Tbody"
import Td from "~/component/table/Td"
import Thead from "~/component/table/Thead"
import Tr from "~/component/table/Tr"
import { ErrorAlert, formatDate, HotAlert } from "~/component/utils"
import type { RootState } from "~/lib/store"

const Headers = ["Title", "Name", "Amount", "Status", "Date", "", ""]

export default function Withdraw() {
    const queryClient = useQueryClient()
    const [note, setNote] = React.useState('')
    const [selectedDeposit, setSelectedDeposit] = useState<any>(null)
    const [declineOpened, { open: openDecline, close: closeDecline }] = useDisclosure(false)

    const { data: transactions = [] } = useQuery({
        queryKey: ['admin-withdraws'],
        queryFn: async () => {
            const res = await transact_urls.getAllTransact()
            return res.data.msg
        },
    })

    // only show withdrawal transactions
    const withdraw = transactions.filter(
        (item: any) => item.title?.toLowerCase() === 'withdrawal'
    )

    const { user } = useSelector((state: RootState) => state.data)

    const verifyWithdrawal = async (item: any) => {
        try {
            const payload = { userid: item.user, withid: item.tag }
            const res = await transact_urls.confirmWithdrawal(payload)
            if (res.data.status === 200) {
                HotAlert(res.data.msg)
            } else {
                ErrorAlert(res.data.msg)
            }
            queryClient.invalidateQueries({ queryKey: ['admin-withdraws'] })
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    const declineWithdrawal = async (item: any) => {
        if (!item) return ErrorAlert('No withdrawal selected')
        try {
            const payload = { userid: item.user, withid: item.tag, note }
            const res = await transact_urls.declineWithdrawal(payload)
            if (res.data.status === 404 || res.data.status === 400) {
                ErrorAlert(res.data.msg)
            } else if (res.data.status === 200) {
                setNote('')
                setSelectedDeposit(null)
                closeDecline()
                HotAlert(res.data.msg)
            }
            queryClient.invalidateQueries({ queryKey: ['admin-withdraws'] })
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }


    return (
        <div>
            <Modal size="32rem" centered opened={declineOpened} onClose={closeDecline} title="Decline Withdrawal">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="font-semibold">Reason for declining</label>
                        <textarea className="w-full border rounded-lg p-3 mt-2 outline-none" placeholder="Enter reason..." value={note} onChange={(e) => setNote(e.target.value)} />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={closeDecline} className="w-full py-2.5 rounded-full bg-darkgray font-semibold">Cancel</button>
                        <button onClick={() => declineWithdrawal(selectedDeposit)} className="w-full py-2.5 rounded-full bg-red-800 text-white font-semibold">Submit</button>
                    </div>
                </div>
            </Modal>
            <div>
                <div>
                    <div className="m-5">
                        <div className="flex items-center justify-between mb-4"><div className="text-[1.9rem] font-semibold">All Withdraw</div></div>
                        <div className="border rounded-2xl border-lightest">
                            <div className="border rounded-2xl border-lightest m-5">
                                <div className="overflow-x-auto w-full no-scrolls">
                                    <Table>
                                        <Thead><Tr header last={false}>{Headers.map((h, i) => (<Td key={i} className="font-semibold">{h}</Td>))}</Tr></Thead>
                                        <Tbody>
                                            {withdraw.map((item: any, index: number) => (
                                                <Tr key={index} last={index === withdraw.length - 1}>
                                                    <Td>{item.title}</Td>
                                                    <Td>{item.sendername || 'N/A'}</Td>
                                                    <Td>${item.amount}</Td>
                                                    <Td><span className={`px-2 py-1 rounded text-xs ${item.status === 'pending' ? 'bg-yellow-400' : item.status === 'successful' ? 'bg-green-800 text-white' : 'bg-red-800 text-white'}`}>{item.status}</span></Td>
                                                    <Td>{formatDate(item.date)}</Td>
                                                    <Td>
                                                        <div className="flex font-semibold items-center gap-3">
                                                            {item.status === 'pending' && (
                                                                <> <button onClick={() => verifyWithdrawal(item)} className="text-primary font-semibold">Confirm</button>
                                                                    <button onClick={() => { setSelectedDeposit(item); openDecline() }} className="text-red-800 font-semibold">Decline</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}