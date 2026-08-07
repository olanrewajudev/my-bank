

import { Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import {
  HiOutlineArrowRightOnRectangle, HiOutlineLockClosed, HiOutlinePencil, HiOutlineLink, HiOutlineChevronRight, HiOutlineChevronDown, HiOutlinePlusCircle, HiOutlineTrash, HiOutlineCheckCircle, HiOutlineIdentification, HiOutlineDocumentArrowUp, HiOutlineExclamationTriangle, HiOutlineShieldCheck, HiOutlineXMark,
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
      <Modal size="32rem" centered withCloseButton={false} opened={openedPassword} onClose={closePassword}>
        <div>
          <div className="mb-6 text-center text-2xl font-semibold">Change Password</div>
          <form onSubmit={form.onSubmit(handlePasswordSubmission)}>
            <div className="relative">
              <Forminput content="Current Password" error={form.errors.current_password?.toString() || ''} {...form.getInputProps('current_password')} placeholder="Current password" type={showCurrentPassword ? 'text' : 'password'} />

              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-9 cursor-pointer text-slate-500">
                {showCurrentPassword ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </button>
            </div>

            <div className="relative">
              <Forminput content="New Password" error={form.errors.password?.toString() || ''} {...form.getInputProps('password')} placeholder="New password" type={showNewPassword ? 'text' : 'password'} />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-9 cursor-pointer text-slate-500">
                {showNewPassword ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </button>
            </div>

            <div className="relative">
              <Forminput content="Confirm New Password" error={form.errors.confirm_password?.toString() || ''} {...form.getInputProps('confirm_password')} placeholder="Confirm new password" type={showConfirmPassword ? 'text' : 'password'} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-9 cursor-pointer text-slate-500"> {showConfirmPassword ? (<FaEye />) : (<FaEyeSlash />)}</button>
            </div>

            <Formbutton title="Change Password" />
          </form>
        </div>
      </Modal>


      <Modal size="32rem" centered withCloseButton={false} opened={openedLogout} onClose={closeLogout}>
        <div className="my-4">
          <div className="mb-2 text-center text-2xl font-bold text-red-600">Logout</div>
          <div className="text-center">
            <div className="mb-5">
              <div className="text-lg font-semibold">Are you sure you want to log out?</div>
              <p>You will need to sign in again to continue.</p>
            </div>

            <div className="mt-4 flex gap-3">
              <button type="button" onClick={closeLogout} className="w-full rounded-full bg-slate-200 py-2.5 font-semibold">Cancel</button>
              <button type="button" onClick={logout} className="w-full rounded-full bg-red-700 py-2.5 font-semibold text-white">Logout</button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        size="34rem"
        centered
        opened={openedKyc}
        onClose={resetKyc}
        withCloseButton={false}
        radius="lg"
      >
        <div className="relative p-2">



          {/* CHANGE THE CONDITION HERE */}
          {user?.verified === 'verified' ? (
            <div className="py-10 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <HiOutlineShieldCheck className="text-4xl text-emerald-600" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-emerald-700">
                Identity Verified
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Your identity has been successfully verified.
              </p>

              <button
                type="button"
                onClick={resetKyc}
                className="mt-7 w-full rounded-md bg-emerald-600 py-3 font-semibold text-white"
              >
                Done
              </button>

            </div>
          ) : (
            <>
              <div className="relative p-2">
                <button type="button" onClick={resetKyc} className="absolute right-0 top-0 rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close KYC"><HiOutlineXMark className="text-xl" /></button>
                {user?.submitted === 'true' ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"><HiOutlineShieldCheck className="text-4xl text-emerald-600" /></div>
                    <h2 className="mt-5 text-2xl font-bold">KYC Submitted</h2>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">Your identity document has been submitted for review.</p>
                    <button type="button" onClick={resetKyc} className="mt-7 w-full rounded-md bg-blue-700 py-3 font-semibold text-white">Done</button>
                  </div>
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50"><HiOutlineIdentification className="text-3xl text-blue-700" /></div>
                    <h2 className="mt-4 text-2xl font-bold">Verify your identity</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Select and upload one valid government-issued identification document.</p>
                    <div className="mt-6 space-y-3">
                      <button type="button" onClick={() => setKycDocument('driver_license')}
                        className={`flex w-full items-center justify-between rounded-lg border p-4 text-left ${kycDocument === 'driver_license' ? 'border-blue-700 bg-blue-50' : 'border-slate-200'}`}>
                        <div>
                          <p className="font-semibold">Driver's License</p>
                          <p className="text-xs text-slate-500">Upload a valid driver's license</p>
                        </div>
                        {kycDocument === 'driver_license' && (<HiOutlineCheckCircle className="text-2xl text-blue-700" />)}
                      </button>
                      <button type="button" onClick={() => setKycDocument('passport')}
                        className={`flex w-full items-center justify-between rounded-lg border p-4 text-left ${kycDocument === 'passport' ? 'border-blue-700 bg-blue-50' : 'border-slate-200'}`}>
                        <div>
                          <p className="font-semibold">Passport</p>
                          <p className="text-xs text-slate-500">Upload the passport information page</p>
                        </div>

                        {kycDocument === 'passport' && (<HiOutlineCheckCircle className="text-2xl text-blue-700" />)}
                      </button>
                      <button type="button" onClick={() => setKycDocument('national_id')}
                        className={`flex w-full items-center justify-between rounded-lg border p-4 text-left ${kycDocument === 'national_id' ? 'border-blue-700 bg-blue-50' : 'border-slate-200'}`}>
                        <div>
                          <p className="font-semibold">Government-issued ID</p>
                          <p className="text-xs text-slate-500">Upload a validnational or state ID</p>
                        </div>

                        {kycDocument === 'national_id' && (<HiOutlineCheckCircle className="text-2xl text-blue-700" />
                        )}
                      </button>
                    </div>

                    <div className="mt-5">
                      <label htmlFor="kyc-front-file" className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6">
                        <HiOutlineDocumentArrowUp />
                        <span className="text-sm">{kycFrontFile ? kycFrontFile.name : 'Upload your document (Front Page)'}</span>
                      </label>
                      <input id="kyc-front-file" type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) setKycFrontFile(file) }}
                      />

                      <div className="mt-4">
                        <label htmlFor="kyc-back-file" className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6">
                          <HiOutlineDocumentArrowUp />
                          <span className="text-sm">{kycBackFile ? kycBackFile.name : 'Upload your document (Back Page)'}</span>
                        </label>
                        <input id="kyc-back-file" type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) setKycBackFile(file) }}
                        />
                      </div>

                      <label className="mt-5 flex items-start gap-2 text-sm text-slate-600">
                        <input type="checkbox" checked={kycAgreed} onChange={(event) => setKycAgreed(event.target.checked)} className="mt-1" />
                        I confirm this identification document is valid and belongs to me.
                      </label>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button type="button" onClick={resetKyc} className="w-full rounded-md border py-3 font-semibold">Cancel</button>
                      <button type="button" onClick={submitKyc} disabled={!kycDocument || !kycFrontFile || !kycBackFile || !kycAgreed || kycSubmitting}
                        className="w-full rounded-md bg-blue-700 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                        {kycSubmitting ? 'Submitting...' : 'Submit KYC'}
                      </button>
                    </div>
                  </>
                )}
              </div>            </>
          )}

        </div>
      </Modal>



      {/* =========================
          DELETE ACCOUNT MODAL
      ========================== */}

      <Modal size="30rem" centered opened={openedDelete} onClose={closeDelete} withCloseButton={false} radius="lg">
        <div className="p-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100"><HiOutlineExclamationTriangle className="text-3xl text-red-600" /></div>
          <h2 className="mt-5 text-center text-2xl font-bold">Delete your account?</h2>
          <p className="mt-3 text-center text-sm leading-6 text-slate-500"> This action may permanently remove your account and account information.</p>

          <div className="mt-5">
            <label className="text-sm font-semibold">Type DELETE to confirm</label>
            <input value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)}
              placeholder="DELETE"
              className="mt-2 w-full rounded-md border px-4 py-3 uppercase outline-none"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={closeDelete} className="w-full rounded-md border py-3 font-semibold">Cancel</button>
            <button type="button" onClick={deleteAccount} disabled={deleteConfirmation.trim() !== 'DELETE'}
              className="w-full rounded-md bg-red-700 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Delete Account
            </button>
          </div>
        </div>
      </Modal>

      {/* =========================
          PROFILE PAGE
      ========================== */}

      <div className="min-h-screen bg-[#eef1f3] pb-24">
        <div className="flex justify-end px-6 pt-6">
          <button type="button" onClick={openLogout} className="flex text-red-800 font-semibold items-center gap-2"><HiOutlineArrowRightOnRectangle />Log out</button>
        </div>

        <div className="mt-4 px-6">
          <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-2xl text-slate-800">{user?.firstname}{' '} {user?.lastname}</p>
            <p className="mt-1 text-slate-500">{user?.email}</p>
            <button type="button" className="mt-6 w-full rounded-md border border-blue-700 py-3 font-medium text-blue-700">Contact info</button>
          </div>
        </div>

        <div className="mt-4 bg-[#dde3e7] px-6 py-5">
          <p className="text-sm italic text-slate-700"><span className="mr-2 font-bold not-italic text-blue-900">FDIC</span> FDIC-Insured – Backed by the full faith and credit of the U.S. Government.    </p>
        </div>

        {/* SETTINGS MENU */}

        <div className="divide-y divide-slate-100 bg-white">
          {menuItems.map(
            ({ key, label, icon: Icon, }) => {
              const isOpen = openItem === key
              return (
                <div key={key}>
                  <button type="button" onClick={() => {
                    if (key === 'kyc') { openKyc(); return }
                    if (key === 'delete') { openDelete(); return } toggleItem(key)
                  }} className="flex w-full items-center justify-between px-6 py-6"> <div className="flex items-center gap-4">   <Icon className="text-xl text-slate-700" /><span className="text-slate-800">{label}</span> </div>
                    {isOpen ? (<HiOutlineChevronDown className="text-slate-400" />) : (<HiOutlineChevronRight className="text-slate-400" />)}
                  </button>

                  {isOpen && (
                    <div className="bg-slate-50 px-6 pb-6">
                      {key === 'security' && (<button type="button" onClick={openPassword} className="w-full rounded-md border border-blue-700 py-3 text-sm font-semibold text-blue-700"   >     Change password   </button>)}
                      {key ===
                        'feedback' && (
                          <div>
                            {feedbackSent ? (
                              <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-4 text-emerald-700"><HiOutlineCheckCircle />Feedback submitted</div>
                            ) : (
                              <>
                                <textarea value={feedback}
                                  onChange={(event) => setFeedback(event.target.value)}
                                  rows={4}
                                  placeholder="Tell us what you think..."
                                  className="w-full rounded-md border bg-white p-3 outline-none" />

                                <button type="button" disabled={!feedback.trim()}
                                  onClick={() => {
                                    setFeedbackSent(
                                      true
                                    )
                                    setFeedback('')
                                  }}
                                  className="mt-3 w-full rounded-md bg-blue-700 py-3 text-white disabled:bg-slate-300">
                                  Submit feedback
                                </button>
                              </>
                            )}
                          </div>
                        )}

                      {/* LINKED ACCOUNTS */}

                      {key === 'linked' && (
                        <div>
                          {linkedCards.length === 0 ? (
                            <p className="py-3 text-sm text-slate-500">
                              No linked cards.
                            </p>
                          ) : (
                            linkedCards.map((card) => (
                              <div
                                key={card.id}
                                className="mb-4 rounded-lg border bg-white p-4"
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold">
                                      {card.brand || "Bank Card"}
                                    </p>

                                    <p className="text-sm text-slate-600">
                                      <span className="font-medium">Number:</span>{" "}
                                      {visibleCards.includes(card.id)
                                        ? card.number
                                        : `**** **** **** ${card.number.slice(-4)}`}
                                    </p>
                                    <p className="text-sm text-slate-600 mt-1">
                                      <span className="font-medium">Expiry:</span>{" "}
                                      {card.expire}
                                    </p>
                                    <p className="text-sm text-slate-600 mt-1">
                                      <span className="font-medium">CVV:</span>{" "}
                                      {visibleCards.includes(card.id)
                                        ? card.cvv
                                        : "***"}
                                    </p>


                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleCard(card.id)}
                                      className="rounded-full p-2 text-blue-600"
                                    >
                                      {visibleCards.includes(card.id)
                                        ? <FaEyeSlash />
                                        : <FaEye />}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => deleteCard(card.id)}
                                      className="rounded-full p-2 text-red-600"
                                    >
                                      <HiOutlineTrash />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}

                          <button
                            type="button"
                            className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-700"
                            onClick={openAddCardModal}
                          >
                            <HiOutlinePlusCircle />
                            Link New Card
                          </button>
                        </div>
                      )}
                      {/* LEGAL */}

                      {key ===
                        'policy' && (
                          <div className="space-y-2">
                            {[
                              [
                                'Privacy Policy',
                                '/privacy-policy',
                              ],
                              [
                                'Terms of Service',
                                '/terms-of-service',
                              ],
                              [
                                'Electronic Consent',
                                '/electronic-consent',
                              ],
                              [
                                'Account Agreement',
                                '/account-agreement',
                              ],
                              [
                                'Important Disclosures',
                                '/disclosures',
                              ],
                              [
                                'Contact Support',
                                '/contact',
                              ],
                            ].map(
                              ([title, link,]) => (
                                <a key={link} href={link} className="flex items-center justify-between rounded-md bg-white px-4 py-3 text-sm">{title}<HiOutlineChevronRight /></a>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )
            }
          )}
        </div>

        {/* Add / Update Card Modal */}
        {addCardOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800">
                    {editingCard ? 'Update card' : 'Add a card'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingCard
                      ? 'Modify your card details below'
                      : 'Enter your card details below'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeCardModal}
                  disabled={loading}
                  aria-label="Close modal"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  <HiOutlineXMark className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSaveCard} className="mt-6 space-y-5">
                {/* Card number */}
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Expiry date
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
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>

                  {/* CVV */}
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
                        setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      placeholder="123"
                      maxLength={4}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? editingCard
                      ? 'Updating card...'
                      : 'Adding card...'
                    : editingCard
                      ? 'Update card'
                      : 'Add card'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

