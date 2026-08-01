
import React, { useEffect, useState } from 'react'
import {
  HiOutlinePlus,
  HiOutlineArrowRight,
  HiOutlineXMark,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from 'react-icons/hi2'
import { useSelector } from 'react-redux'
import { Card_urls } from '~/component/endpoints/card'
import { ErrorAlert, HotAlert } from '~/component/utils'
import type { RootState } from '~/lib/store'
import type { CardItem } from '../../../global'


const discoverCards = [
  {
    tag: 'Refer a friend',
    title: 'Earn a rate boost',
    bg: 'bg-emerald-700',
    text: 'text-white',
  },
  {
    tag: 'Open a No-Penalty CD',
    title: 'Fixed rate & flexible access',
    bg: 'bg-slate-900',
    text: 'text-white',
  },
  {
    tag: 'Compare products and rates',
    title: 'Our savings options',
    bg: 'bg-blue-700',
    text: 'text-white',
  },
]

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.data)

  // State Management
  const [cards, setCards] = useState<CardItem[]>([])
  const [editingCard, setEditingCard] = useState<CardItem | null>(null)
  const [addCardOpen, setAddCardOpen] = useState(false)

  const [number, setNumber] = useState('')
  const [cvv, setCvv] = useState('')
  const [expire, setExpire] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch all saved cards
  const fetchCards = async () => {
    try {
      const response = await Card_urls.getAll()
      setCards(response?.data)
    } catch (error) {
      ErrorAlert((error as Error).message || 'Failed to load cards')
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  // Modal Handlers
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

      await fetchCards()
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
    <div className="min-h-screen bg-[#eef1f3] pb-24">
      {/* Logo and welcome banner */}
      <div className="relative overflow-hidden px-6 pb-10 pt-6">
        <h1 className="text-3xl font-bold text-slate-800">B<span className="text-yellow-500">:</span></h1>

        <p className="mt-10 lg:text-3xl text-xl font-medium text-slate-800">Welcome, {user?.firstname}</p>

        <svg className="pointer-events-none absolute  -right-6 bottom-0 h-40 lg:w-64 w-40 opacity-90" viewBox="0 0 260 160">
          <polygon points="120,20 200,150 40,150" fill="#0f7a52" />
          <polygon points="180,50 260,150 100,150" fill="#0a5c3e" opacity="0.85"
          />
          <path d="M60 70 q20 -18 40 0" stroke="#1e3a5f" strokeWidth="4" fill="none" />
        </svg>
      </div>

      {/* FDIC banner */}
      <div className="bg-[#dde3e7] px-6 py-5">
        <p className="text-sm italic text-slate-700">
          <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
          FDIC-Insured – Backed by the full faith and credit of the U.S.
          Government. Beacon Gold Crest Bank USA, Salt Lake City Branch.
        </p>
      </div>

      {/* Accounts & Cards Section */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-slate-800">Accounts</h2>

          <button type="button" aria-label="Add card" onClick={openAddCardModal} className="flex h-10 w-10 items-center justify-center rounded-full bg-blue text-white transition active:scale-95">
            <HiOutlinePlus className="text-2xl" />
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-white p-5 shadow-sm">
          <p className="text-slate-600">Online Savings – {user?.acctnumber?.slice(0, 4)}</p>
          <p className="mt-2 text-3xl font-medium text-emerald-700">${user?.currbonus}</p>
          <p className="mt-1 text-sm text-slate-500">Current balance</p>
        </div>
      </div>

      {/* Discover more */}
      <div className="mt-8 px-6">
        <h2 className="text-xl font-medium text-slate-800">Discover more</h2>

        <div className="no-scrolls mt-4 flex gap-3 overflow-x-auto pb-2">
          {discoverCards.map((card) => (
            <div
              key={card.title}
              className={`min-w-[160px] shrink-0 rounded-md p-5 ${card.bg} ${card.text}`}
            >
              <p className="text-sm">{card.tag}</p>
              <p className="mt-4 text-2xl font-medium leading-snug">
                {card.title}
              </p>
              <HiOutlineArrowRight className="mt-8 text-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Disclosures */}
      <div className="mt-8 space-y-4 px-6 text-xs leading-relaxed text-slate-500">
        <p>
          Beacon Gold Crest by Beacon Gold Crest® is a brand of Beacon Gold
          Crest Bank USA. All deposit products are provided or issued by Beacon
          Gold Crest Bank USA, Salt Lake City Branch. Member FDIC.
        </p>

        <p>
          Important information about procedures for opening a new account: To
          help the government fight the funding of terrorism and money
          laundering activities, federal law requires all financial
          institutions to obtain, verify, and record information that identifies
          each person who opens an account.
        </p>

        <p>
          What this means for you: When you open an account, we will ask for your
          name, address, date of birth, and other information that will allow us to
          identify you.
        </p>
      </div>

      {/* Add / Update Card Modal */}
      {addCardOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">{editingCard ? 'Update card' : 'Add a card'}</h2>
                <p className="mt-1 text-sm text-slate-500">{editingCard ? 'Modify your card details below' : 'Enter your card details below'}</p>
              </div>
              <button type="button" onClick={closeCardModal} disabled={loading} aria-label="Close modal" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                <HiOutlineXMark className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="mt-6 space-y-5">
              {/* Card number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Card number</label>
                <input type="text" inputMode="numeric" autoComplete="cc-number" value={number} onChange={(event) => setNumber(formatCardNumber(event.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Expiry date</label>
                  <input type="text" inputMode="numeric" autoComplete="cc-exp" value={expire} onChange={(event) => setExpire(formatExpiry(event.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">CVV</label>
                  <input type="password" inputMode="numeric" autoComplete="cc-csc" value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-full bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? editingCard ? 'Updating card...' : 'Adding card...' : editingCard ? 'Update card' : 'Add card'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}