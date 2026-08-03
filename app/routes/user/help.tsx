
import React, { useState } from 'react'
import {
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlinePhone,
  HiOutlineBookOpen,
  HiOutlineMagnifyingGlass,
  HiOutlineHandThumbUp,
  HiOutlineHandThumbDown,
  HiOutlinePaperAirplane,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { Link } from 'react-router';

const topics = [
  {
    label: 'Security at Beacon Gold Crest',
    content:
      'Your accounts are protected with 256-bit encryption, biometric login, and 24/7 fraud monitoring. Deposits are FDIC-insured up to the maximum allowed by law.',
  },
  {
    label: 'Deposits & Withdrawals',
    content:
      'You can deposit funds via linked external accounts, mobile check deposit, or wire transfer. Withdrawals to a linked account typically take 1-3 business days.',
  },
  {
    label: 'About Deposit Accounts',
    content:
      'Beacon Gold Crest deposit accounts earn a competitive variable rate with no monthly fees, no minimum balance, and no minimum deposit to open.',
  },
  {
    label: 'Beacon Gold Crest Referred',
    content:
      'Invite friends and family to open a Beacon Gold Crest account. Once their account is funded, you both receive a limited-time rate boost.',
  },
  {
    label: 'Beneficiaries',
    content:
      'You can add or update beneficiaries at any time from your account settings. Beneficiaries can be changed without affecting your existing account terms.',
  },
  {
    label: 'Interest Rates',
    content:
      'Rates are variable and can change at any time. You will be notified by email and in-app alert at least 10 days before any rate decrease takes effect.',
  },
  {
    label: 'Closing Your Account',
    content:
      'You can close your account any time from Settings once your balance is $0, or by requesting a transfer of your full balance to a linked account first.',
  },
]

type ChatMessage = { from: 'user' | 'agent'; text: string }

export default function Help() {
  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const toggleTopic = (label: string) =>
    setOpenTopic((prev) => (prev === label ? null : label))

  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const filtered = topics.filter(
    (t) =>
      t.label.toLowerCase().includes(query.toLowerCase()) ||
      t.content.toLowerCase().includes(query.toLowerCase())
  )
  const visibleTopics = query ? filtered : showAll ? topics : topics.slice(0, 5)

  const [votes, setVotes] = useState<Record<string, 'up' | 'down' | null>>({})
  const castVote = (label: string, vote: 'up' | 'down') =>
    setVotes((prev) => ({ ...prev, [label]: prev[label] === vote ? null : vote }))

  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'agent', text: "Hi! I'm here to help with your Beacon Gold Crest account. What's going on?" },
  ])
  const [draft, setDraft] = useState('')

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [...prev, { from: 'user', text }])
    setDraft('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'agent',
          text: 'Thanks for the details, a support specialist will follow up here shortly. Is there anything else I can check in the meantime?',
        },
      ])
    }, 900)
  }

  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#eef1f3]  pb-24">
      <div className="relative px-6 py-6 pb-10">
        <h1 className="max-w-[70%] lg:text-3xl text-xl font-medium leading-snug text-slate-800">How can we help you today?</h1>
        <div className="absolute right-6 top-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900"><HiOutlineBookOpen className="text-4xl text-blue-300" /></div>
      </div>

      <div className="bg-[#dde3e7] px-6 py-5">
        <p className="text-sm italic text-slate-700">
          <span className="mr-2 font-bold not-italic text-blue-900">FDIC</span>
          FDIC-Insured, Backed by the full faith and credit of the U.S. Government. Goldman
          Sachs Bank USA, Salt Lake City Branch.
        </p>
      </div>

      <div className="px-6 pt-6">
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
          <HiOutlineMagnifyingGlass className="text-lg text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help topics..."
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <HiOutlineXMark className="text-lg text-slate-400" />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 pt-6">
        <h2 className="text-xl font-medium text-slate-800">
          {query ? 'Results for "' + query + '"' : 'Popular Topics'}
        </h2>

        <div className="mt-4 divide-y divide-slate-100 rounded-xl bg-white shadow-sm">
          {visibleTopics.length === 0 && (
            <p className="px-5 py-6 text-sm text-slate-500">
              No topics match your search. Try different words, or contact us below.
            </p>
          )}

          {visibleTopics.map(({ label, content }) => {
            const isOpen = openTopic === label
            const vote = votes[label]
            return (
              <div key={label}>
                <button
                  onClick={() => toggleTopic(label)}
                  className="flex w-full items-center justify-between px-5 py-5 text-left"
                >
                  <span className="text-slate-800">{label}</span>
                  {isOpen ? (
                    <HiOutlineChevronDown className="shrink-0 text-slate-400" />
                  ) : (
                    <HiOutlineChevronRight className="shrink-0 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="bg-slate-50 px-5 pb-5">
                    <p className="text-sm leading-relaxed text-slate-600">{content}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs text-slate-500">Was this helpful?</span>
                      <button
                        onClick={() => castVote(label, 'up')}
                        aria-label="Helpful"
                        className={
                          vote === 'up'
                            ? 'rounded-full p-1.5 bg-emerald-100 text-emerald-600'
                            : 'rounded-full p-1.5 text-slate-400 hover:bg-slate-100'
                        }
                      >
                        <HiOutlineHandThumbUp className="text-base" />
                      </button>
                      <button
                        onClick={() => castVote(label, 'down')}
                        aria-label="Not helpful"
                        className={
                          vote === 'down'
                            ? 'rounded-full p-1.5 bg-red-100 text-red-500'
                            : 'rounded-full p-1.5 text-slate-400 hover:bg-slate-100'
                        }
                      >
                        <HiOutlineHandThumbDown className="text-base" />
                      </button>
                      {vote && (
                        <span className="text-xs text-slate-400">Thanks for your feedback</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {!query && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="mt-4 w-full rounded-md bg-blue-700 py-4 font-medium text-white"
          >
            {showAll ? 'Show fewer topics' : 'See all FAQs'}
          </button>
        )}
      </div>

      <div className="px-6 pt-8">
        <h2 className="text-lg font-medium text-slate-800">Chat with us</h2>
        <button
          onClick={() => setChatOpen(true)}
          className="mt-4 flex w-full items-center justify-between rounded-xl bg-white px-5 py-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
            <div className="text-left">
              <p className="text-slate-800">Chat now</p>
              <p className="text-sm text-slate-500">Our Savings support team is offline</p>
            </div>
          </div>
          <HiOutlineChevronRight className="text-slate-400" />
        </button>
      </div>

      <div className="px-6 pt-8">
        <h2 className="text-lg font-medium text-slate-800">We're here to help</h2>
        <button
          onClick={() => setContactOpen((v) => !v)}
          className="mt-4 flex w-full items-center justify-between rounded-xl bg-white px-5 py-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <HiOutlinePhone className="text-xl text-slate-700" />
            <span className="text-slate-800">Contact Us</span>
          </div>
          {contactOpen ? (
            <HiOutlineChevronDown className="text-slate-400" />
          ) : (
            <HiOutlineChevronRight className="text-slate-400" />
          )}
        </button>

      </div>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center">
          <div className="flex h-[75vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-xl sm:h-[70vh] sm:rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <p className="font-medium text-slate-800">Savings support</p>
              </div>
              <button onClick={() => setChatOpen(false)} aria-label="Close chat">
                <HiOutlineXMark className="text-xl text-slate-500" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      m.from === 'user'
                        ? 'max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-blue-700 text-white'
                        : 'max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-slate-100 text-slate-800'
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage()
                }}
                placeholder="Type a message..."
                className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white disabled:bg-slate-300"
              >
                <HiOutlinePaperAirplane className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}

      {contactOpen && (
        <div className="mt-2 space-y-2 mx-5 rounded-xl bg-white px-5 py-4 shadow-sm">


          <Link to="mailto:support@beacongoldcrest.example.com" className="flex items-center gap-3 rounded-md px-2 py-3 hover:bg-slate-50">
            <HiOutlineEnvelope className="text-lg text-blue-700" />
            <div>
              <p className="text-sm text-slate-800">Email support</p>
              <p className="text-xs text-slate-500">support@beacongoldcrest.example.com</p>
            </div>
          </Link>

        </div>
      )}
    </div>

  )
}