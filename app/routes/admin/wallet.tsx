import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Drawer, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { LiaTimesSolid } from 'react-icons/lia'
import { useForm } from '@mantine/form'
import Forminput from '~/component/general/form-input'
import Formbutton from '~/component/general/form-button'
import Table from '~/component/table/Table'
import Thead from '~/component/table/Thead'
import Tr from '~/component/table/Tr'
import Tbody from '~/component/table/Tbody'
import Td from '~/component/table/Td'
import { ErrorAlert, HotAlert } from '~/component/utils'
import { Wallet_urls } from '~/component/endpoints/wallet'

const Headers = ['Name', 'Short Code', 'Address', 'Action']

type WalletFormType = {
    title: string
    short: string
    address: string
    id?: number
}

export default function AllWallet() {
    const queryClient = useQueryClient()
    const [opened, { open, close }] = useDisclosure()
    const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure()
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure()
    const [selectedWallet, setSelectedWallet] = React.useState<{ title: string; address: string; id: number } | null>(null)
    const [deleteTarget, setDeleteTarget] = React.useState<{ title: string; id: number } | null>(null)
    const [deletingId, setDeletingId] = React.useState<number | null>(null)

    const { data: wallet = [] } = useQuery({
        queryKey: ['wallets'],
        queryFn: async () => {
            const res = await Wallet_urls.getAllWallet()
            return res.data.msg
        },
    })

    const editForm = useForm<WalletFormType>({
        initialValues: { title: '', short: '', address: '' },
        validate: {
            title: value => !value ? 'Title is required' : null,
            short: value => !value ? 'Short is required' : null,
            address: value => !value ? 'Address is required' : null,
        }
    })

    const form = useForm<WalletFormType>({
        initialValues: { title: '', short: '', address: '' },
        validate: {
            title: value => !value ? 'Title is required' : null,
            short: value => !value ? 'Short note is required' : null,
            address: value => !value ? 'Address is required' : null,
        }
    })

    async function handleCreateWallet(values: typeof form.values) {
        try {
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('short', values.short)
            formData.append('address', values.address)

            const res = await Wallet_urls.addWallet(formData)

            if (res.data.status === 500) {
                ErrorAlert(res.data.msg)
            } else if (res.status === 200) {
                HotAlert(res.data.msg)
                queryClient.invalidateQueries({ queryKey: ['wallets'] })
                form.reset()
                close()
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    async function handleUpdateWallet(values: typeof editForm.values) {
        try {
            const formData = new FormData()
            formData.append('title', values.title)
            formData.append('short', values.short)
            formData.append('address', values.address)
            formData.append('id', String(values.id))

            const res = await Wallet_urls.updateWallet(formData)

            if (res.status === 200) {
                HotAlert(res.data.msg)
                queryClient.invalidateQueries({ queryKey: ['wallets'] })
                closeEdit()
                editForm.reset()
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        }
    }

    function handleDeleteClick(item: { title: string; id: number }) {
        setDeleteTarget(item)
        openDelete()
    }

    async function confirmDelete() {
        if (!deleteTarget) return
        setDeletingId(deleteTarget.id)
        try {
            const res = await Wallet_urls.deleteWallet(deleteTarget.id)
            if (res.status === 200) {
                HotAlert(res.data.msg)
                queryClient.invalidateQueries({ queryKey: ['wallets'] })
                closeDelete()
            } else {
                ErrorAlert(res.data.msg)
            }
        } catch (error) {
            ErrorAlert((error as Error).message)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div>
            {/* Create wallet */}
            <Drawer opened={opened} onClose={close} withCloseButton={false} position="right" size="28rem">
                <div className="flex items-center justify-between mb-1">
                    <div className="text-xl font-bold text-gray-900">New Wallet</div>
                    <button onClick={close} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                        <LiaTimesSolid size={20} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-6">Add a new wallet address customers can send funds to.</p>
                <form onSubmit={form.onSubmit(handleCreateWallet)} className="space-y-1">
                    <Forminput content="Title" error={form.errors.title?.toString() || ''} {...form.getInputProps('title')} placeholder="BTC" />
                    <div className="flex-1"><Forminput type="text" content="Address" error={form.errors.address?.toString() || ''} {...form.getInputProps('address')} placeholder="" /></div>
                    <div className="flex-1"><Forminput type="text" content="Short Note" error={form.errors.short?.toString() || ''} {...form.getInputProps('short')} placeholder="" /></div>
                    <div className="mt-6">
                        <Formbutton title="Create Wallet" loading={form.submitting} className="bg-[#075c40] text-white font-bold" />
                    </div>
                </form>
            </Drawer>

            {/* Edit wallet */}
            <Drawer opened={openedEdit} onClose={closeEdit} withCloseButton={false} position="right" size="28rem">
                <div className="flex items-center justify-between mb-1">
                    <div className="text-xl font-bold text-gray-900">Edit Wallet</div>
                    <button onClick={closeEdit} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                        <LiaTimesSolid size={20} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 mb-6">
                    {selectedWallet ? `Updating ${selectedWallet.title}` : ''}
                </p>
                <form onSubmit={editForm.onSubmit(handleUpdateWallet)} className="space-y-1">
                    <Forminput content="Title" error={editForm.errors.title?.toString() || ''} {...editForm.getInputProps('title')} placeholder="BTC" />
                    <div className="flex-1"><Forminput type="text" content="Address" error={editForm.errors.address?.toString() || ''} {...editForm.getInputProps('address')} placeholder="" /></div>
                    <div className="flex-1"><Forminput type="text" content="Short Note" error={editForm.errors.short?.toString() || ''} {...editForm.getInputProps('short')} placeholder="" /></div>
                    <div className="mt-6">
                        <Formbutton title="Save Changes" loading={editForm.submitting} className="bg-[#075c40] text-white font-bold" />
                    </div>
                </form>
            </Drawer>

            {/* Delete confirmation */}
            <Modal size="28rem" centered withCloseButton={false} opened={deleteOpened} onClose={closeDelete}>
                <div className="my-2">
                    <div className="text-[1.3rem] font-bold text-center mb-1 text-gray-900">Delete Wallet</div>
                    <p className="text-sm text-gray-500 text-center mb-5">
                        {deleteTarget ? `This will permanently remove "${deleteTarget.title}". This can't be undone.` : ''}
                    </p>
                    <div className="flex items-center gap-3">
                        <button onClick={closeDelete} className="w-full py-2.5 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={deletingId === deleteTarget?.id}
                            className="w-full py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {deletingId === deleteTarget?.id ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className="m-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-[1.9rem] font-semibold text-gray-900">All Wallets</div>
                    <button
                        onClick={open}
                        className="text-sm border border-[#075c40] text-[#075c40] rounded-full px-4 py-2 font-semibold hover:bg-[#075c40] hover:text-white transition-colors cursor-pointer"
                    >
                        Add Wallet
                    </button>
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
                                {wallet.length > 0 ? (
                                    wallet.map((item: { image: string; title: string; address: string; short: string; id: number }, index: React.Key) => (
                                        <Tr className="my-4" key={index} last={index === wallet.length - 1}>
                                            <Td className="font-medium text-gray-900">{item.title}</Td>
                                            <Td className="text-gray-600">{item.short}</Td>
                                            <Td className="text-gray-500 font-mono text-sm">{item.address}</Td>
                                            <Td>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => { setSelectedWallet(item); editForm.setValues({ ...item }); openEdit() }}
                                                        className="text-[#075c40] font-semibold text-sm hover:underline cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="text-red-600 font-semibold text-sm hover:underline cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr last>
                                        <Td>
                                            <div className="py-6 text-center text-gray-400">No wallets added yet</div>
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