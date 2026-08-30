import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { HiOutlinePlus, HiOutlineEye, HiOutlineEyeSlash, HiOutlineArrowRight, HiOutlineBuildingLibrary, HiOutlineBanknotes, HiOutlineWallet, } from 'react-icons/hi2'

import { Modal, TextInput, NumberInput, Select, Textarea, Button, Group, Stack, } from '@mantine/core'

import type { RootState } from '~/lib/store'
import { formatAmount } from '~/component/utils'
import { cryptoAssets, transferOptions } from '~/component/general/constant'
type ModalType = | 'fund' | 'wire' | 'local' | 'bank' | 'crypto' | null

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.data)

  const [showBalance, setShowBalance] = useState(true)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [loading, setLoading] = useState(false)

  /* Fund form */
  const [fundAmount, setFundAmount] = useState<number | string>('')
  const [fundMethod, setFundMethod] = useState<string | null>(null)
  type DepositMethod = 'bank' | 'crypto' | null

  const [depositMethod, setDepositMethod] = useState<DepositMethod>(null)
  const [depositAmount, setDepositAmount] = useState<number | string>('')
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [depositTxid, setDepositTxid] = useState('')
  const [depositProof, setDepositProof] = useState<File | null>(null)
  const [depositLoading, setDepositLoading] = useState(false)
  /* Transfer form */
  const [recipientName, setRecipientName] = useState('')
  const [recipientAccount, setRecipientAccount] = useState('')
  const [recipientBank, setRecipientBank] = useState('')
  const [transferAmount, setTransferAmount] = useState<number | string>('')
  const [transferPurpose, setTransferPurpose] = useState('')

  /* Crypto */
  const [cryptoAsset, setCryptoAsset] = useState<string | null>(null)
  const [cryptoAddress, setCryptoAddress] = useState('')

  const closeModal = () => {
    setActiveModal(null)

    setFundAmount('')
    setFundMethod(null)

    setRecipientName('')
    setRecipientAccount('')
    setRecipientBank('')
    setTransferAmount('')
    setTransferPurpose('')

    setCryptoAsset(null)
    setCryptoAddress('')
  }

  const openModal = (type: ModalType) => {
    setActiveModal(type)
  }

  const handleFund = async () => {
    if (!fundAmount || Number(fundAmount) <= 0) return

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Fund account:', {
        amount: fundAmount,
        method: fundMethod,
      })

      closeModal()
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (
      !recipientName ||
      !recipientAccount ||
      !transferAmount ||
      Number(transferAmount) <= 0
    ) {
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      closeModal()
    } finally {
      setLoading(false)
    }
  }

  const handleCryptoTransfer = async () => {
    if (
      !cryptoAsset ||
      !cryptoAddress ||
      !transferAmount ||
      Number(transferAmount) <= 0
    ) {
      return
    }

    setLoading(true)

    try {
      /*
       * Connect your crypto API here.
       */

      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Crypto transfer:', {
        asset: cryptoAsset,
        address: cryptoAddress,
        amount: transferAmount,
      })

      closeModal()
    } finally {
      setLoading(false)
    }
  }

  const getModalTitle = () => {
    switch (activeModal) {
      case 'fund':
        return 'Fund your account'
      case 'wire':
        return 'Wire Transfer'

      case 'crypto':
        return 'Crypto Transfer'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] pb-20">
      <Modal opened={activeModal === 'fund'} onClose={closeModal} title="Fund your account" centered radius="lg" size="md">
        <Stack gap="md">
          {/* Balance */}
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs font-medium text-emerald-700">Available balance</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900"> {showBalance ? `$${formatAmount(user?.currbal)}` : '••••••'}</p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-900">Choose funding method</h3>
            <p className="mt-1 text-sm text-slate-500">Select how you would like to add money to your account.</p>
          </div>

          {/* Funding Methods */}
          <div className="space-y-3">

            {/* Bank Transfer */}
            <button type="button" onClick={() => { setFundMethod('bank'), setActiveModal('bank') }}
              className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50"><HiOutlineBuildingLibrary className="text-2xl text-blue-700" /></div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">Bank Transfer</p>
                <p className="mt-1 text-sm text-slate-500">Fund your account directly from your bank.</p>
              </div>

              <HiOutlineArrowRight className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
            </button>

            {/* Cryptocurrency */}
            <button type="button" onClick={() => { setFundMethod('crypto'), setActiveModal('crypto') }}
              className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50"><HiOutlineWallet className="text-2xl text-emerald-700" /></div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">Cryptocurrency</p>
                <p className="mt-1 text-sm text-slate-500">Deposit Bitcoin, Ethereum or USDT.</p>
              </div>

              <HiOutlineArrowRight className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
            </button>
          </div>
          <Button variant="light" color="gray" fullWidth onClick={closeModal}>Cancel</Button>
        </Stack>
      </Modal>

      <Modal opened={activeModal === 'wire' || activeModal === 'local' || activeModal === 'bank'} onClose={closeModal} title={getModalTitle()} centered radius="lg" size="md">
        <Stack gap="md">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Available balance</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{showBalance ? `$${formatAmount(user?.currbal)}` : '••••••'}</p>
              </div>
              <HiOutlineBanknotes className="text-2xl text-slate-400" />
            </div>
          </div>


          <TextInput label="Recipient name" placeholder="Enter recipient full name" value={recipientName} onChange={(event) => setRecipientName(event.currentTarget.value)} required />
          <TextInput label="Account number" placeholder="Enter account number" value={recipientAccount} onChange={(event) => setRecipientAccount(event.currentTarget.value)} required />
          <TextInput label="Bank name" placeholder="Enter bank name" value={recipientBank} onChange={(event) => setRecipientBank(event.currentTarget.value)} required />
          <NumberInput label="Amount" placeholder="Enter amount" prefix="$" min={1} value={transferAmount} onChange={setTransferAmount} thousandSeparator="," required />
          <Textarea label="Transfer purpose" placeholder="Optional" minRows={3} value={transferPurpose} onChange={(event) => setTransferPurpose(event.currentTarget.value)} />
          <Group justify="flex-end" mt="sm">
            <Button variant="light" color="gray" onClick={closeModal}>Cancel</Button>
            <Button color="green" loading={loading} disabled={!recipientName || !recipientAccount || !recipientBank || !transferAmount || Number(transferAmount) <= 0} onClick={handleTransfer}>Review Transfer</Button>
          </Group>
        </Stack>
      </Modal>


      <Modal opened={activeModal === 'crypto'} onClose={closeModal} title="Crypto Transfer" centered radius="lg" size="md">
        <Stack gap="md">
          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600"><HiOutlineWallet className="text-xl text-white" /></div>
              <div>
                <p className="text-xs text-emerald-700">Send cryptocurrency</p>
                <p className="text-sm font-semibold text-emerald-900">Transfer to an external wallet</p>
              </div>
            </div>
          </div>
          <Select label="Asset" placeholder="Select cryptocurrency" value={cryptoAsset} onChange={setCryptoAsset}
            data={[
              {
                value: 'BTC',
                label: 'Bitcoin (BTC)',
              },
              {
                value: 'ETH',
                label: 'Ethereum (ETH)',
              },
              {
                value: 'USDT',
                label: 'Tether (USDT)',
              },
            ]}
            required
          />


          <TextInput label="Wallet address" placeholder="Enter recipient wallet address" value={cryptoAddress} onChange={(event) => setCryptoAddress(event.currentTarget.value)} required />
          <NumberInput label="Amount" placeholder="Enter amount" min={0} value={transferAmount} onChange={setTransferAmount} thousandSeparator="," required />
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs leading-5 text-yellow-800">
            Make sure the wallet address and selected network are correct.
            Cryptocurrency transactions may not be reversible.
          </div>
          <Group justify="flex-end" mt="sm">
            <Button variant="light" color="gray" onClick={closeModal}> Cancel</Button>
            <Button color="green" loading={loading} disabled={!cryptoAsset || !cryptoAddress || !transferAmount || Number(transferAmount) <= 0} onClick={handleCryptoTransfer}>
              Review Transfer
            </Button>
          </Group>
        </Stack>
      </Modal>


      <header className="px-5 pb-6 pt-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <div><span className="text-3xl font-black tracking-tight text-slate-900">B<span className="text-yellow-500">:</span></span></div>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {user?.firstname?.charAt(0)?.toUpperCase() || 'U'}
          </button>
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome back, {user?.firstname}</h1>
          <p className="mt-1 text-sm text-slate-500">Here's an overview of your account activity.</p>
        </div>
      </header>


      {/* =========================
          MAIN
      ========================== */}

      <main className="px-5 sm:px-8 lg:px-10">
        <section className="overflow-hidden rounded-3xl bg-[#075c40] shadow-lg">
          <div className="relative px-5 pb-7 pt-6 sm:px-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-100/70">Available Balance</p>
                <div className="mt-2 flex items-center gap-3">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{showBalance ? `$${formatAmount(user?.currbal)}` : '••••••'}</h2>
                  <button type="button" aria-label={showBalance ? 'Hide balance' : 'Show balance'} onClick={() => setShowBalance((value) => !value)}
                    className="text-emerald-100/70 transition hover:text-white">
                    {showBalance ? (
                      <HiOutlineEye className="text-xl" />
                    ) : (
                      <HiOutlineEyeSlash className="text-xl" />
                    )}
                  </button>
                </div>
              </div>

              <button type="button" onClick={() => openModal('fund')} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95">
                <HiOutlinePlus className="text-lg" />Fund
              </button>
            </div>
          </div>


          {/* Crypto balances */}

          <div className="grid grid-cols-3 border-t border-white/10">
            {cryptoAssets.map((asset, index) => (
              <div key={asset.name} className={`px-3 py-5 sm:px-6 ${index !== cryptoAssets.length - 1 ? 'border-r border-white/10' : ''}`}>
                <div className="flex items-center gap-2">
                  {asset.icon}
                  <span className="text-xs font-semibold tracking-wide text-white/70">{asset.name}</span>
                </div>
                <p className="mt-3 truncate text-sm font-semibold text-white sm:text-base">{asset.amount}</p>
                <p className="mt-1 text-[11px] text-white/50">≈ {asset.value}</p>
              </div>
            ))}
          </div>
        </section>


        {/* Account Information */}

        <div className="mt-4 rounded-2xl bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Account</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Online Savings</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Account number</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{user?.acctnumber || '—'}</p>
            </div>

          </div>

        </div>


        {/* PND Warning */}
        {user?.postNoDebit === 'true' && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">!</div>
            <div>
              <p className="font-semibold text-red-800">Account restricted</p>
              <p className="mt-1 text-sm leading-5 text-red-700">
                This account is currently flagged as Post No Debit.
                Withdrawals and outgoing transfers are temporarily disabled.
              </p>
            </div>
          </div>
        )}


        <section className="mt-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Send Money</h2>
            <p className="mt-1 text-sm text-slate-500">Choose how you'd like to send your money.</p>
          </div>


          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {transferOptions.map((option) => (
              <button key={option.title} type="button" onClick={() => openModal(option.type)} className="group flex min-h-[150px] items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.99]">
                <div>
                  {option.icon}
                  <h3 className="mt-4 text-base font-bold text-slate-900">{option.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{option.description}</p>
                </div>
                <HiOutlineArrowRight className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-9">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <button type="button" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">View all</button>
          </div>
          <div className="mt-4 rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <HiOutlineArrowRight className="rotate-[-45deg] text-xl text-slate-400" />
            </div>

            <p className="mt-4 font-semibold text-slate-700">No recent activity</p>
            <p className="mt-1 text-sm text-slate-400">Your recent transactions will appear here.</p>
          </div>
        </section>

        <section className="mt-10 space-y-4 border-t border-slate-200 pt-6 text-[11px] leading-relaxed text-slate-400">
          <p>
            Beacon Gold Crest by Beacon Gold Crest® is a brand of Beacon Gold
            Crest Bank USA. All deposit products are provided or issued by
            Beacon Gold Crest Bank USA, Salt Lake City Branch.
          </p>
          <p>
            Important information about procedures for opening a new account:
            federal law requires financial institutions to obtain, verify, and
            record information that identifies each person who opens an account.
          </p>
          <p>
            When you open an account, we may ask for your name, address, date
            of birth, and other information that allows us to identify you.
          </p>
        </section>
      </main>
    </div>
  )
}