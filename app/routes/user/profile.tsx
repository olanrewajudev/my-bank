

import { Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import {
  HiOutlineArrowRightOnRectangle, HiOutlineLockClosed, HiOutlinePencil, HiOutlineLink, HiOutlineChevronRight, HiOutlineChevronDown, HiOutlinePlusCircle, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineIdentification, HiOutlineDocumentArrowUp, HiOutlineExclamationTriangle, HiOutlineShieldCheck, HiOutlineXMark,
  HiOutlineCreditCard,
} from 'react-icons/hi2'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import Cookies from 'js-cookie'

import { CookieName } from '~/component/Apis'
import { Admin_urls } from '~/component/endpoints/admin'
import Formbutton from '~/component/general/form-button'
import Forminput from '~/component/general/form-input'
import { ErrorAlert, HotAlert } from '~/component/utils'
import type { RootState } from '~/lib/store'
import { User_urls } from '~/component/endpoints/user'
import { Card_urls } from '~/component/endpoints/card'
import type { CardItem } from '../../../global'
type MenuKey =
  | 'security'
  | 'feedback'
  | 'kyc'
  | 'linked'
  | 'policy'
  | 'delete'

type KycDocument =
  | 'driver_license'
  | 'passport'
  | 'national_id'
  | ''

export default function Profile() {
  const navigate = useNavigate()

  const { user } = useSelector((state: RootState) => state.data)
  const [openItem, setOpenItem] = useState<MenuKey | null>(null)
  const toggleItem = (key: MenuKey) => { setOpenItem((previous) => previous === key ? null : key) }
  const [openedPassword, { open: openPassword, close: closePassword, },] = useDisclosure(false)
  const [openedLogout, { open: openLogout, close: closeLogout, },] = useDisclosure(false)
  const [openedKyc, { open: openKyc, close: closeKyc, },] = useDisclosure(false)
  const [openedDelete, { open: openDelete, close: closeDelete, },] = useDisclosure(false)
  const [linkedCards, setLinkedCards] = useState<any[]>([])
  const [loadingCards, setLoadingCards] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword,] = useState(false)

  const [kycFrontFile, setKycFrontFile] = useState<File | null>(null)
  const [kycBackFile, setKycBackFile] = useState<File | null>(null)
  const [kycAgreed, setKycAgreed] = useState(false)
  const [kycSubmitting, setKycSubmitting] = useState(false)
  const [kycDocument, setKycDocument] = useState<KycDocument>('')
  const [kycFile, setKycFile] = useState<File | null>(null)
  const [kycSubmitted, setKycSubmitted] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation,] = useState('')
  const [feedback, setFeedback] = useState('')

  const [feedbackSent, setFeedbackSent] = useState(false)

  // State Management
  const [cards, setCards] = useState<CardItem[]>([])
  const [editingCard, setEditingCard] = useState<CardItem | null>(null)
  const [addCardOpen, setAddCardOpen] = useState(false)

  const [number, setNumber] = useState('')
  const [cvv, setCvv] = useState('')
  const [expire, setExpire] = useState('')
  const [loading, setLoading] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      current_password: '',
      password: '',
      confirm_password: '',
    },

    validate: {
      current_password: (value) => !value ? 'Current password is required' : null,
      password: (value) => value.length < 6 ? 'Password must be at least 6 characters' : null,
      confirm_password: (value, values) => value !== values.password ? 'Passwords do not match' : null,
    },
  })

  async function handlePasswordSubmission(values: typeof form.values) {
    try {
      const res = await User_urls.updatePassword(values)
      console.log(values)
      HotAlert(res.data.msg)
      closePassword()
      form.reset()
    } catch (error) {
      ErrorAlert(error instanceof Error ? error.message : 'Unable to update password')
    }
  }

  const submitKyc = async () => {
    if (!kycDocument) {
      ErrorAlert('Please select an identification document')
      return
    }
    if (!kycFrontFile) {
      ErrorAlert('Please upload the front of your identification document')
      return
    }
    if (!kycBackFile) {
      ErrorAlert('Please upload the back of your identification document')
      return
    }
    if (kycFrontFile.size > 10 * 1024 * 1024 || kycBackFile.size > 10 * 1024 * 1024) {
      ErrorAlert('Each document image must not be larger than 10 MB')
      return
    }
    if (!kycAgreed) {
      ErrorAlert('Please agree to the terms before submitting')
      return
    }

    const payload = new FormData()
    payload.append('title', kycDocument)
    payload.append('agreed', String(kycAgreed))
    payload.append('front', kycFrontFile)
    payload.append('back', kycBackFile)

    try {
      setKycSubmitting(true)
      const res = await User_urls.uploadKyc(payload)
      if (res.status === 200) {
        setKycSubmitted(true)
        HotAlert(res.data.msg)
        closeKyc()
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (res.status === 404) {
        ErrorAlert(res.data.msg)
      } else {
        ErrorAlert(res.data.msg)
      }

    } catch (error) {
      ErrorAlert(error instanceof Error ? error.message : 'Unable to submit KYC')
    } finally {
      setKycSubmitting(false)
    }
  }
  const resetKyc = () => {
    setKycDocument('');
    setKycFrontFile(null);
    setKycBackFile(null);
    setKycAgreed(false);
    setKycSubmitted(false);

    closeKyc();
  };
  const deleteAccount = async () => {
    if (
      deleteConfirmation.trim() !== 'DELETE'
    ) {
      ErrorAlert('Type DELETE to confirm')
      return
    }

    try {

      HotAlert('Your account deletion request was submitted')
      setDeleteConfirmation('')
      closeDelete()
    } catch (error) {
      ErrorAlert(error instanceof Error ? error.message : 'Unable to delete account')
    }
  }

  const logout = async () => {
    Cookies.remove(CookieName)

    HotAlert('User logged out successfully')
    setTimeout(() => {
      navigate('/')
      window.location.reload()
    }, 100)
  }

  const menuItems: { key: MenuKey, label: string, icon: typeof HiOutlineLockClosed }[] = [
    { key: 'security', label: 'Security & login', icon: HiOutlineLockClosed, },
    { key: 'kyc', label: 'KYC verification', icon: HiOutlineIdentification, },
    { key: 'feedback', label: 'Give feedback', icon: HiOutlinePencil, },
    { key: 'linked', label: 'Linked Card', icon: HiOutlineLink, },
    { key: 'policy', label: 'Privacy & Legal', icon: HiOutlineLink, },
    // { key: 'delete', label: 'Delete Account', icon: HiOutlineExclamationTriangle, },
  ]

  const getCards = async () => {
    try {
      setLoadingCards(true)

      const res = await Card_urls.getAll()

      if (res.status === 200) {
        setLinkedCards(res.data.data)
      } else {
        ErrorAlert(res.data.msg)
      }
    } catch (error: any) {
      ErrorAlert(error.response?.data?.msg || error.message)
    } finally {
      setLoadingCards(false)
    }

  }

  useEffect(() => {
    getCards()
  }, [])

  const toggleCard = (id: number) => {
    setVisibleCards((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }
  const deleteCard = async (id: number) => {
    try {
      const res = await Card_urls.delete(String(id))

      if (res.status === 200) {
        HotAlert(res.data.msg)

        setLinkedCards((prev) =>
          prev.filter((card) => card.id !== id)
        )
      } else {
        ErrorAlert(res.data.msg)
      }
    } catch (error: any) {
      ErrorAlert(error.response?.data?.msg || error.message)
    }
  }

  const openAddCardModal = () => {
    setEditingCard(null)
    setNumber('')
    setCvv('')
    setExpire('')
    setAddCardOpen(true)
  }

  const closeCardModal = () => {
    if (loading) return
    setEditingCard(null)
    setAddCardOpen(false)
  }

  // Formatters
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 16)
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 4)
    if (numbers.length < 3) return numbers
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
  }

  // Form Submission (Create or Update)
  const handleSaveCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanCardNumber = number.replace(/\s/g, '')

    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      ErrorAlert('Enter a valid card number')
      return
    }

    if (cvv.length < 3) {
      ErrorAlert('Enter a valid CVV')
      return
    }

    if (expire.length !== 5) {
      ErrorAlert('Enter the expiry date as MM/YY')
      return
    }

    try {
      setLoading(true)
      let response

      if (editingCard) {
        // Update Card API Call
        response = await Card_urls.update(editingCard.id, {
          number: cleanCardNumber,
          cvv,
          expire,
        })
      } else {
        // Create Card API Call
        response = await Card_urls.create({
          number: cleanCardNumber,
          cvv,
          expire,
        })
      }

      HotAlert(
        response?.data?.msg ||
        (editingCard
          ? 'Card updated successfully'
          : 'Card added successfully')
      )

      await getCards()
      closeCardModal()
    } catch (error) {
      ErrorAlert(
        (error as Error).message ||
        (editingCard ? 'Unable to update card' : 'Unable to add card')
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {/* ================= PASSWORD MODAL ================= */}
      <Modal
        size="32rem"
        centered
        withCloseButton={false}
        opened={openedPassword}
        onClose={closePassword}
        radius="lg"
      >
        <div className="p-2">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <HiOutlineLockClosed className="text-2xl text-blue-700" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Change password
              </h2>
              <p className="text-sm text-slate-500">
                Keep your account secure
              </p>
            </div>
          </div>

          <form onSubmit={form.onSubmit(handlePasswordSubmission)} className="space-y-1">
            <div className="relative">
              <Forminput
                content="Current Password"
                error={form.errors.current_password?.toString() || ''}
                {...form.getInputProps('current_password')}
                placeholder="Current password"
                type={showCurrentPassword ? 'text' : 'password'}
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-9 text-slate-400"
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <Forminput
                content="New Password"
                error={form.errors.password?.toString() || ''}
                {...form.getInputProps('password')}
                placeholder="New password"
                type={showNewPassword ? 'text' : 'password'}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-9 text-slate-400"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <Forminput content="Confirm New Password" error={form.errors.confirm_password?.toString() || ''} {...form.getInputProps('confirm_password')} placeholder="Confirm new password" type={showConfirmPassword ? 'text' : 'password'}/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-9 text-slate-400">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="pt-3">
              <Formbutton title="Change Password" />
            </div>
          </form>
        </div>
      </Modal>

      {/* ================= LOGOUT MODAL ================= */}
      <Modal size="30rem" centered withCloseButton={false} opened={openedLogout} onClose={closeLogout} radius="lg">
        <div className="p-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50"><HiOutlineArrowRightOnRectangle className="text-2xl text-red-600" /></div>
          <h2 className="mt-5 text-xl font-semibold text-slate-800">Log out?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">You will need to sign in again to access your account.</p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <button type="button" onClick={closeLogout} className="rounded-xl border border-slate-200 py-3 font-medium text-slate-700 hover:bg-slate-50">Cancel</button>

            <button type="button" onClick={logout} className="rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700">Log out</button>
          </div>
        </div>
      </Modal>

      {/* ================= KYC MODAL ================= */}
      <Modal size="36rem" centered opened={openedKyc} onClose={resetKyc} withCloseButton={false} radius="xl">
        <div className="relative p-2">
          <button type="button" onClick={resetKyc} className="absolute right-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <HiOutlineXMark className="text-lg" />
          </button>

          {/* VERIFIED */}
          {user?.verified === 'verified' ? (
            <div className="px-4 py-10 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"><HiOutlineShieldCheck className="text-4xl text-emerald-600" /></div>
              <h2 className="mt-6 text-2xl font-semibold text-slate-800">Identity verified</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Your identity has been successfully verified. You can now access all account features.</p>

              <button type="button" onClick={resetKyc} className="mt-7 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700">Done</button>
            </div>
          ) : user?.submitted === 'true' ? (
            /* SUBMITTED */
            <div className="px-4 py-10 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <HiOutlineShieldCheck className="text-4xl text-blue-700" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-slate-800">
                Verification submitted
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your identification document has been submitted and is currently
                being reviewed.
              </p>

              <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-left text-sm text-blue-800">
                <strong>Review in progress</strong>
                <p className="mt-1 text-blue-700">
                  We will update your account once the verification process is
                  complete.
                </p>
              </div>

              <button
                type="button"
                onClick={resetKyc}
                className="mt-6 w-full rounded-xl bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
              >
                Done
              </button>
            </div>
          ) : (
            /* KYC FORM */
            <div className="px-2 pt-8">

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <HiOutlineIdentification className="text-3xl text-blue-700" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">
                    Verify your identity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    This helps us keep your account secure.
                  </p>
                </div>
              </div>

              {/* DOCUMENT TYPE */}
              <div className="mt-7">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Select identification document
                </p>

                <div className="space-y-3">

                  {[
                    {
                      value: 'driver_license',
                      title: "Driver's License",
                      description: 'Valid government-issued driver license',
                    },
                    {
                      value: 'passport',
                      title: 'Passport',
                      description: 'Passport information page',
                    },
                    {
                      value: 'national_id',
                      title: 'Government-issued ID',
                      description: 'Valid national or state identification',
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setKycDocument(item.value as KycDocument)
                      }
                      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${kycDocument === item.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      {kycDocument === item.value && (
                        <HiOutlineCheckCircle className="text-2xl text-blue-700" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPLOADS */}
              <div className="mt-7">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Upload document
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                  <label
                    htmlFor="kyc-front-file"
                    className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <HiOutlineDocumentArrowUp className="text-2xl text-slate-500" />

                    <span className="mt-2 text-sm font-medium text-slate-700">
                      {kycFrontFile
                        ? kycFrontFile.name
                        : 'Upload front'}
                    </span>

                    <span className="mt-1 text-xs text-slate-400">
                      JPG, PNG or PDF
                    </span>
                  </label>

                  <input
                    id="kyc-front-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) setKycFrontFile(file)
                    }}
                  />

                  <label
                    htmlFor="kyc-back-file"
                    className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <HiOutlineDocumentArrowUp className="text-2xl text-slate-500" />

                    <span className="mt-2 text-sm font-medium text-slate-700">
                      {kycBackFile
                        ? kycBackFile.name
                        : 'Upload back'}
                    </span>

                    <span className="mt-1 text-xs text-slate-400">
                      JPG, PNG or PDF
                    </span>
                  </label>

                  <input
                    id="kyc-back-file"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) setKycBackFile(file)
                    }}
                  />
                </div>
              </div>

              {/* AGREEMENT */}
              <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={kycAgreed}
                  onChange={(event) =>
                    setKycAgreed(event.target.checked)
                  }
                  className="mt-1 h-4 w-4"
                />

                <span>
                  I confirm that this identification document is valid and
                  belongs to me.
                </span>
              </label>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={resetKyc}
                  className="rounded-xl border border-slate-200 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submitKyc}
                  disabled={
                    !kycDocument ||
                    !kycFrontFile ||
                    !kycBackFile ||
                    !kycAgreed ||
                    kycSubmitting
                  }
                  className="rounded-xl bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {kycSubmitting ? 'Submitting...' : 'Submit KYC'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ================= ADD CARD MODAL ================= */}
      {addCardOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingCard ? 'Update card' : 'Link a card'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {editingCard
                    ? 'Update your card details'
                    : 'Add a card to your account'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCardModal}
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <HiOutlineXMark />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="mt-6 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Card number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={number}
                  onChange={(event) =>
                    setNumber(formatCardNumber(event.target.value))
                  }
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Expiry
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={expire}
                    onChange={(event) =>
                      setExpire(formatExpiry(event.target.value))
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    CVV
                  </label>

                  <input
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={cvv}
                    onChange={(event) =>
                      setCvv(
                        event.target.value
                          .replace(/\D/g, '')
                          .slice(0, 4)
                      )
                    }
                    placeholder="123"
                    maxLength={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-700 py-3.5 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
              >
                {loading
                  ? editingCard
                    ? 'Updating card...'
                    : 'Adding card...'
                  : editingCard
                    ? 'Update card'
                    : 'Link card'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= PROFILE PAGE ================= */}

      <div className="min-h-screen bg-[#eef1f3] pb-24">

        {/* HEADER */}
        <div className="relative overflow-hidden px-6 pb-8 pt-6">

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Account
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-800 lg:text-3xl">
                Profile & Settings
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Manage your personal information, security and account preferences.
              </p>
            </div>
          </div>

          {/* Decorative shape */}
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-blue-100 opacity-60" />
        </div>

        {/* PROFILE CARD */}
        <div className="px-6">
          <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-blue-50" />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xl font-semibold text-white">
                  {user?.firstname?.charAt(0)}
                  {user?.lastname?.charAt(0)}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-800">{user?.firstname} {user?.lastname}</h2>
                  <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {user?.verified === 'verified' ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600">Identity verified</span>
                      </>
                    ) : user?.submitted === 'true' ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium text-amber-600">Verification pending</span>
                      </>
                    ) : (
                      <>
                        <span className="h-2 w-2 rounded-full bg-slate-400" />
                        <span className="text-xs font-medium text-slate-500">Identity not verified</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  // Keep your existing contact-info behavior here
                }}
                className="rounded-xl border border-blue-700 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >Contact info</button>
            </div>
          </div>
        </div>

        {/* FDIC */}
        <div className="mt-4 bg-white px-6 py-5">
          <p className="text-xs leading-5 text-slate-600 sm:text-sm">
            <span className="mr-2 font-bold text-blue-900">FDIC</span>
            FDIC-Insured – Backed by the full faith and credit of the U.S. Government.
          </p>
        </div>

        {/* SETTINGS */}
        <div className="mt-4 px-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Account settings</h2>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {menuItems.map(({ key, label, icon: Icon }) => {
              const isOpen = openItem === key
              return (
                <div key={key} className="border-b border-slate-100 last:border-b-0">
                  <button type="button"
                    onClick={() => {
                      if (key === 'kyc') { openKyc(); return }
                      if (key === 'delete') { openDelete(); return }
                      toggleItem(key)
                    }} className="flex w-full items-center justify-between px-5 py-5 text-left transition hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${key === 'security' ? 'bg-blue-50 text-blue-700' : key === 'kyc' ? 'bg-emerald-50 text-emerald-600' : key === 'linked' ? 'bg-purple-50 text-purple-600' : key === 'feedback' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="text-lg" />
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">{label}</p>
                        {key === 'security' && (<p className="mt-0.5 text-xs text-slate-400">Password and login security</p>)}
                        {key === 'kyc' && (
                          <p className="mt-0.5 text-xs text-slate-400">{user?.verified === 'verified' ? 'Identity verified' : user?.submitted === 'true' ? 'Verification pending' : 'Verify your identity'}</p>
                        )}

                        {key === 'linked' && (<p className="mt-0.5 text-xs text-slate-400">Manage your linked cards</p>)}
                        {key === 'feedback' && (<p className="mt-0.5 text-xs text-slate-400">Tell us about your experience</p>)}
                        {key === 'policy' && (<p className="mt-0.5 text-xs text-slate-400">Privacy and terms</p>)}
                      </div>
                    </div>

                    {isOpen ? (
                      <HiOutlineChevronDown className="text-slate-400" />
                    ) : (
                      <HiOutlineChevronRight className="text-slate-400" />
                    )}

                  </button>

                  {/* EXPANDED CONTENT */}
                  {isOpen && (
                    <div className="bg-slate-50 px-5 pb-5">
                      {/* SECURITY */}
                      {key === 'security' && (
                        <div className="rounded-xl bg-white p-4">

                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50"><HiOutlineLockClosed className="text-blue-700" /></div>
                            <div>
                              <p className="font-medium text-slate-800">Password</p>

                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                Change your password regularly to help keep
                                your account secure.
                              </p>
                            </div>
                          </div>

                          <button type="button" onClick={openPassword} className="mt-4 w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800">
                            Change password
                          </button>
                        </div>
                      )}

                      {/* FEEDBACK */}
                      {key === 'feedback' && (
                        <div className="rounded-xl bg-white p-4">
                          {feedbackSent ? (
                            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                              <HiOutlineCheckCircle className="text-xl" />

                              <div>
                                <p className="font-semibold">Feedback submitted</p>
                                <p className="mt-1 text-xs text-emerald-600">Thanks for helping us improve.</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)}
                                rows={4}
                                placeholder="Tell us what you think..."
                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />

                              <button type="button" disabled={!feedback.trim()} onClick={() => { setFeedbackSent(true); setFeedback('') }} className="mt-3 w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:bg-slate-300">Submit feedback</button>
                            </>
                          )}
                        </div>
                      )}

                      {/* LINKED CARDS */}
                      {key === 'linked' && (
                        <div>
                          {loadingCards ? (
                            <div className="rounded-xl bg-white p-6 text-center text-sm text-slate-500">Loading linked cards...</div>
                          ) : linkedCards.length === 0 ? (
                            <div className="rounded-xl bg-white p-6 text-center">
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100"><HiOutlineLink className="text-xl text-slate-500" /></div>
                              <p className="mt-3 text-sm font-medium text-slate-700">No linked cards</p>
                              <p className="mt-1 text-xs text-slate-400">Link a card to make funding easier.</p>
                            </div>
                          ) : (
                            <div className="space-y-3">

                              {linkedCards.map((card) => (
                                <div key={card.id} className="rounded-2xl bg-white p-5 shadow-sm">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50"><HiOutlineCreditCard className="text-xl text-blue-700" /></div>
                                      <div>
                                        <p className="font-semibold text-slate-800">{card.brand || 'Bank Card'}</p>
                                        <p className="mt-1 text-sm text-slate-500"> {visibleCards.includes(card.id) ? card.number : `•••• •••• •••• ${card.number.slice(-4)}`}</p>
                                      </div>

                                    </div>
                                    <div className="flex gap-1">
                                      <button type="button" onClick={() => toggleCard(card.id)} className="flex h-9 w-9 items-center justify-center rounded-full text-blue-600 hover:bg-blue-50">
                                        {visibleCards.includes(card.id) ? <FaEyeSlash /> : <FaEye />}
                                      </button>

                                      <button type="button" onClick={() => deleteCard(card.id)} className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 hover:bg-red-50">
                                        <HiOutlineTrash />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                                    <div>
                                      <p className="text-[11px] uppercase tracking-wide text-slate-400">Expiry</p>
                                      <p className="mt-1 text-sm font-medium text-slate-700">{card.expire}</p>
                                    </div>
                                    <div>
                                      <p className="text-[11px] uppercase tracking-wide text-slate-400">CVV</p>
                                      <p className="mt-1 text-sm font-medium text-slate-700">{visibleCards.includes(card.id) ? card.cvv : '•••'}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <button type="button" onClick={openAddCardModal} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-700 bg-white py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
                            <HiOutlinePlusCircle className="text-lg" />Link new card
                          </button>

                        </div>
                      )}

                      {/* LEGAL */}
                      {key === 'policy' && (
                        <div className="space-y-2">
                          <a href="/privacy-policy" className="flex items-center justify-between rounded-xl bg-white px-4 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <span>Privacy Policy</span>
                            <HiOutlineChevronRight className="text-slate-400" />
                          </a>
                          <a href="/terms-of-service" className="flex items-center justify-between rounded-xl bg-white px-4 py-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <span>Terms of Service</span>
                            <HiOutlineChevronRight className="text-slate-400" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* SECURITY NOTICE */}
        <div className="mt-5 px-6">
          <div className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <HiOutlineShieldCheck className="text-xl text-emerald-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">Your security matters</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">We use security measures to help protect your account and personal information.</p>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="mt-5 px-6">
          <button type="button" onClick={openLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50">
            <HiOutlineArrowRightOnRectangle />
            Log out of account
          </button>
        </div>
      </div>
    </>
  )
}

