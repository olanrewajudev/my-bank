import { Button, Menu, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useSelector } from 'react-redux'
import { data, useParams } from 'react-router'
import { Admin_urls } from '~/component/endpoints/admin'
import { ErrorAlert, HotAlert } from '~/component/utils'
import type { RootState } from '~/lib/store'

export default function Singleuser() {
    const [declineOpened, { open: openDecline, close: closeDecline }] = useDisclosure(false)
    const [note, setNote] = React.useState('')
    const { id } = useParams()
    const {user  } = useSelector((state: RootState) => state.data)
  const queryClient = useQueryClient()
    const [opened, { open, close }] = useDisclosure(false)
    const deleteKyc = async () => {
        try {
            const payload = {
                'userid': id
            }
            const res = await Admin_urls.updateKycStatus(payload)
            if (res.status === 200) {
                HotAlert(res.data.msg)
                close()
                queryClient.invalidateQueries({queryKey: ['users']})
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }

    }
    const ApproveKyc = async () => {
        try {
            const payload = {
                userid: id,
                tag: 'verified',
            }

            const res = await Admin_urls.updateKycStatus(payload)

            if (res.status === 200) {
                HotAlert(res.data.msg)
                queryClient.invalidateQueries({ queryKey: ['users'] })
            }

        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }
    const DeclineKyc = async () => {
        if (!note.trim()) { return ErrorAlert('Please provide a reason') }

        try {
            const payload = {
                userid: id,
                tag: 'declined',
                note: note,
            }

            const res = await Admin_urls.updateKycStatus(payload)

            if (res.status === 200) {
                HotAlert(res.data.msg)
                setNote('')
                closeDecline()
                queryClient.invalidateQueries({ queryKey: ['users'] })
            }

        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }
    return (
        <div className='mt-4 mx-5'>
            <Modal size="32rem" centered opened={declineOpened} onClose={closeDecline} title="Decline KYC">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="font-semibold">Reason for declining</label>
                        <textarea
                            className="w-full border rounded-lg p-3 mt-2 outline-none"
                            placeholder="Enter reason..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={closeDecline}
                            className="w-full py-2.5 rounded-full bg-darkgray font-semibold"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={DeclineKyc}
                            className="w-full py-2.5 rounded-full bg-red-800 text-white font-semibold"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal size={'32rem'} centered withCloseButton={false} opened={opened} onClose={close}>
                <div className="my-4">
                    <div className="text-error text-[1.5rem] font-bold text-center mb-2">Delete KYC</div>
                    <div className="text-center">
                        <div className="mb-5">
                            <div className="font-semibold text-lg">Are you sure you want to delete this user's KYC?</div>
                            <p className="">This action cannot be undone.</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 mt-4">
                            <div onClick={close} className="bg-darkgray w-full rounded-full py-2.5 font-semibold text-center cursor-pointer ">Cancel</div>
                            <div onClick={deleteKyc} className="bg-red-800 w-full rounded-full py-2.5 font-semibold text-center cursor-pointer text-white">Delete</div>
                        </div>

                    </div>
                </div>
            </Modal>
            <div className="flex items-center justify-between">
                <div className="text-[2rem]  w-full font-semibold">{user?.firstname} {user?.lastname}</div>
                <div className="flex items-center gap-5 w-full">

                    <Menu>
                        <Menu.Target><button className="bg-primary-dark w-full rounded-full py-2.5 font-semibold text-center cursor-pointer text-white">Approve Kyc</button></Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item onClick={ApproveKyc}>Approve</Menu.Item>
                            <Menu.Item onClick={openDecline}>Decline</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <div onClick={open} className="bg-red-800 w-full rounded-full py-2.5 font-semibold text-center cursor-pointer text-white">Delete Kyc</div>
                </div>
            </div>
          
            {/* {user?.submitted == 'false' ? (
                <div className="font-semibold text-2xl">User has not submitted his or her KYC documents.</div>
            ) : user?.verified === 'verified' ? (
                <div className="bg-lime-light border border-discount p-5 rounded-xl">
                    <div className="text-primary-dark text-xl font-bold mb-2">✅ KYC Verified</div>
                    <div className="text-lg font-semibold">Document Type: {user?.type}</div>
                    <p className="text-primary-dark mt-2">This user has successfully completed identity verification.</p>
                </div>
            ) : (
                <div>
                    <div className="text-[1.2rem] font-bold my-4">Document Type: {user?.type}</div>
                    <div className="flex items-center w-full gap-10">
                        <div className="text-[1.2rem] font-semibold">
                            <div>Front Image</div>
                            <img className='h-[20rem] w-full object-cover' src={`${offlineServer}/documents/${user?.frontphoto}`} />
                        </div>

                        <div className="text-[1.2rem] font-semibold">
                            <div>Back Image</div>
                            <img className='h-[20rem] w-full object-cover' src={`${offlineServer}/documents/${user?.backphoto}`} />
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    )
}
