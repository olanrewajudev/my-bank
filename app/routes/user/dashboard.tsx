import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useDisclosure } from '@mantine/hooks'
import {
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
  HiOutlineBuildingLibrary,
  HiOutlineBanknotes,
  HiOutlineWallet,
  HiOutlineXMark,
  HiOutlineShieldCheck,
} from 'react-icons/hi2'

import { Modal, TextInput, NumberInput, Select, Button } from '@mantine/core'

import type { RootState } from '~/lib/store'
import { ErrorAlert, formatAmount, HotAlert } from '~/component/utils'
import { cryptoAssets, transferOptions } from '~/component/general/constant'
import { Wallet_urls } from '~/component/endpoints/wallet'
import { transact_urls } from '~/component/endpoints/transact'
import Forminput from '~/component/general/form-input'
import Formbutton from '~/component/general/form-button'

type ModalType = 'fund' | 'wire' | 'local' | 'bank' | 'crypto' | 'crypto-send' | null

interface Transaction {
  id: string | number
  date: string
  amount: number
  type: string
  status: string
}

type Region = 'usa' | 'europe' | 'other'

const EUROPE_COUNTRIES = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland',
  'United Kingdom',
]

const OTHER_COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'Canada',
  'Australia',
  'India',
  'China',
  'Japan',
  'Brazil',
  'Mexico',
  'United Arab Emirates',
  'Saudi Arabia',
  'Singapore',
  'Philippines',
  'Indonesia',
  'Egypt',
  'Turkey',
  'Argentina',
  'New Zealand',
  'Other',
]

const COUNTRY_OPTIONS = [
  { group: 'United States', items: ['United States'] },
  { group: 'Europe', items: EUROPE_COUNTRIES },
  { group: 'Other', items: OTHER_COUNTRIES },
]

function getRegion(country: string): Region {
  if (country === 'United States') return 'usa'
  if (EUROPE_COUNTRIES.includes(country)) return 'europe'
  return 'other'
}
const initialWithdrawForm = {
  country: '',
  accName: '',
  bank: '',
  recieveracctnumber: '',
  routineNumber: '',
  iban: '',
  swiftCode: '',
  amount: '',
}

type WithdrawField = keyof typeof initialWithdrawForm

const TEXT_ONLY_REGEX = /[^a-zA-Z\s'-]/g
const TEXT_ONLY_FIELDS: WithdrawField[] = ['accName']

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {}

  transactions.forEach((tx) => {
    const key = tx.date
    if (!groups[key]) groups[key] = []
    groups[key].push(tx)
  })

  return Object.entries(groups).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
}

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.data)
  const navigate = useNavigate()

  const [showBalance, setShowBalance] = useState(true)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [loading, setLoading] = useState(false)

  /* Admin wallets the user can deposit crypto into */
  const { data: wallet = [] } = useQuery({
    queryKey: ['admin-wallets'],
    queryFn: async () => {
      const res = await Wallet_urls.getAllWallet()
      return res.data.msg
    },
  })
  const { data: userwallet = [] } = useQuery({
    queryKey: ['user-wallets'],
    queryFn: async () => {
      const res = await Wallet_urls.getAllUserWallet()
      return res.data.msg
    },
  })

  /* Transaction history */
  const {
    data: transactions = [],
    isLoading,
    refetch,
  } = useQuery<Transaction[]>({
    queryKey: ['all-transactions'],
    queryFn: async () => {
      const res = await transact_urls.getAllUserTransact()
      return res.data.msg || []
    },
  })

  const grouped = groupByDate(transactions)

  /* Fund form */
  const [fundAmount, setFundAmount] = useState<number | string>('')
  const [fundMethod, setFundMethod] = useState<string | null>(null)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  /* Crypto deposit proof of payment */
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)

  /* Crypto (outgoing send address / asset, plus deposit TXID) */
  const [cryptoAsset, setCryptoAsset] = useState<string | null>(null)
  const [cryptoAddress, setCryptoAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState<number | string>('')
  const [depositTxid, setDepositTxid] = useState('')

  /* KYC notice */
  const [kycNoticeOpened, { open: openKycNotice, close: closeKycNotice }] = useDisclosure(false)
  const isVerified = user?.verified === 'verified'

  /* Withdrawal form */
  const [form, setForm] = useState(initialWithdrawForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<Record<string, string>>({})

  const region = useMemo(() => getRegion(form.country), [form.country])

  function clearProof() {
    if (proofPreview) URL.revokeObjectURL(proofPreview)
    setProofImage(null)
    setProofPreview(null)
  }

  function handleProofSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      ErrorAlert('Please upload an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      ErrorAlert('Image must be under 5MB')
      return
    }

    setProofImage(file)
    setProofPreview(URL.createObjectURL(file))
  }

  const closeModal = () => {
    setActiveModal(null)

    setFundAmount('')
    setFundMethod(null)
    setSelectedWallet(null)
    clearProof()

    setCryptoAsset(null)
    setCryptoAddress('')
    setTransferAmount('')
    setDepositTxid('')

    setForm(initialWithdrawForm)
    setFormError({})
  }

  const openModal = (type: ModalType) => {
    setActiveModal(type)
  }

  const handleTransferClick = (type: ModalType) => {
    if (!isVerified) {
      openKycNotice()
      return
    }
    openModal(type)
  }

  /* Bank transfer deposit — currently simulated; wire this to your bank-deposit
     endpoint once it exists, following the same pattern as handleCryptoDeposit below. */
  const handleFund = async () => {
    if (!fundAmount || Number(fundAmount) <= 0) return ErrorAlert('Enter a valid amount')

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Fund account:', { amount: fundAmount, method: fundMethod })
      HotAlert('Deposit request submitted')
      closeModal()
    } finally {
      setLoading(false)
    }
  }

  /* Crypto deposit — wired to the real backend endpoint */
  async function handleCryptoDeposit() {
    if (!fundAmount || Number(fundAmount) <= 0) return ErrorAlert('Enter a valid amount')
    if (!cryptoAsset) return ErrorAlert('Select a cryptocurrency')
    if (!selectedWallet) return ErrorAlert('Select a deposit wallet')
    if (!depositTxid) return ErrorAlert('Enter the transaction ID')
    if (!proofImage) return ErrorAlert('Upload proof of payment')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('amount', String(fundAmount))
      formData.append('txid', depositTxid)
      formData.append('adminwalletid', selectedWallet)
      formData.append('image', proofImage)

      const res = await transact_urls.submitDeposit(formData)

      if (res.data.status === 500 || res.data.status === 404) {
        ErrorAlert(res.data.msg)
      } else if (res.status === 200) {
        HotAlert(res.data.msg)
        closeModal()
      }
    } catch (error) {
      ErrorAlert((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleCryptoTransfer = async () => {
    if (!cryptoAsset || !cryptoAddress || !transferAmount || Number(transferAmount) <= 0) return

    setLoading(true)
    try {
      /* Connect your crypto send API here. */
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Crypto transfer:', { asset: cryptoAsset, address: cryptoAddress, amount: transferAmount })
      closeModal()
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: WithdrawField) => (arg: any) => {
    let nextValue = arg

    if (arg && typeof arg === 'object') {
      if ('target' in arg) {
        nextValue = arg.target.value
      } else if ('value' in arg) {
        nextValue = arg.value
      }
    }

    if (TEXT_ONLY_FIELDS.includes(field)) {
      nextValue = String(nextValue).replace(TEXT_ONLY_REGEX, '')
    }

    setForm((prev) => ({ ...prev, [field]: nextValue }))
    setFormError((prev) => ({ ...prev, [field]: '' }))
  }

  const handleCountryChange = (value: string | null) => {
    const newRegion = getRegion(value || '')

    setForm((prev) => ({
      ...prev,
      country: value || '',
      recieveracctnumber: newRegion === 'europe' ? '' : prev.recieveracctnumber,
      routineNumber: newRegion === 'usa' ? prev.routineNumber : '',
      iban: newRegion === 'europe' ? prev.iban : '',
      swiftCode: newRegion === 'usa' ? '' : prev.swiftCode,
    }))

    setFormError((prev) => ({ ...prev, country: '' }))
  }

  const validate = () => {
    const errors: Record<string, string> = {}

    if (!form.country) errors.country = 'Country is required'
    if (!form.accName) errors.accName = 'Account holder name is required'
    if (!form.bank) errors.bank = 'Bank name is required'

    if (region === 'usa') {
      if (!form.recieveracctnumber) errors.recieveracctnumber = 'Account number is required'
      if (!form.routineNumber) errors.routineNumber = 'Routing number is required'
    }

    if (region === 'europe') {
      if (!form.iban) errors.iban = 'IBAN is required'
      if (!form.swiftCode) errors.swiftCode = 'SWIFT/BIC code is required'
    }

    if (region === 'other') {
      if (!form.recieveracctnumber) errors.recieveracctnumber = 'Account number is required'
      if (!form.swiftCode) errors.swiftCode = 'SWIFT/BIC code is required'
    }

    const amountNum = Number(form.amount)

    if (!form.amount || Number.isNaN(amountNum) || amountNum <= 0) {
      errors.amount = 'Enter a valid amount'
    } else if (amountNum < 3000) {
      errors.amount = 'Minimum withdrawal amount is $3,000'
    }

    setFormError(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitWithdraw = async () => {
    if (!isVerified) {
      closeModal()
      openKycNotice()
      return
    }

    if (!validate()) return

    const payload = {
      country: form.country,
      region,
      accName: form.accName,
      bank: form.bank,
      amount: Number(form.amount),

      ...(region === 'usa' && {
        recieveracctnumber: form.recieveracctnumber,
        routineNumber: form.routineNumber,
      }),

      ...(region === 'europe' && {
        iban: form.iban,
        swiftCode: form.swiftCode,
      }),

      ...(region === 'other' && {
        recieveracctnumber: form.recieveracctnumber,
        swiftCode: form.swiftCode,
      }),
    }

    try {
      setSubmitting(true)
      await transact_urls.bankWithdrawal(payload)
      closeModal()
      await refetch()
    } catch (error) {
      ErrorAlert((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const getModalTitle = () => {
    switch (activeModal) {
      case 'fund':
        return 'Fund your account'
      case 'wire':
        return 'Wire Transfer'
      case 'local':
        return 'Local Transfer'
      case 'crypto-send':
        return 'Crypto Transfer'
      default:
        return ''
    }
  }

  const selectedWalletDetails = wallet?.find((w: any) => String(w.id) === selectedWallet)

  /* Only the logged-in user's wallet records. Requires `user.id` to be present in the
     profile response. If it's missing, nothing matches and balances show $0 (fails safe). */
  const myWallets = useMemo(
    () =>
      (userwallet ?? []).filter(
        (uw: any) => user?.id != null && String(uw.user) === String(user.id)
      ),
    [userwallet, user?.id]
  )

  /* the user's own wallet record for the selected admin wallet, matched by tag = adminwallet id,
     used to show their current balance held in that specific wallet */
  const selectedUserWalletBalance = myWallets.find((uw: any) => String(uw.tag) === selectedWallet)

  /* Map of adminwallet id -> this user's balance in that wallet (userwallet.tag references adminwallet.id).
     Drives the crypto cards at the top of the dashboard. */
  const walletBalanceById = useMemo(() => {
    const map: Record<string, number> = {}
    myWallets.forEach((uw: any) => {
      map[String(uw.tag)] = uw.currbal
    })
    return map
  }, [myWallets])

  /* Look up a matching icon/name from the static cryptoAssets constant by short code (BTC/ETH/USDT),
     falling back to the wallet's own title if nothing matches. */
  const getCryptoDisplay = (adminWallet: any) => {
    const match = cryptoAssets?.find((a: any) => a.name?.toUpperCase() === adminWallet.short?.toUpperCase())
    return {
      icon: match?.icon ?? null,
      name: adminWallet.short || adminWallet.title,
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] pb-20">
      {/* =========================================================
          KYC NOTICE
      ========================================================= */}
      <Modal size="26rem" centered opened={kycNoticeOpened} onClose={closeKycNotice} withCloseButton={false} radius="xl">
        <div className="px-2 py-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">
            <HiOutlineShieldCheck className="text-3xl text-amber-600" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">KYC Verification Required</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You need to submit your KYC documents before you can make a transfer. You can complete your verification from your
            account settings.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={closeKycNotice}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                closeKycNotice()
                navigate('/user/profile')
              }}
              className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Verify Identity
            </button>
          </div>
        </div>
      </Modal>

      {/* =========================================================
          FUND ACCOUNT - METHOD SELECTION
      ========================================================= */}
      <Modal
        opened={activeModal === 'fund'}
        onClose={closeModal}
        withCloseButton={false}
        centered
        radius="xl"
        size="md"
        padding={0}
      >
        <div className="overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Fund Account</h2>
                <p className="mt-1 text-sm text-slate-500">Choose how you would like to add money.</p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6 rounded-2xl bg-[#075c40] p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-100/70">Available Balance</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-bold text-white">{showBalance ? `$${formatAmount(user?.currbal)}` : '••••••'}</p>
                <HiOutlineBanknotes className="text-2xl text-emerald-100/60" />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Funding method</h3>
              <p className="mt-1 text-xs text-slate-500">Select your preferred deposit method.</p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setFundMethod('bank')
                  setActiveModal('bank')
                }}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-300">
                  <HiOutlineBuildingLibrary className="text-2xl text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">Bank Transfer</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Transfer funds directly from your bank account.</p>
                </div>
                <HiOutlineArrowRight className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setFundMethod('crypto')
                  setActiveModal('crypto')
                }}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <HiOutlineWallet className="text-2xl text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900">Cryptocurrency</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Deposit Bitcoin, Ethereum or USDT.</p>
                </div>
                <HiOutlineArrowRight className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
              </button>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* =========================================================
          BANK TRANSFER (deposit)
      ========================================================= */}
      <Modal
        opened={activeModal === 'bank'}
        onClose={closeModal}
        withCloseButton={false}
        centered
        radius="xl"
        size="md"
        padding={0}
      >
        <div className="overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveModal('fund')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                ←
              </button>

              <div>
                <h2 className="text-xl font-bold text-slate-900">Bank Transfer</h2>
                <p className="mt-1 text-xs text-slate-500">Fund your account using a bank transfer.</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <HiOutlineBuildingLibrary className="text-3xl text-blue-600" />
              </div>

              <div className="mt-5 inline-flex items-center rounded-full bg-amber-100 px-3 py-1">
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-amber-700">Currently unavailable</span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">Bank transfer is not available</h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                We are currently working on this service to make bank transfers available to you. Please check back later.
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  <HiOutlineBanknotes className="text-lg text-emerald-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">We're working on it</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    This funding method is temporarily unavailable while we complete the necessary service setup.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button color="green" fullWidth onClick={() => setActiveModal('fund')}>
                Choose another method
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* =========================================================
          CRYPTO DEPOSIT (fund via crypto)
      ========================================================= */}
      <Modal
        opened={activeModal === 'crypto'}
        onClose={closeModal}
        withCloseButton={false}
        centered
        radius="xl"
        size="md"
        padding={0}
      >
        <div className="overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveModal('fund')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                ←
              </button>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Crypto Deposit</h2>
                <p className="mt-1 text-xs text-slate-500">Send cryptocurrency to your deposit wallet.</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                  <HiOutlineWallet className="text-xl text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Cryptocurrency deposit</p>
                  <p className="mt-1 text-xs text-emerald-700">Select an asset and send funds to the wallet below.</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <NumberInput
                label="Amount"
                placeholder="Enter deposit amount"
                prefix="$"
                min={1}
                thousandSeparator=","
                value={fundAmount}
                onChange={setFundAmount}
                required
              />
            </div>

            <div className="mt-4">
              <Select
                label="Cryptocurrency"
                placeholder="Select cryptocurrency"
                value={cryptoAsset}
                onChange={setCryptoAsset}
                data={[
                  { value: 'BTC', label: 'Bitcoin (BTC)' },
                  { value: 'ETH', label: 'Ethereum (ETH)' },
                  { value: 'USDT', label: 'Tether (USDT)' },
                ]}
                required
              />
            </div>

            <div className="mt-4">
              <Select
                label="Deposit wallet"
                placeholder="Select wallet"
                value={selectedWallet}
                onChange={setSelectedWallet}
                data={wallet?.map((w: any) => ({ value: String(w.id), label: w.title })) || []}
                required
              />
            </div>

            {selectedWalletDetails && (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Deposit address</p>
                    <p className="mt-1 break-all text-sm font-semibold text-slate-800">{selectedWalletDetails.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedWalletDetails.address)
                      HotAlert('Wallet address copied!')
                    }}
                    className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
                  >
                    Copy
                  </button>
                </div>

                {/* current balance the user holds in this specific wallet */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-500">Current balance in this wallet</span>
                  <span className="text-sm font-bold text-slate-800">
                    ${formatAmount(selectedUserWalletBalance?.currbal ?? 0)}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4">
              <TextInput
                label="Transaction ID"
                placeholder="Enter blockchain transaction hash"
                value={depositTxid}
                onChange={(event) => setDepositTxid(event.currentTarget.value)}
                required
              />
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-slate-800">Proof of payment</p>

              {proofPreview ? (
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <img src={proofPreview} alt="Payment proof" className="mx-auto max-h-48 rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={clearProof}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"
                  >
                    ×
                  </button>
                  <p className="mt-2 truncate text-center text-xs text-slate-400">{proofImage?.name}</p>
                </div>
              ) : (
                <label className="block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50/30">
                  <input type="file" accept="image/*" onChange={handleProofSelect} className="hidden" />
                  <p className="text-sm font-medium text-slate-700">Upload payment proof</p>
                  <p className="mt-1 text-xs text-slate-400">Click to upload a clear screenshot of your transaction.</p>
                </label>
              )}
            </div>

            <div className="mt-5 rounded-2xl border border-(--color-border-gray) bg-(--color-primary-lighter) p-4">
              <p className="text-sm font-semibold text-(--color-primary-dark)">Deposit Guide</p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-(--color-deep-gray)">
                <li>• Send your deposit only to the selected wallet address.</li>
                <li>• Make sure you select the correct cryptocurrency.</li>
                <li>• Paste the blockchain transaction hash after payment.</li>
                <li>• Upload a clear screenshot as proof of payment.</li>
                <li>• Incorrect networks or addresses may result in loss of funds.</li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="light" color="gray" className="flex-1" onClick={() => setActiveModal('fund')}>
                Back
              </Button>
              <Button
                color="green"
                className="flex-1"
                loading={loading}
                disabled={
                  !fundAmount || Number(fundAmount) <= 0 || !cryptoAsset || !selectedWallet || !depositTxid || !proofImage
                }
                onClick={handleCryptoDeposit}
              >
                Submit Deposit
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* =========================================================
          SEND MONEY - WIRE / LOCAL TRANSFER (withdrawal)
      ========================================================= */}
      <Modal
        opened={activeModal === 'wire' || activeModal === 'local'}
        onClose={closeModal}
        withCloseButton={false}
        centered
        radius="xl"
        size="md"
        padding={0}
      >
        <div>
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">Transfer</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Withdrawal Request</h2>
                <p className="mt-1 text-xs text-slate-500">Enter the recipient's banking details.</p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmitWithdraw()
            }}
            className="px-6 py-6"
          >
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Country</label>
              <Select
                placeholder="Select country"
                searchable
                clearable
                value={form.country || null}
                onChange={handleCountryChange}
                data={COUNTRY_OPTIONS}
                error={formError.country}
                radius="md"
              />
            </div>

            <Forminput
              error={formError.accName}
              content="Account Holder Name"
              type="text"
              placeholder="Account Holder Name"
              value={form.accName}
              onChange={handleChange('accName')}
            />

            <Forminput
              error={formError.bank}
              content="Bank Name"
              placeholder="Bank Name"
              value={form.bank}
              onChange={handleChange('bank')}
            />

            {region === 'usa' && (
              <>
                <Forminput
                  error={formError.recieveracctnumber}
                  content="Account Number"
                  type="number"
                  placeholder="Account Number"
                  value={form.recieveracctnumber}
                  onChange={handleChange('recieveracctnumber')}
                />

                <Forminput
                  error={formError.routineNumber}
                  content="Routing Number"
                  type="number"
                  placeholder="Routing Number"
                  value={form.routineNumber}
                  onChange={handleChange('routineNumber')}
                />
              </>
            )}

            {region === 'europe' && (
              <>
                <Forminput
                  error={formError.iban}
                  content="IBAN"
                  placeholder="e.g. DE89 3704 0044 0532 0130 00"
                  value={form.iban}
                  onChange={handleChange('iban')}
                />

                <Forminput
                  error={formError.swiftCode}
                  content="SWIFT / BIC Code"
                  placeholder="e.g. DEUTDEFF"
                  value={form.swiftCode}
                  onChange={handleChange('swiftCode')}
                />
              </>
            )}

            {region === 'other' && (
              <>
                <Forminput
                  error={formError.recieveracctnumber}
                  content="Account Number"
                  type="number"
                  placeholder="Account Number"
                  value={form.recieveracctnumber}
                  onChange={handleChange('recieveracctnumber')}
                />

                <Forminput
                  error={formError.swiftCode}
                  content="SWIFT / BIC Code"
                  placeholder="e.g. FTBCUS3P"
                  value={form.swiftCode}
                  onChange={handleChange('swiftCode')}
                />
              </>
            )}

            <Forminput
              error={formError.amount}
              content="Amount"
              placeholder="$3,000.00 minimum"
              type="number"
              value={form.amount}
              onChange={handleChange('amount')}
            />

            <div className="mb-5 rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Available balance</span>
                <span className="text-sm font-semibold text-slate-800">${formatAmount(user?.currbal)}</span>
              </div>
            </div>

            <Formbutton title={submitting ? 'Submitting...' : 'Submit Withdrawal'} loading={submitting} />
          </form>
        </div>
      </Modal>

      {/* =========================================================
          SEND MONEY - CRYPTO TRANSFER (outgoing)
      ========================================================= */}
      <Modal
        opened={activeModal === 'crypto-send'}
        onClose={closeModal}
        withCloseButton={false}
        centered
        radius="xl"
        size="md"
        padding={0}
      >
        <div className="overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                ←
              </button>

              <div>
                <h2 className="text-xl font-bold text-slate-900">Crypto Transfer</h2>
                <p className="mt-1 text-xs text-slate-500">Send cryptocurrency to an external wallet.</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                  <HiOutlineWallet className="text-xl text-white" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-emerald-900">Send cryptocurrency</p>
                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Enter the recipient's wallet details and the amount you want to send.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Available balance</p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {showBalance ? `$${formatAmount(user?.currbal)}` : '••••••'}
                </p>
              </div>

              <HiOutlineBanknotes className="text-xl text-slate-400" />
            </div>

            <div className="mt-5">
              <Select
                label="Cryptocurrency"
                placeholder="Select cryptocurrency"
                value={cryptoAsset}
                onChange={setCryptoAsset}
                data={[
                  { value: 'BTC', label: 'Bitcoin (BTC)' },
                  { value: 'ETH', label: 'Ethereum (ETH)' },
                  { value: 'USDT', label: 'Tether (USDT)' },
                ]}
                required
              />
            </div>

            <div className="mt-5">
              <TextInput
                label="Recipient wallet address"
                placeholder="Enter wallet address"
                value={cryptoAddress}
                onChange={(event) => setCryptoAddress(event.currentTarget.value)}
                required
              />
            </div>

            <div className="mt-5">
              <NumberInput
                label="Amount"
                placeholder="Enter amount"
                min={0}
                value={transferAmount}
                onChange={setTransferAmount}
                thousandSeparator=","
                required
              />
            </div>

            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-900">Check transfer details</p>
                  <p className="mt-1 text-xs leading-5 text-amber-800">
                    Make sure the wallet address and cryptocurrency are correct. Crypto transfers may not be reversible once
                    submitted.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="light" color="gray" className="flex-1" onClick={closeModal}>
                Cancel
              </Button>

              <Button
                color="green"
                className="flex-1"
                loading={loading}
                disabled={!cryptoAsset || !cryptoAddress || !transferAmount || Number(transferAmount) <= 0}
                onClick={handleCryptoTransfer}
              >
                Review Transfer
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <header className="px-5 pb-6 pt-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-black tracking-tight text-slate-900">
              B<span className="text-yellow-500">:</span>
            </span>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white"
          >
            {user?.firstname?.charAt(0)?.toUpperCase() || 'U'}
          </button>
        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome back, {user?.firstname}</h1>
          <p className="mt-1 text-sm text-slate-500">Here's an overview of your account activity.</p>
        </div>
      </header>

      <main className="px-5 sm:px-8 lg:px-10">
        <section className="overflow-hidden rounded-3xl bg-[#075c40] shadow-lg">
          <div className="relative px-5 pb-7 pt-6 sm:px-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-100/70">Available Balance</p>
                <div className="mt-2 flex items-center gap-3">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {showBalance ? `$${formatAmount(user?.currbal)}` : '••••••'}
                  </h2>
                  <button
                    type="button"
                    aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                    onClick={() => setShowBalance((value) => !value)}
                    className="text-emerald-100/70 transition hover:text-white"
                  >
                    {showBalance ? <HiOutlineEye className="text-xl" /> : <HiOutlineEyeSlash className="text-xl" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openModal('fund')}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 active:scale-95"
              >
                <HiOutlinePlus className="text-lg" />
                Fund
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10">
            {wallet?.map((adminWallet: any, index: number) => {
              const display = getCryptoDisplay(adminWallet)
              const balance = walletBalanceById[String(adminWallet.id)] ?? 0

              return (
                <div
                  key={adminWallet.id}
                  className={`px-3 py-5 sm:px-6 ${index !== wallet.length - 1 ? 'border-r border-white/10' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {display.icon}
                    <span className="text-xs font-semibold tracking-wide text-white/70">{display.name}</span>
                  </div>
                  <p className="mt-3 truncate text-sm font-semibold text-white sm:text-base">
                    {showBalance ? `$${formatAmount(balance)}` : '••••••'}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

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

        {user?.postNoDebit === 'true' && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">!</div>
            <div>
              <p className="font-semibold text-red-800">Account restricted</p>
              <p className="mt-1 text-sm leading-5 text-red-700">
                This account is currently flagged as Post No Debit. Withdrawals and outgoing transfers are temporarily disabled.
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
              <button
                key={option.title}
                type="button"
                onClick={() => handleTransferClick(option.type as ModalType)}
                className="group flex min-h-37.5 items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.99]"
              >
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

        <section className="mt-10 space-y-4 border-t border-slate-200 pt-6 text-[11px] leading-relaxed text-slate-400">
          <p>
            Beacon Gold Crest by Beacon Gold Crest® is a brand of Beacon Gold Crest Bank USA. All deposit products are provided or
            issued by Beacon Gold Crest Bank USA, Salt Lake City Branch.
          </p>
          <p>
            Important information about procedures for opening a new account: federal law requires financial institutions to
            obtain, verify, and record information that identifies each person who opens an account.
          </p>
          <p>
            When you open an account, we may ask for your name, address, date of birth, and other information that allows us to
            identify you.
          </p>
        </section>
      </main>
    </div>
  )
}