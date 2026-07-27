// import React, { useState } from 'react'
// import {
//   HiOutlineArrowRightOnRectangle,
//   HiOutlineLockClosed,
//   HiOutlinePencil,
//   HiOutlineExclamationCircle,
//   HiOutlineDocumentText,
//   HiOutlineLink,
//   HiOutlineChevronRight,
//   HiOutlineChevronDown,
// } from 'react-icons/hi2'

// const menuItems = [
//   {
//     label: 'Security & login',
//     icon: HiOutlineLockClosed,
//     content:
//       'Manage your password, two-factor authentication, and biometric login. You can also review recent sign-in activity and log out of other devices from here.',
//   },
//   {
//     label: 'Give feedback',
//     icon: HiOutlinePencil,
//     content:
//       'Tell us what\u2019s working and what isn\u2019t. Your feedback goes directly to the Beacon Gold Crest product team and helps shape future updates.',
//   },
//   {
//     label: 'Alerts',
//     icon: HiOutlineExclamationCircle,
//     content:
//       'Choose which notifications you receive for deposits, withdrawals, low balances, and rate changes, and pick whether they come by push, email, or text.',
//   },
//   {
//     label: 'Documents',
//     icon: HiOutlineDocumentText,
//     content:
//       'View and download your statements, tax forms, and account agreements. Documents are available going back to when your account was opened.',
//   },
//   {
//     label: 'Linked external accounts',
//     icon: HiOutlineLink,
//     content:
//       'See the external bank accounts connected to Beacon Gold Crest for transfers. You can add a new account or remove one you no longer use.',
//   },
// ]

// export default function Profile() {
//   const [openItem, setOpenItem] = useState<string | null>(null)

//   const toggleItem = (label: string) => {
//     setOpenItem((prev) => (prev === label ? null : label))
//   }

//   return (
//     <div className="min-h-screen bg-[#eef1f3] pb-24">
//       <div className="flex justify-end px-6 pt-6">
//         <button className="flex items-center gap-2 text-slate-700">
//           <HiOutlineArrowRightOnRectangle />
//           Log out
//         </button>
//       </div>

//       {/* Identity card */}
//       <div className="mt-4 px-6">
//         <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
//           <p className="text-2xl text-slate-800">sheila Gatewood</p>
//           <p className="mt-1 text-slate-500">gatewoodsheila04@gmail.com</p>
//           <button className="mt-6 w-full rounded-md border border-blue-700 py-3 font-medium text-blue-700">
//             Contact info
//           </button>
//         </div>
//       </div>

//       {/* Referral banner */}
//       <div className="mt-4 px-6">
//         <div className="relative overflow-hidden rounded-xl bg-white px-6 py-6 shadow-sm">
//           <p className="text-slate-500">Beacon Gold Crest Referred</p>
//           <p className="mt-2 max-w-[65%] text-slate-800">
//             Invite a friend to Beacon Gold Crest: Earn a rate boost
//           </p>
//           <button className="mt-3 text-blue-700">Refer a friend &gt;</button>
//           <svg className="pointer-events-none absolute right-0 bottom-0 h-24 w-32" viewBox="0 0 140 100">
//             <polygon points="70,10 130,95 10,95" fill="#0f7a52" />
//           </svg>
//         </div>
//       </div>

//       {/* FDIC banner */}
//       <div className="mt-4 bg-[#dde3e7] px-6 py-5">
//         <p className="text-sm italic text-slate-700">
//           <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
//           FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
//           Sachs Bank USA, Salt Lake City Branch.
//         </p>
//       </div>

//       {/* Menu */}
//       <div className="divide-y divide-slate-100 bg-white">
//         {menuItems.map(({ label, icon: Icon, content }) => {
//           const isOpen = openItem === label
//           return (
//             <div key={label}>
//               <button
//                 onClick={() => toggleItem(label)}
//                 className="flex w-full items-center justify-between px-6 py-6"
//               >
//                 <div className="flex items-center gap-4">
//                   <Icon className="text-xl text-slate-700" />
//                   <span className="text-slate-800">{label}</span>
//                 </div>
//                 {isOpen ? (
//                   <HiOutlineChevronDown className="shrink-0 text-slate-400" />
//                 ) : (
//                   <HiOutlineChevronRight className="shrink-0 text-slate-400" />
//                 )}
//               </button>
//               {isOpen && (
//                 <div className="bg-slate-50 px-6 pb-6 pl-[3.25rem]">
//                   <p className="text-sm leading-relaxed text-slate-600">{content}</p>
//                 </div>
//               )}
//             </div>
//           )
//         })}
//       </div>

//       {/* <UserHeader /> */}
//     </div>
//   )
// }

import React, { useState } from 'react'
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineLockClosed,
  HiOutlinePencil,
  HiOutlineExclamationCircle,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineArrowDownTray,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'

type MenuKey = 'security' | 'feedback' | 'alerts' | 'documents' | 'linked'

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-blue-700' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

export default function Profile() {
  const [openItem, setOpenItem] = useState<MenuKey | null>(null)
  const toggleItem = (key: MenuKey) => setOpenItem((prev) => (prev === key ? null : key))

  // Security & login state
  const [twoFactor, setTwoFactor] = useState(true)
  const [biometric, setBiometric] = useState(false)

  // Give feedback state
  const [feedback, setFeedback] = useState('')
  const [feedbackSent, setFeedbackSent] = useState(false)

  // Alerts state
  const [alerts, setAlerts] = useState({
    deposits: true,
    withdrawals: true,
    lowBalance: false,
    rateChanges: true,
  })
  const toggleAlert = (key: keyof typeof alerts) =>
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }))

  // Documents state
  const documents = [
    { name: '2025 Tax Statement (1099-INT)', date: 'Jan 31, 2026' },
    { name: 'June 2026 Statement', date: 'Jul 1, 2026' },
    { name: 'May 2026 Statement', date: 'Jun 1, 2026' },
    { name: 'Account Agreement', date: 'Feb 12, 2024' },
  ]

  // Linked external accounts state
  const [linkedAccounts, setLinkedAccounts] = useState([
    { id: 1, name: 'Chase Total Checking', mask: '••••4821', bank: 'Chase Bank', type: 'Checking' },
    { id: 2, name: 'Bank of America Advantage', mask: '••••1190', bank: 'Bank of America', type: 'Savings' },
  ])
  const removeAccount = (id: number) =>
    setLinkedAccounts((prev) => prev.filter((a) => a.id !== id))
  const addAccount = () => {
    const id = Date.now()
    setLinkedAccounts((prev) => [
      ...prev,
      { id, name: 'New Linked Account', mask: '••••0000', bank: 'Pending bank', type: 'Checking' },
    ])
  }

  const menuItems: {
    key: MenuKey
    label: string
    icon: typeof HiOutlineLockClosed
  }[] = [
    { key: 'security', label: 'Security & login', icon: HiOutlineLockClosed },
    { key: 'feedback', label: 'Give feedback', icon: HiOutlinePencil },
    { key: 'alerts', label: 'Alerts', icon: HiOutlineExclamationCircle },
    { key: 'documents', label: 'Documents', icon: HiOutlineDocumentText },
    { key: 'linked', label: 'Linked external accounts', icon: HiOutlineLink },
  ]

  return (
    <div className="min-h-screen bg-[#eef1f3] pb-24">
      <div className="flex justify-end px-6 pt-6">
        <button className="flex items-center gap-2 text-slate-700">
          <HiOutlineArrowRightOnRectangle />
          Log out
        </button>
      </div>

      {/* Identity card */}
      <div className="mt-4 px-6">
        <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-2xl text-slate-800">sheila Gatewood</p>
          <p className="mt-1 text-slate-500">gatewoodsheila04@gmail.com</p>
          <button className="mt-6 w-full rounded-md border border-blue-700 py-3 font-medium text-blue-700">
            Contact info
          </button>
        </div>
      </div>

      {/* Referral banner */}
      <div className="mt-4 px-6">
        <div className="relative overflow-hidden rounded-xl bg-white px-6 py-6 shadow-sm">
          <p className="text-slate-500">Beacon Gold Crest Referred</p>
          <p className="mt-2 max-w-[65%] text-slate-800">
            Invite a friend to Beacon Gold Crest: Earn a rate boost
          </p>
          <button className="mt-3 text-blue-700">Refer a friend &gt;</button>
          <svg className="pointer-events-none absolute right-0 bottom-0 h-24 w-32" viewBox="0 0 140 100">
            <polygon points="70,10 130,95 10,95" fill="#0f7a52" />
          </svg>
        </div>
      </div>

      {/* FDIC banner */}
      <div className="mt-4 bg-[#dde3e7] px-6 py-5">
        <p className="text-sm italic text-slate-700">
          <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
          FDIC-Insured – Backed by the full faith and credit of the U.S. Government. Goldman
          Sachs Bank USA, Salt Lake City Branch.
        </p>
      </div>

      {/* Menu */}
      <div className="divide-y divide-slate-100 bg-white">
        {menuItems.map(({ key, label, icon: Icon }) => {
          const isOpen = openItem === key
          return (
            <div key={key}>
              <button
                onClick={() => toggleItem(key)}
                className="flex w-full items-center justify-between px-6 py-6"
              >
                <div className="flex items-center gap-4">
                  <Icon className="text-xl text-slate-700" />
                  <span className="text-slate-800">{label}</span>
                </div>
                {isOpen ? (
                  <HiOutlineChevronDown className="shrink-0 text-slate-400" />
                ) : (
                  <HiOutlineChevronRight className="shrink-0 text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="bg-slate-50 px-6 pb-6">
                  {/* Security & login */}
                  {key === 'security' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-800">Two-factor authentication</p>
                          <p className="text-xs text-slate-500">Require a code at login</p>
                        </div>
                        <Toggle checked={twoFactor} onChange={() => setTwoFactor((v) => !v)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-800">Biometric login</p>
                          <p className="text-xs text-slate-500">Use Face ID or fingerprint</p>
                        </div>
                        <Toggle checked={biometric} onChange={() => setBiometric((v) => !v)} />
                      </div>
                      <button className="w-full rounded-md border border-blue-700 py-2.5 text-sm font-medium text-blue-700">
                        Change password
                      </button>
                    </div>
                  )}

                  {/* Give feedback */}
                  {key === 'feedback' && (
                    <div className="space-y-3">
                      {feedbackSent ? (
                        <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                          <HiOutlineCheckCircle className="text-lg" />
                          Thanks — your feedback was submitted.
                        </div>
                      ) : (
                        <>
                          <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us what's working, or what isn't..."
                            rows={4}
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-700"
                          />
                          <button
                            disabled={!feedback.trim()}
                            onClick={() => {
                              setFeedbackSent(true)
                              setFeedback('')
                            }}
                            className="w-full rounded-md bg-blue-700 py-2.5 text-sm font-medium text-white disabled:bg-slate-300"
                          >
                            Submit feedback
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Alerts */}
                  {key === 'alerts' && (
                    <div className="space-y-4">
                      {[
                        { key: 'deposits' as const, label: 'Deposits' },
                        { key: 'withdrawals' as const, label: 'Withdrawals' },
                        { key: 'lowBalance' as const, label: 'Low balance' },
                        { key: 'rateChanges' as const, label: 'Rate changes' },
                      ].map(({ key: aKey, label: aLabel }) => (
                        <div key={aKey} className="flex items-center justify-between">
                          <p className="text-sm text-slate-800">{aLabel}</p>
                          <Toggle checked={alerts[aKey]} onChange={() => toggleAlert(aKey)} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Documents */}
                  {key === 'documents' && (
                    <div className="divide-y divide-slate-100">
                      {documents.map((doc) => (
                        <div key={doc.name} className="flex items-center justify-between py-3">
                          <div>
                            <p className="text-sm text-slate-800">{doc.name}</p>
                            <p className="text-xs text-slate-500">{doc.date}</p>
                          </div>
                          <button
                            aria-label={`Download ${doc.name}`}
                            className="rounded-full p-2 text-blue-700 hover:bg-blue-50"
                          >
                            <HiOutlineArrowDownTray className="text-lg" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Linked external accounts */}
                  {key === 'linked' && (
                    <div>
                      <div className="divide-y divide-slate-100">
                        {linkedAccounts.length === 0 && (
                          <p className="py-3 text-sm text-slate-500">No linked accounts yet.</p>
                        )}
                        {linkedAccounts.map((acct) => (
                          <div key={acct.id} className="flex items-center justify-between py-3">
                            <div>
                              <p className="text-sm text-slate-800">{acct.name}</p>
                              <p className="text-xs text-slate-500">
                                {acct.bank} · {acct.type} {acct.mask}
                              </p>
                            </div>
                            <button
                              aria-label={`Remove ${acct.name}`}
                              onClick={() => removeAccount(acct.id)}
                              className="rounded-full p-2 text-red-500 hover:bg-red-50"
                            >
                              <HiOutlineTrash className="text-lg" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={addAccount}
                        className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-700"
                      >
                        <HiOutlinePlusCircle className="text-lg" />
                        Link another account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* <UserHeader /> */}
    </div>
  )
}