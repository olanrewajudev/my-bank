

import { Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineLockClosed,
  HiOutlinePencil,
  HiOutlineLink,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineIdentification,
  HiOutlineDocumentArrowUp,
  HiOutlineExclamationTriangle,
  HiOutlineShieldCheck,
  HiOutlineXMark,
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

  const [linkedAccounts, setLinkedAccounts,] = useState([
    {
      id: 1,
      name: 'Chase Total Checking',
      mask: '••••4821',
      bank: 'Chase Bank',
      type: 'Checking',
    },
    {
      id: 2,
      name: 'Bank of America Advantage',
      mask: '••••1190',
      bank: 'Bank of America',
      type: 'Savings',
    },
  ])

  const removeAccount = (id: number) => {
    setLinkedAccounts((previous) => previous.filter((account) => account.id !== id)
    )
  }

  const addAccount = () => {
    const id = Date.now()
    setLinkedAccounts((previous) => [
      ...previous,
      {
        id,
        name: 'New Linked Account',
        mask: '••••0000',
        bank: 'Pending bank',
        type: 'Checking',
      },
    ])
  }


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
    closeKyc()
    setKycSubmitted(false)
    setKycDocument('')
    setKycFrontFile(null)
    setKycBackFile(null)
    setKycAgreed(false)
  }
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
    { key: 'linked', label: 'Linked external accounts', icon: HiOutlineLink, },
    { key: 'policy', label: 'Privacy & Legal', icon: HiOutlineLink, },
    { key: 'delete', label: 'Delete Account', icon: HiOutlineExclamationTriangle, },
  ]

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


      <Modal size="34rem" centered opened={openedKyc} onClose={resetKyc} withCloseButton={false} radius="lg">
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
          <button type="button" onClick={openLogout} className="flex items-center gap-2 text-slate-700"><HiOutlineArrowRightOnRectangle />Log out</button>
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
                    if (
                      key === 'kyc'
                    ) {
                      openKyc()
                      return
                    }


                    if (
                      key === 'delete'
                    ) {
                      openDelete()
                      return
                    }
                    toggleItem(key)
                  }}
                    className="flex w-full items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-4">
                      <Icon className="text-xl text-slate-700" /><span className="text-slate-800">{label}</span>
                    </div>

                    {isOpen ? (
                      <HiOutlineChevronDown className="text-slate-400" />
                    ) : (
                      <HiOutlineChevronRight className="text-slate-400" />
                    )}
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

                      {key ===
                        'linked' && (
                          <div> {linkedAccounts.length === 0 && (<p className="py-3 text-sm text-slate-500">       No linked accounts.     </p>)}

                            {linkedAccounts.map((account) => (<div key={account.id} className="flex items-center justify-between border-b py-4">
                              <div>
                                <p className="font-medium">{account.name}</p>
                                <p className="text-xs text-slate-500">
                                  {account.bank}{' '}·{' '}
                                  {account.type}{' '}
                                  {account.mask}
                                </p>
                              </div>

                              <button type="button" onClick={() => removeAccount(account.id)} className="rounded-full p-2 text-red-600"><HiOutlineTrash /></button>
                            </div>
                            ))}

                            <button type="button" onClick={addAccount} className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-700">
                              <HiOutlinePlusCircle />Link another account
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
      </div>
    </>
  )
}

