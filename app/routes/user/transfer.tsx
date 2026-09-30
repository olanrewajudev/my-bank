import React, { useMemo, useState } from 'react'

import { Modal, Select } from '@mantine/core'

import { useDisclosure } from '@mantine/hooks'

import { useQuery } from '@tanstack/react-query'

import {
  HiOutlineArrowsRightLeft,
  HiOutlineChevronRight,
  HiOutlineArrowPath,
  HiOutlineBuildingLibrary,
  HiOutlineBanknotes,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineXMark,
} from 'react-icons/hi2'

import { Link, useNavigate } from 'react-router'

import { useSelector } from 'react-redux'

import { transact_urls } from '~/component/endpoints/transact'

import Formbutton from '~/component/general/form-button'

import Forminput from '~/component/general/form-input'

import {
  COUNTRY_OPTIONS,
  EUROPE_COUNTRIES,
  formatAmount,
  type Region,
} from '~/component/utils'

import type { Transaction } from '../../../global'

import type { RootState } from '~/lib/store'

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDateHeader(dateStr: string) {
  const date = new Date(dateStr)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function groupByDate(transactions: Transaction[]) {
  const groups: Record<string, Transaction[]> = {}

  transactions.forEach((tx) => {
    const key = tx.date

    if (!groups[key]) {
      groups[key] = []
    }

    groups[key].push(tx)
  })

  return Object.entries(groups).sort(
    (a, b) =>
      new Date(b[0]).getTime() -
      new Date(a[0]).getTime()
  )
}

/* =========================================================
   COUNTRY / REGION
========================================================= */

function getRegion(country: string): Region {
  if (country === 'United States') {
    return 'usa'
  }

  if (EUROPE_COUNTRIES.includes(country)) {
    return 'europe'
  }

  return 'other'
}

/* =========================================================
   FORM
========================================================= */

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

/* =========================================================
   TYPES
========================================================= */

type WithdrawField = keyof typeof initialWithdrawForm

/* =========================================================
   INPUT VALIDATION
========================================================= */

const TEXT_ONLY_REGEX = /[^a-zA-Z\s'-]/g

const TEXT_ONLY_FIELDS: WithdrawField[] = [
  'accName',
]

/* =========================================================
   COMPONENT
========================================================= */

export default function Transfer() {
  const { user } = useSelector(
    (state: RootState) => state.data
  )

  const navigate = useNavigate()

  /* =======================================================
     TRANSACTIONS
  ======================================================= */

  const {
    data: transactions = [],
    isLoading,
    refetch,
  } = useQuery<Transaction[]>({
    queryKey: ['all-transactions'],

    queryFn: async () => {
      const res =
        await transact_urls.getAllUserTransact()

      return res.data.msg || []
    },
  })

  const grouped = groupByDate(transactions)

  /* =======================================================
     WITHDRAWAL MODAL
  ======================================================= */

  const [
    opened,
    {
      open,
      close,
    },
  ] = useDisclosure(false)

  /* =======================================================
     KYC MODAL
  ======================================================= */

  const [
    kycNoticeOpened,
    {
      open: openKycNotice,
      close: closeKycNotice,
    },
  ] = useDisclosure(false)

  /* =======================================================
     PIN MODAL
  ======================================================= */

  const [
    pinOpened,
    {
      open: openPinModal,
      close: closePinModal,
    },
  ] = useDisclosure(false)

  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  const [pinMode, setPinMode] =
    useState<'create' | 'verify'>('verify')

  const [pinError, setPinError] = useState('')

  const [pinSubmitting, setPinSubmitting] =
    useState(false)

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [form, setForm] = useState(
    initialWithdrawForm
  )

  const [submitting, setSubmitting] =
    useState(false)

  const [formError, setFormError] =
    useState<Record<string, string>>({})

  /* =======================================================
     USER STATUS
  ======================================================= */

  const isVerified =
    user?.verified === 'verified'

  /*
   * IMPORTANT
   *
   * If user.pin === null:
   *     user needs to create a PIN
   *
   * If user.pin !== null:
   *     user already has a PIN
   */

  const needsTransactionPin =
    user?.pin === null

  const region = useMemo(
    () => getRegion(form.country),
    [form.country]
  )

  /* =======================================================
     OPEN TRANSFER
  ======================================================= */

  const handleTransferClick = () => {
    if (!isVerified) {
      openKycNotice()
      return
    }

    setForm(initialWithdrawForm)
    setFormError({})

    open()
  }

  /* =======================================================
     INPUT HANDLER
  ======================================================= */

  const handleChange =
    (field: WithdrawField) =>
    (arg: any) => {
      let nextValue = arg

      if (
        arg &&
        typeof arg === 'object'
      ) {
        if ('target' in arg) {
          nextValue = arg.target.value
        } else if ('value' in arg) {
          nextValue = arg.value
        }
      }

      if (
        TEXT_ONLY_FIELDS.includes(field)
      ) {
        nextValue = String(nextValue).replace(
          TEXT_ONLY_REGEX,
          ''
        )
      }

      setForm((prev) => ({
        ...prev,
        [field]: nextValue,
      }))

      setFormError((prev) => ({
        ...prev,
        [field]: '',
      }))
    }

  /* =======================================================
     COUNTRY CHANGE
  ======================================================= */

  const handleCountryChange = (
    value: string | null
  ) => {
    const newRegion =
      getRegion(value || '')

    setForm((prev) => ({
      ...prev,

      country: value || '',

      recieveracctnumber:
        newRegion === 'europe'
          ? ''
          : prev.recieveracctnumber,

      routineNumber:
        newRegion === 'usa'
          ? prev.routineNumber
          : '',

      iban:
        newRegion === 'europe'
          ? prev.iban
          : '',

      swiftCode:
        newRegion === 'usa'
          ? ''
          : prev.swiftCode,
    }))

    setFormError((prev) => ({
      ...prev,
      country: '',
    }))
  }

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const errors: Record<
      string,
      string
    > = {}

    if (!form.country) {
      errors.country =
        'Country is required'
    }

    if (!form.accName) {
      errors.accName =
        'Account holder name is required'
    }

    if (!form.bank) {
      errors.bank =
        'Bank name is required'
    }

    /* USA */

    if (region === 'usa') {
      if (!form.recieveracctnumber) {
        errors.recieveracctnumber =
          'Account number is required'
      }

      if (!form.routineNumber) {
        errors.routineNumber =
          'Routing number is required'
      }
    }

    /* EUROPE */

    if (region === 'europe') {
      if (!form.iban) {
        errors.iban =
          'IBAN is required'
      }

      if (!form.swiftCode) {
        errors.swiftCode =
          'SWIFT/BIC code is required'
      }
    }

    /* OTHER */

    if (region === 'other') {
      if (!form.recieveracctnumber) {
        errors.recieveracctnumber =
          'Account number is required'
      }

      if (!form.swiftCode) {
        errors.swiftCode =
          'SWIFT/BIC code is required'
      }
    }

    /* AMOUNT */

    const amountNum =
      Number(form.amount)

    if (
      !form.amount ||
      Number.isNaN(amountNum) ||
      amountNum <= 0
    ) {
      errors.amount =
        'Enter a valid amount'
    } else if (amountNum < 3000) {
      errors.amount =
        'Minimum withdrawal amount is $3,000'
    }

    setFormError(errors)

    return (
      Object.keys(errors).length === 0
    )
  }

  /* =======================================================
     SUBMIT WITHDRAWAL FORM
  ======================================================= */

  const handleSubmitWithdraw =
    async () => {
      if (!isVerified) {
        close()
        openKycNotice()
        return
      }

      if (!validate()) {
        return
      }

      /*
       * Reset PIN fields.
       */

      setPin('')
      setConfirmPin('')
      setPinError('')

      /*
       * IMPORTANT
       *
       * user.pin === null
       *     -> CREATE PIN
       *
       * user.pin !== null
       *     -> VERIFY PIN
       */

      if (user?.pin === null) {
        setPinMode('create')
      } else {
        setPinMode('verify')
      }

      close()
      openPinModal()
    }

  /* =======================================================
     SUBMIT PIN
  ======================================================= */

  const handlePinSubmit =
    async () => {
      setPinError('')

      /* ---------------------------------------------
         PIN FORMAT
      --------------------------------------------- */

      if (!/^\d{4}$/.test(pin)) {
        setPinError(
          'PIN must be exactly 4 digits'
        )

        return
      }

      /* ---------------------------------------------
         CREATE PIN VALIDATION
      --------------------------------------------- */

      if (
        pinMode === 'create'
      ) {
        if (!/^\d{4}$/.test(confirmPin)) {
          setPinError(
            'Confirm PIN must be exactly 4 digits'
          )

          return
        }

        if (pin !== confirmPin) {
          setPinError(
            'PINs do not match'
          )

          return
        }
      }

      try {
        setPinSubmitting(true)

        /* =========================================
           CREATE NEW PIN
        ========================================= */

        if (pinMode === 'create') {
          const response =
            await transact_urls.createTransactionPin({
              pin,
              confirmPin,
            })

          if (
            response?.data?.status &&
            response.data.status !== 200
          ) {
            throw new Error(
              response.data.msg ||
                'Failed to create transaction PIN'
            )
          }

          /*
           * PIN created successfully.
           *
           * Continue with withdrawal using
           * the newly created PIN.
           */

          await submitWithdrawal(pin)

          return
        }

        /* =========================================
           EXISTING PIN
        ========================================= */

        /*
         * Existing PIN.
         *
         * Send the entered PIN to the
         * withdrawal endpoint.
         */

        await submitWithdrawal(pin)
      } catch (error) {
        setPinError(
          error instanceof Error
            ? error.message
            : 'Something went wrong'
        )
      } finally {
        setPinSubmitting(false)
      }
    }

  /* =======================================================
     ACTUALLY SUBMIT WITHDRAWAL
  ======================================================= */

  const submitWithdrawal =
    async (
      transactionPin: string
    ) => {
      const payload = {
        country: form.country,

        region,

        accName: form.accName,

        bank: form.bank,

        amount: Number(form.amount),

        /*
         * Transaction PIN
         */

        pin: transactionPin,

        ...(region === 'usa' && {
          recieveracctnumber:
            form.recieveracctnumber,

          routineNumber:
            form.routineNumber,
        }),

        ...(region === 'europe' && {
          iban: form.iban,

          swiftCode:
            form.swiftCode,
        }),

        ...(region === 'other' && {
          recieveracctnumber:
            form.recieveracctnumber,

          swiftCode:
            form.swiftCode,
        }),
      }

      try {
        setSubmitting(true)

        const response =
          await transact_urls.bankWithdrawal(
            payload
          )

        if (
          response?.data?.status &&
          response.data.status !== 200
        ) {
          throw new Error(
            response.data.msg ||
              'Withdrawal failed'
          )
        }

        /* -------------------------------------------
           SUCCESS
        ------------------------------------------- */

        setForm(initialWithdrawForm)

        setPin('')
        setConfirmPin('')
        setPinError('')

        closePinModal()

        await refetch()
      } catch (error) {
        /*
         * Throw the error back to
         * handlePinSubmit so the PIN
         * modal remains open.
         */

        throw error
      } finally {
        setSubmitting(false)
      }
    }

  /* =======================================================
     TRANSACTION STATUS
  ======================================================= */

  const getStatusClass = (
    status?: string
  ) => {
    const value =
      status?.toLowerCase()

    if (
      value === 'approved' ||
      value === 'completed' ||
      value === 'success' ||
      value === 'successful'
    ) {
      return 'bg-emerald-100 text-emerald-700'
    }

    if (
      value === 'pending' ||
      value === 'processing'
    ) {
      return 'bg-amber-100 text-amber-700'
    }

    if (
      value === 'declined' ||
      value === 'failed' ||
      value === 'rejected'
    ) {
      return 'bg-red-100 text-red-700'
    }

    return 'bg-slate-100 text-slate-600'
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f5f6f7] pb-24">

      {/* HEADER */}

      <header className="px-5 pb-6 pt-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">

          <div>
            <span className="text-3xl font-black tracking-tight text-slate-900">
              B
              <span className="text-yellow-500">
                :
              </span>
            </span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {user?.firstname
              ?.charAt(0)
              ?.toUpperCase() || 'U'}
          </div>

        </div>

        <div className="mt-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Move your money
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Transfer money securely to your bank account.
          </p>
        </div>
      </header>

      {/* MAIN */}

      <main className="px-5 sm:px-8 lg:px-10">

        {/* TRANSFER HERO */}

        <section className="relative overflow-hidden rounded-3xl bg-[#075c40] shadow-lg">

          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10" />

          <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-emerald-400/10" />

          <div className="relative px-6 py-7 sm:px-8 sm:py-9">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-100/70">
                  Available Balance
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  ${formatAmount(user?.currbal)}
                </p>

                <p className="mt-2 text-sm text-emerald-100/70">
                  Online Savings Account
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <HiOutlineArrowsRightLeft className="text-2xl text-white" />
              </div>

            </div>

            <button
              type="button"
              onClick={handleTransferClick}
              className="mt-7 flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 text-left shadow-sm transition hover:bg-slate-50 active:scale-[0.99]"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <HiOutlineArrowsRightLeft className="text-xl text-emerald-700" />
                </div>

                <div>

                  <p className="text-sm font-bold text-slate-900">
                    Make a transfer
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Send money to your bank account
                  </p>

                </div>

              </div>

              <HiOutlineChevronRight className="text-xl text-slate-400" />

            </button>

          </div>
        </section>

        {/* ACCOUNT INFO */}

        <div className="mt-4 rounded-2xl bg-white px-5 py-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-slate-400">
                Account
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                Online Savings
              </p>

            </div>

            <div className="text-right">

              <p className="text-xs text-slate-400">
                Account number
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {user?.acctnumber || '—'}
              </p>

            </div>

          </div>

        </div>

        {/* SECURITY INFORMATION */}

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <HiOutlineShieldCheck className="text-xl text-emerald-700" />
          </div>

          <div>

            <p className="text-sm font-semibold text-emerald-900">
              Secure transfers
            </p>

            <p className="mt-0.5 text-xs leading-5 text-emerald-700">
              Your transfer information is protected and securely processed.
            </p>

          </div>

        </div>

        {/* TRANSACTION SECTION */}

        <section className="mt-9">

          <div className="flex items-end justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep track of your recent transfers.
              </p>

            </div>

            {transactions.length > 0 && (
              <span className="text-xs font-medium text-slate-400">
                {transactions.length}{' '}
                {transactions.length === 1
                  ? 'transaction'
                  : 'transactions'}
              </span>
            )}

          </div>

          {/* Loading */}

          {isLoading && (
            <div className="mt-5 rounded-2xl bg-white p-8 text-center shadow-sm">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading transactions...
              </p>

            </div>
          )}

          {/* Empty */}

          {!isLoading &&
            transactions.length === 0 && (
              <div className="mt-5 rounded-2xl bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <HiOutlineArrowPath className="text-xl text-slate-400" />
                </div>

                <p className="mt-4 font-semibold text-slate-700">
                  No transactions yet
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Your transfer activity will appear here.
                </p>

                <button
                  type="button"
                  onClick={handleTransferClick}
                  className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Make a transfer
                </button>

              </div>
            )}

          {/* Transactions */}

          {!isLoading &&
            transactions.length > 0 && (

              <div className="mt-5 space-y-5">

                {grouped.map(
                  ([date, txs]) => (

                    <div key={date}>

                      <div className="mb-2 flex items-center gap-3">

                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {formatDateHeader(date)}
                        </span>

                        <div className="h-px flex-1 bg-slate-200" />

                      </div>

                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {txs.map((tx) => {

                          const isWithdrawal =
                            tx.title
                              ?.toLowerCase() ===
                            'withdrawal'

                          return (

                            <div
                              key={tx.id}
                              className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 last:border-b-0"
                            >

                              <div className="flex min-w-0 items-start gap-4">

                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                    isWithdrawal
                                      ? 'bg-red-50'
                                      : 'bg-emerald-50'
                                  }`}
                                >

                                  {isWithdrawal ? (
                                    <HiOutlineArrowsRightLeft className="text-xl text-red-600" />
                                  ) : (
                                    <HiOutlineBanknotes className="text-xl text-emerald-600" />
                                  )}

                                </div>

                                <div className="min-w-0">

                                  <p className="truncate text-sm font-semibold text-slate-800 sm:text-base">

                                    {isWithdrawal ? (
                                      'Withdrawal Request'
                                    ) : (
                                      <>
                                        {tx.title ||
                                          'Admin Panel'}

                                        {tx.acctnumber && (
                                          <>
                                            {' · '}

                                            {'*'.repeat(
                                              Math.max(
                                                tx.acctnumber.length -
                                                  4,
                                                0
                                              )
                                            )}

                                            {tx.acctnumber.slice(-4)}
                                          </>
                                        )}
                                      </>
                                    )}

                                  </p>

                                  <div className="mt-1 flex items-center gap-2">

                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${getStatusClass(
                                        tx.status
                                      )}`}
                                    >
                                      {tx.status}
                                    </span>

                                  </div>

                                  <p
                                    className={`mt-2 text-base font-bold ${
                                      isWithdrawal
                                        ? 'text-red-600'
                                        : 'text-emerald-600'
                                    }`}
                                  >

                                    {isWithdrawal
                                      ? '-'
                                      : '+'}

                                    $

                                    {Number(
                                      tx.amount
                                    ).toLocaleString(
                                      'en-US',
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}

                                  </p>

                                </div>

                              </div>

                              <Link
                                to={`/user/transaction/${tx.id}`}
                                className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:px-4 sm:text-sm"
                              >
                                Track

                                <HiOutlineChevronRight className="text-sm" />
                              </Link>

                            </div>
                          )
                        })}

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

        </section>

        {/* TRANSFER INFORMATION */}

        <section className="mt-9">

          <h2 className="text-xl font-bold text-slate-900">
            Transfer information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Things to know before making a transfer.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-300">
                <HiOutlineBuildingLibrary className="text-xl text-blue-600" />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-800">
                Bank details
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Make sure the recipient's banking information is correct.
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <HiOutlineGlobeAlt className="text-xl text-purple-600" />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-800">
                International
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                International transfers may require IBAN or SWIFT/BIC details.
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <HiOutlineBanknotes className="text-xl text-emerald-600" />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-800">
                Minimum transfer
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The minimum withdrawal amount is $3,000.
              </p>

            </div>

          </div>

        </section>

        {/* DISCLOSURES */}

        <section className="mt-10 space-y-4 border-t border-slate-200 pt-6 text-[11px] leading-relaxed text-slate-400">

          <p>
            Beacon Gold Crest by Beacon Gold Crest® is a brand
            of Beacon Gold Crest Bank USA. All deposit products
            are provided or issued by Beacon Gold Crest Bank USA,
            Salt Lake City Branch.
          </p>

          <p>
            Important information about procedures for opening a
            new account: federal law requires financial
            institutions to obtain, verify, and record information
            that identifies each person who opens an account.
          </p>

          <p>
            When you open an account, we may ask for your name,
            address, date of birth, and other information that
            allows us to identify you.
          </p>

        </section>

      </main>

      {/* =====================================================
          WITHDRAWAL MODAL
      ===================================================== */}

      <Modal
        size="32rem"
        centered
        opened={opened}
        onClose={close}
        withCloseButton={false}
        radius="xl"
        padding={0}
      >

        <div>

          {/* Modal Header */}

          <div className="border-b border-slate-100 px-6 py-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-600">
                  Transfer
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Withdrawal Request
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the recipient's banking details.
                </p>

              </div>

              <button
                type="button"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <HiOutlineXMark className="text-lg" />
              </button>

            </div>

          </div>

          {/* Modal Content */}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmitWithdraw()
            }}
            className="px-6 py-6"
          >

            {/* Country */}

            <div className="mb-4">

              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Country
              </label>

              <Select
                placeholder="Select country"
                searchable
                clearable
                value={
                  form.country || null
                }
                onChange={
                  handleCountryChange
                }
                data={COUNTRY_OPTIONS}
                error={
                  formError.country
                }
                radius="md"
              />

            </div>

            {/* Account Holder */}

            <Forminput
              error={
                formError.accName
              }
              content="Account Holder Name"
              type="text"
              placeholder="Account Holder Name"
              value={form.accName}
              onChange={handleChange(
                'accName'
              )}
            />

            {/* Bank */}

            <Forminput
              error={
                formError.bank
              }
              content="Bank Name"
              placeholder="Bank Name"
              value={form.bank}
              onChange={handleChange(
                'bank'
              )}
            />

            {/* USA */}

            {region === 'usa' && (
              <>
                <Forminput
                  error={
                    formError.recieveracctnumber
                  }
                  content="Account Number"
                  type="number"
                  placeholder="Account Number"
                  value={
                    form.recieveracctnumber
                  }
                  onChange={handleChange(
                    'recieveracctnumber'
                  )}
                />

                <Forminput
                  error={
                    formError.routineNumber
                  }
                  content="Routing Number"
                  type="number"
                  placeholder="Routing Number"
                  value={
                    form.routineNumber
                  }
                  onChange={handleChange(
                    'routineNumber'
                  )}
                />
              </>
            )}

            {/* EUROPE */}

            {region === 'europe' && (
              <>
                <Forminput
                  error={
                    formError.iban
                  }
                  content="IBAN"
                  placeholder="e.g. DE89 3704 0044 0532 0130 00"
                  value={form.iban}
                  onChange={handleChange(
                    'iban'
                  )}
                />

                <Forminput
                  error={
                    formError.swiftCode
                  }
                  content="SWIFT / BIC Code"
                  placeholder="e.g. DEUTDEFF"
                  value={form.swiftCode}
                  onChange={handleChange(
                    'swiftCode'
                  )}
                />
              </>
            )}

            {/* OTHER */}

            {region === 'other' && (
              <>
                <Forminput
                  error={
                    formError.recieveracctnumber
                  }
                  content="Account Number"
                  type="number"
                  placeholder="Account Number"
                  value={
                    form.recieveracctnumber
                  }
                  onChange={handleChange(
                    'recieveracctnumber'
                  )}
                />

                <Forminput
                  error={
                    formError.swiftCode
                  }
                  content="SWIFT / BIC Code"
                  placeholder="e.g. FTBCUS3P"
                  value={form.swiftCode}
                  onChange={handleChange(
                    'swiftCode'
                  )}
                />
              </>
            )}

            {/* Amount */}

            <Forminput
              error={
                formError.amount
              }
              content="Amount"
              placeholder="$3,000.00 minimum"
              type="number"
              value={form.amount}
              onChange={handleChange(
                'amount'
              )}
            />

            {/* Balance */}

            <div className="mb-5 rounded-xl bg-slate-50 px-4 py-3">

              <div className="flex items-center justify-between">

                <span className="text-xs text-slate-500">
                  Available balance
                </span>

                <span className="text-sm font-semibold text-slate-800">
                  ${formatAmount(user?.currbal)}
                </span>

              </div>

            </div>

            <Formbutton
              title={
                submitting
                  ? 'Checking...'
                  : 'Continue'
              }
              loading={
                submitting
              }
            />

          </form>

        </div>

      </Modal>

      {/* =====================================================
          TRANSACTION PIN MODAL
      ===================================================== */}

      <Modal
        size="26rem"
        centered
        opened={pinOpened}
        onClose={() => {
          if (!pinSubmitting) {
            closePinModal()
          }
        }}
        withCloseButton={false}
        radius="xl"
      >

        <div className="px-2 py-3">

          {/* PIN Icon */}

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">

              <HiOutlineShieldCheck className="text-3xl text-emerald-600" />

            </div>

            {/* Title */}

            <h2 className="mt-5 text-xl font-bold text-slate-900">

              {pinMode === 'create'
                ? 'Create Transaction PIN'
                : 'Enter Transaction PIN'}

            </h2>

            {/* Description */}

            <p className="mt-2 text-sm leading-6 text-slate-500">

              {pinMode === 'create'
                ? 'Create a 4-digit PIN to authorize withdrawals and protect your transactions.'
                : 'Enter your 4-digit transaction PIN to authorize this withdrawal.'}

            </p>

          </div>

          <div className="mt-6 space-y-4">

            {/* CREATE PIN */}

            {pinMode === 'create' && (
              <>

                <Forminput
                  error=""
                  content="Transaction PIN"
                  type="password"
                  placeholder="••••"
                  value={pin}
                  onChange={(e: any) => {
                    const value =
                      e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 4)

                    setPin(value)
                    setPinError('')
                  }}
                />

                <Forminput
                  error=""
                  content="Confirm Transaction PIN"
                  type="password"
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e: any) => {
                    const value =
                      e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 4)

                    setConfirmPin(value)
                    setPinError('')
                  }}
                />

              </>
            )}

            {/* EXISTING PIN */}

            {pinMode === 'verify' && (
              <Forminput
                error=""
                content="Transaction PIN"
                type="password"
                placeholder="••••"
                value={pin}
                onChange={(e: any) => {
                  const value =
                    e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 4)

                  setPin(value)
                  setPinError('')
                }}
              />
            )}

            {/* ERROR */}

            {pinError && (
              <div className="rounded-xl bg-red-50 px-4 py-3">

                <p className="text-sm font-medium text-red-600">
                  {pinError}
                </p>

              </div>
            )}

            {/* CONTINUE */}

            <button
              type="button"
              disabled={
                pinSubmitting ||
                submitting
              }
              onClick={
                handlePinSubmit
              }
              className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {pinSubmitting ||
              submitting
                ? 'Processing...'
                : pinMode === 'create'
                  ? 'Create PIN & Continue'
                  : 'Authorize Withdrawal'}

            </button>

            {/* CANCEL */}

            <button
              type="button"
              disabled={
                pinSubmitting ||
                submitting
              }
              onClick={() => {
                closePinModal()
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

          </div>

        </div>

      </Modal>

      {/* =====================================================
          KYC MODAL
      ===================================================== */}

      <Modal
        size="26rem"
        centered
        opened={kycNoticeOpened}
        onClose={
          closeKycNotice
        }
        withCloseButton={false}
        radius="xl"
      >

        <div className="px-2 py-3 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50">

            <HiOutlineShieldCheck className="text-3xl text-amber-600" />

          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            KYC Verification Required
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You need to submit your KYC documents before
            you can make a transfer. You can complete your
            verification from your account settings.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={
                closeKycNotice
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                closeKycNotice()

                navigate(
                  '/user/profile'
                )
              }}
              className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Verify Identity
            </button>

          </div>

        </div>

      </Modal>

    </div>
  )
}