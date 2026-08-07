
import { Modal, Table } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router'
import { Admin_urls } from '~/component/endpoints/admin'
import { transact_urls } from '~/component/endpoints/transact'
import Formbutton from '~/component/general/form-button'
import Forminput from '~/component/general/form-input'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'
import { ErrorAlert, formatAmount, HotAlert } from '~/component/utils'

const Headers = ["Name", "Email", "Last Login", 'Phone', "Balance", 'Verified', '', '']

export default function AllUser() {
  const [opened, { open, close }] = useDisclosure(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const queryClient = useQueryClient()

  const { data: user = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await Admin_urls.getAllUser()
      return res.data.msg
    },
  })

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { userid: '', username: '', acctnumber: '', amount: '', sendername: '' },
    validate: {
      amount: value => !value ? 'Amount is required' : Number(value) <= 0 ? 'Amount must be greater than 0' : null,
      sendername: value => !value ? 'Sender Name is required' : null,
    }
  })

  function handleOpenTopup(item: any) {
    form.setValues({
      userid: item.id,
      username: `${item.firstname} ${item.lastname}`,
      acctnumber: item.acctnumber,
      amount: '',
      sendername: '',
    })
    open()
  }

  async function HandleSubmission(values: typeof form.values) {
    setIsSubmitting(true)
    try {
      const res = await transact_urls.topup(values)
      if (res.status === 200) {
        HotAlert(res.data.msg || 'Funds added successfully')
        form.reset()
        close()
        queryClient.invalidateQueries({ queryKey: ['all-users'] })
      } else {
        ErrorAlert(res.data.msg)
      }
    } catch (error) {
      ErrorAlert((error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Modal size={'32rem'} centered withCloseButton={false} opened={opened} onClose={close}>
        <div className="my-4">
          <div className="text-error text-[1.5rem] font-bold text-center mb-2">Add Funds</div>
          <form onSubmit={form.onSubmit(HandleSubmission)}>
            <Forminput content="User" error='' {...form.getInputProps('username')} />
            <div className="mt-4"> <Forminput content="Account Number" error=''   {...form.getInputProps('acctnumber')} /></div>
            <div className="mt-4"> <Forminput content="Sender Name" type="text" error={form.errors.sendername?.toString() || ''}   {...form.getInputProps('sendername')} placeholder="Enter sender name" /></div>
            <div className="mt-4"><Forminput content="Amount" type="number" error={form.errors.amount?.toString() || ''} {...form.getInputProps('amount')} placeholder="Enter amount"/></div>
            <div className="space-y-3 mt-14"><Formbutton title="Continue" className='bg-blue text-white font-bold' loading={isSubmitting} /></div>
          </form>
        </div>
      </Modal>
      <div className="m-5">
        <div className="flex items-center justify-between mb-4"><div className="text-[1.9rem] font-semibold">All Users</div></div>
        <div className="border rounded-2xl border-gray-200">
          <div className="border rounded-2xl border-gray-200 m-5">
            <div className="overflow-x-auto w-full no-scrolls">
              <Table>
                <Thead><Tr header last={false}>{Headers.map((h, i) => (<Td key={i} className="font-semibold">{h}</Td>))}</Tr></Thead>
                <Tbody>
                  {user.length > 0 ? (
                    user.map((item: any, index: React.Key) => (
                      <Tr className='my-4' key={index} last={index === user.length - 1}>
                        <Td>{item.firstname} {item.lastname}</Td>
                        <Td>{item.email}</Td>
                        <Td>{item.lastlogin ? '' : 'not logged in yet'}</Td>
                        <Td>{item.phone}</Td>
                        <Td>${formatAmount(item.currbal)}</Td>
                        <Td>{item.verified}</Td>
                        <Td><Link className='text-primary font-semibold' to={`/admin/all-user/${item.id}`}>View</Link></Td>
                        <Td><button type="button" className='text-primary font-semibold' onClick={() => handleOpenTopup(item)}>Update Balance</button></Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr last><Td><div className="text-lg">No user is added yet</div></Td></Tr>
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