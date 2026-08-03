import { Menu, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Link, useParams } from 'react-router'
import { Admin_urls } from '~/component/endpoints/admin'
import { BaseUrl } from '~/component/Apis'
import { ErrorAlert, HotAlert } from '~/component/utils'
import { FaBackward } from 'react-icons/fa'
import { BsArrowLeft } from 'react-icons/bs'

// documents are served as static files off the API root, not under /api
const DocumentBaseUrl = BaseUrl.replace(/\/api$/, '')

export default function Singleuser() {
    const [declineOpened, { open: openDecline, close: closeDecline }] = useDisclosure(false)
    const [note, setNote] = React.useState('')
    const { id } = useParams()

    const { data: user, isLoading } = useQuery({
        queryKey: ['single-user', id],
        queryFn: async () => {
            const res = await Admin_urls.getSingleUser(id as string)
            return res.data.msg
        },
        enabled: !!id,
    })

    const queryClient = useQueryClient()
    const [opened, { open, close }] = useDisclosure(false)

    const refresh = () => queryClient.invalidateQueries({ queryKey: ['single-user', id] })

    const deleteKyc = async () => {
        try {
            const payload = { userid: id }
            const res = await Admin_urls.deleteKyc(payload)
            if (res.status === 200) {
                HotAlert(res.data.msg)
                close()
                refresh()
            } else {
                ErrorAlert(res.data.msg)
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    const ApproveKyc = async () => {
        try {
            const payload = {
                userid: id,
                tag: 'verify',
            }
            const res = await Admin_urls.updateKycStatus(payload)
            if (res.status === 200) {
                HotAlert(res.data.msg)
                refresh()
            } else {
                ErrorAlert(res.data.msg)
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    const DeclineKyc = async () => {
        if (!note.trim()) return ErrorAlert('Please provide a reason')

        try {
            const payload = {
                userid: id,
                tag: 'decline',
                note: note,
            }
            const res = await Admin_urls.updateKycStatus(payload)
            if (res.status === 200) {
                HotAlert(res.data.msg)
                setNote('')
                closeDecline()
                refresh()
            } else {
                ErrorAlert(res.data.msg)
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    if (isLoading) {
        return <div className="mt-10 text-center text-lg font-semibold">Loading...</div>
    }

    if (!user) {
        return <div className="mt-10 text-center text-lg font-semibold">User not found.</div>
    }

    const isSubmitted = user.submitted === 'true'
    const isVerified = user.verified === 'verified'
    const isDeclined = user.verified === 'declined'
    const isPending = isSubmitted && !isVerified && !isDeclined

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
                            <p>This action cannot be undone, and the user will be able to submit new documents.</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 mt-4">
                            <div onClick={close} className="bg-darkgray w-full rounded-full py-2.5 font-semibold text-center cursor-pointer">Cancel</div>
                            <div onClick={deleteKyc} className="bg-red-800 w-full rounded-full py-2.5 font-semibold text-center cursor-pointer text-white">Delete</div>
                        </div>
                    </div>
                </div>
            </Modal>
            <Link to='/admin/all-user' className=""><BsArrowLeft size={24} /></Link>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="lg:text-[2rem] text-xl font-semibold">{user?.firstname} {user?.lastname}</div>

                {isSubmitted && (
                    <div className="flex items-center gap-3">
                        {isPending && (
                            <Menu>
                                <Menu.Target>
                                    <button className="bg-darkgray rounded-full py-2.5 px-6 font-semibold text-center cursor-pointer text-white">
                                        Review KYC
                                    </button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item onClick={ApproveKyc}>Approve</Menu.Item>
                                    <Menu.Item onClick={openDecline}>Decline</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        )}
                        <div onClick={open} className="bg-red-800 rounded-full py-2.5 px-6 font-semibold text-center cursor-pointer text-white">
                            Delete KYC
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6">
                {/* {!isSubmitted ? (
                    <div className="font-semibold text-xl text-slate-500">User has not submitted their KYC documents.</div>
                ) : isVerified ? (
                    <div className="bg-lime-light border border-discount p-5 rounded-xl">
                        <div className="text-primary text-xl font-bold mb-2">✅ KYC Verified</div>
                        <p className="text-primary mt-2">This user has successfully completed identity verification.</p>
                    </div>
                ) : isDeclined ? (
                    <div className="bg-red-50 border border-red-200 p-5 rounded-xl">
                        <div className="text-red-700 text-xl font-bold mb-2">❌ KYC Declined</div>
                        {user?.note && (
                            <p className="text-red-700 mt-2"><span className="font-semibold">Reason:</span> {user.note}</p>
                        )}
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-4">
                        <div className="text-amber-700 font-semibold">⏳ Pending review</div>
                    </div>
                )}

                {isSubmitted && (user?.frontphoto || user?.backphoto) && (
                    <div className="flex items-center w-full gap-10 mt-5">
                        <div className="text-[1.1rem] font-semibold w-full">
                            <div className="mb-2">Front Image</div>
                            <img
                                className="h-[20rem] w-full object-cover rounded-lg border"
                                src={`${DocumentBaseUrl}/documents/${user?.frontphoto}`}
                                alt="Front of ID"
                            />
                        </div>

                        <div className="text-[1.1rem] font-semibold w-full">
                            <div className="mb-2">Back Image</div>
                            <img
                                className="h-[20rem] w-full object-cover rounded-lg border"
                                src={`${DocumentBaseUrl}/documents/${user?.backphoto}`}
                                alt="Back of ID"
                            />
                        </div>
                    </div>
                )} */}

                {isSubmitted && (user?.frontphoto || user?.backphoto) ? (
                    <div className="lg:flex items-center w-full gap-10 mt-5">
                        <div className="text-[1.1rem] font-semibold w-full">
                            <div className="mb-2">Front Image</div>
                            <img
                                className="h-[20rem] w-full object-cover rounded-lg border"
                                src={`${DocumentBaseUrl}/public/documents/${user?.frontphoto}`}
                                alt="Front of ID"
                            />
                        </div>

                        <div className="text-[1.1rem] mt-4 lg:mt-0 font-semibold w-full">
                            <div className="mb-2">Back Image</div>
                            <img
                                className="h-[20rem] w-full object-cover rounded-lg border"
                                src={`${DocumentBaseUrl}/public/documents/${user?.backphoto}`}
                                alt="Back of ID"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="bg-lightgray/50 border border-lightest p-6 rounded-xl mt-5 text-center">
                        <div className="font-semibold text-slate-500">No KYC documents uploaded yet.</div>
                    </div>
                )}
            </div>
        </div>
    )
}
