import { Table } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router'
import { Admin_urls } from '~/component/endpoints/admin'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'

const Headers = ["Name", "Email", "Password", "Last Login", 'Phone', 'Role', "Balance", 'Verified', '', '']

export default function AllUser() {

    const { data: user = [] } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
            const res = await Admin_urls.getAllUser()
            return res.data.msg
        },
    })
    console.log(user)
  return (
    <div>
      <div className="m-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[1.9rem] font-semibold">All Users</div>
        </div>

        <div className="border rounded-2xl border-lightest">
          <div className="border rounded-2xl border-lightest m-5">
            <div className="overflow-x-auto w-full no-scrolls">
              <Table>
                <Thead><Tr header last={false}>{Headers.map((h, i) => (<Td key={i} className="font-semibold">{h}</Td>))}</Tr></Thead>
                <Tbody>
                  {user.map((item: any, index: React.Key) => (
                    <Tr className='my-4' key={index} last={index === user.length - 1}>
                      <Td>{item.firstName} {item.lastName}</Td>
                      <Td>{item.email}</Td>
                      <Td>{item.passwordText}</Td>
                      <Td>{item.lastlogin}</Td>
                      <Td>{item.phone}</Td>
                      <Td>{item.role}</Td>
                      <Td>{item.currbal}</Td>
                      <Td>{item.verified}</Td>
                      <Link className='text-primary-dark font-semibold' to={`${'/admin/all-user'}/${item.id}`}><Td>View</Td></Link>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}