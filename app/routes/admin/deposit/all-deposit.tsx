import { Menu } from "@mantine/core"
import React, { useState } from "react"
import type { AuthPosturl } from "~/component/Apis"
import Table from "~/component/table/Table"
import Tbody from "~/component/table/Tbody"
import Td from "~/component/table/Td"
import Thead from "~/component/table/Thead"
import Tr from "~/component/table/Tr"
import {Link} from 'react-router'
import { ErrorAlert, HotAlert } from "~/component/utils"
import { Admin_urls } from "~/component/endpoints/admin"
import { useQuery } from "@tanstack/react-query"
const Headers = ["Title", 'Name', "Amount", "Status", "TxID", "Date", '', '']
export default function AllDeposit() {
  const [note, setNote] = React.useState('')
  const [selectedDeposit, setSelectedDeposit] = useState<any>(null)

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
     
      <div>


        <div className="m-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[1.9rem] font-semibold">All Deposit</div>
          </div>

          <div className="border rounded-2xl border-lightest">
            <div className="border rounded-2xl border-lightest m-5">
              <div className="overflow-x-auto w-full no-scrolls">
                <Table>
                  <Thead><Tr header last={false}>{Headers.map((h, i) => (<Td key={i} className="font-semibold">{h}</Td>))}</Tr></Thead>
                  {/* <Tbody>
                    {deposit.map((item: any, index: number) => (
                      <Tr key={index} last={index === deposit.length - 1}>
                        <Td>{item.title}</Td>
                        <Td>{item.tag?.firstName} {item.tag?.lastName}</Td>
                        <Td>${item.amount}</Td>
                        <Td><span className={`px-2 py-1 rounded text-xs ${item.status === 'pending' ? 'bg-yellow' : item.status === 'successful' ? 'bg-primary-dark text-white' : 'bg-error text-white'}`}> {item.status}</span></Td>
                        <Td className="truncate max-w-[120px]">{item.txid}</Td>
                         <Td>{formatDate(item.date)}</Td> 
                        <Td>
                          <Menu shadow="md" width={200}>
                            <Menu.Target><button className="text-primary-dark font-semibold">Update Status</button></Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item disabled={item.status !== 'pending'} onClick={() => verifyDeposit(item)}>Verify</Menu.Item>
                              <Menu.Item disabled={item.status !== 'pending'} onClick={() => { setSelectedDeposit(item), openDecline() }}>Decline</Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Td>
                        <Td><Link to={`/admin/deposit/single-deposit/${item.id}`} className='text-primary-dark font-semibold'>View</Link></Td>
                      </Tr>
                    ))}
                  </Tbody>  */}
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
