import React, { useState } from 'react'
import {
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlinePhone,
  HiOutlineMagnifyingGlass,
  HiOutlineHandThumbUp,
  HiOutlineHandThumbDown,
  HiOutlinePaperAirplane,
  HiOutlineEnvelope,
  HiOutlineClock,
  HiOutlineXMark,
  HiOutlineChatBubbleLeftRight,
} from 'react-icons/hi2'
import { useSelector } from 'react-redux'
import {
  Modal,
  Button,
  TextInput,
  Stack,
  Group,
} from '@mantine/core'
import type { RootState } from '~/lib/store'

const topics = [
  {
    label: 'Security at Beacon Gold Crest',
    content:
      'Your accounts are protected with encryption, biometric login, and 24/7 fraud monitoring. Deposits are FDIC-insured up to the maximum allowed by law.',
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
      'Rates are variable and can change at any time. You will be notified by email and in-app alert before any applicable rate change takes effect.',
  },
  {
    label: 'Closing Your Account',
    content:
      'You can close your account any time from Settings once your balance is $0, or by requesting a transfer of your full balance to a linked account first.',
  },
]

type ChatMessage = {
  from: 'user' | 'agent'
  text: string
}

export default function Help() {
  const { user } = useSelector((state: RootState) => state.data)

  const [openTopic, setOpenTopic] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const [votes, setVotes] = useState<
    Record<string, 'up' | 'down' | null>
  >({})

  const [chatOpen, setChatOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  const [draft, setDraft] = useState('')

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: 'agent',
      text: "Hi! I'm here to help with your Beacon Gold Crest account. What's going on?",
    },
  ])

  const toggleTopic = (label: string) => {
    setOpenTopic((prev) => (prev === label ? null : label))
  }

  const castVote = (
    label: string,
    vote: 'up' | 'down'
  ) => {
    setVotes((prev) => ({
      ...prev,
      [label]: prev[label] === vote ? null : vote,
    }))
  }

  const filtered = topics.filter(
    (topic) =>
      topic.label
        .toLowerCase()
        .includes(query.toLowerCase()) ||
      topic.content
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  const visibleTopics = query
    ? filtered
    : showAll
      ? topics
      : topics.slice(0, 5)

  const sendMessage = () => {
    const text = draft.trim()

    if (!text) return

    setMessages((prev) => [
      ...prev,
      {
        from: 'user',
        text,
      },
    ])

    setDraft('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'agent',
          text:
            'Thanks for the details. A support specialist will follow up here shortly. Is there anything else I can help you with?',
        },
      ])
    }, 900)
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] pb-24">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="px-5 pb-6 pt-6 sm:px-8 lg:px-10">

        <div className="flex items-center justify-between">

          {/* Logo */}
          <div>
            <span className="text-3xl font-black tracking-tight text-slate-900">
              B<span className="text-yellow-500">:</span>
            </span>
          </div>

          {/* User */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {user?.firstname?.charAt(0)?.toUpperCase() || 'U'}
          </div>

        </div>

      </header>


      {/* =====================================
          MAIN
      ====================================== */}

      <main className="px-5 sm:px-8 lg:px-10">

        {/* =====================================
            HELP HERO
        ====================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-[#075c40] px-6 py-7 shadow-lg sm:px-8 sm:py-9">

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/10" />

          <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-emerald-400/10" />

          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <HiOutlineChatBubbleLeftRight className="text-2xl text-white" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-100/70">
                  Help Center
                </p>

                <p className="mt-1 text-sm text-emerald-50/80">
                  Beacon Gold Crest Support
                </p>
              </div>

            </div>


            <h1 className="mt-7 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How can we help you today?
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-emerald-50/75">
              Find answers to common questions about your account,
              transfers, deposits, security and more.
            </p>


            {/* Search */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">

              <HiOutlineMagnifyingGlass className="shrink-0 text-xl text-slate-400" />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search help topics..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="rounded-full p-1 hover:bg-slate-100"
                >
                  <HiOutlineXMark className="text-lg text-slate-400" />
                </button>
              )}

            </div>

          </div>

        </section>


        {/* =====================================
            FDIC / INFORMATION BAR
        ====================================== */}

        <div className="mt-4 rounded-2xl bg-[#dde3e7] px-5 py-4">

          <div className="flex items-start gap-3">

            <div className="shrink-0 rounded-lg bg-white px-2 py-1">
              <span className="text-xs font-bold text-blue-900">
                FDIC
              </span>
            </div>

            <p className="text-xs leading-5 text-slate-600 sm:text-sm">
              FDIC-Insured — Backed by the full faith and credit
              of the U.S. Government.
            </p>

          </div>

        </div>


        {/* =====================================
            POPULAR TOPICS
        ====================================== */}

        <section className="mt-8">

          <div className="flex items-end justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {query
                  ? `Results for "${query}"`
                  : 'Popular Topics'}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Find quick answers to your questions.
              </p>

            </div>

            {!query && (
              <span className="hidden text-xs font-medium text-slate-400 sm:block">
                {topics.length} topics
              </span>
            )}

          </div>


          {/* FAQ Cards */}

          <div className="mt-5 space-y-3">

            {visibleTopics.length === 0 && (

              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <HiOutlineMagnifyingGlass className="text-xl text-slate-400" />
                </div>

                <p className="mt-4 font-semibold text-slate-700">
                  No results found
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Try another search term or contact support.
                </p>

              </div>

            )}


            {visibleTopics.map(({ label, content }) => {

              const isOpen = openTopic === label
              const vote = votes[label]

              return (
                <div
                  key={label}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                    isOpen
                      ? 'border-emerald-200'
                      : 'border-slate-200'
                  }`}
                >

                  {/* Question */}

                  <button
                    type="button"
                    onClick={() => toggleTopic(label)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >

                    <div className="flex items-center gap-4">

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isOpen
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className="text-sm font-bold">
                          ?
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-slate-800 sm:text-base">
                        {label}
                      </span>

                    </div>


                    {isOpen ? (
                      <HiOutlineChevronDown className="shrink-0 text-slate-400" />
                    ) : (
                      <HiOutlineChevronRight className="shrink-0 text-slate-400" />
                    )}

                  </button>


                  {/* Answer */}

                  {isOpen && (

                    <div className="border-t border-slate-100 bg-slate-50 px-5 pb-5 pt-4">

                      <p className="text-sm leading-6 text-slate-600">
                        {content}
                      </p>


                      {/* Feedback */}

                      <div className="mt-5 flex flex-wrap items-center gap-3">

                        <span className="text-xs font-medium text-slate-500">
                          Was this helpful?
                        </span>


                        <button
                          type="button"
                          onClick={() =>
                            castVote(label, 'up')
                          }
                          aria-label="Helpful"
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                            vote === 'up'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-white text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                          }`}
                        >
                          <HiOutlineHandThumbUp />
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            castVote(label, 'down')
                          }
                          aria-label="Not helpful"
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                            vote === 'down'
                              ? 'bg-red-100 text-red-500'
                              : 'bg-white text-slate-400 hover:bg-red-50 hover:text-red-500'
                          }`}
                        >
                          <HiOutlineHandThumbDown />
                        </button>


                        {vote && (
                          <span className="text-xs text-slate-400">
                            Thanks for your feedback.
                          </span>
                        )}

                      </div>

                    </div>

                  )}

                </div>
              )
            })}

          </div>


          {/* Show all */}

          {!query && (
            <button
              type="button"
              onClick={() =>
                setShowAll((value) => !value)
              }
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-white py-4 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
            >
              {showAll
                ? 'Show fewer topics'
                : 'See all FAQs'}
            </button>
          )}

        </section>


        {/* =====================================
            CONTACT SUPPORT
        ====================================== */}

        <section className="mt-9">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              We're here to help
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Can't find what you're looking for?
            </p>

          </div>


          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Contact Us */}

            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="group flex min-h-[145px] items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <HiOutlinePhone className="text-2xl text-blue-600" />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  Contact Us
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Get in touch with our support team.
                </p>

              </div>

              <HiOutlineChevronRight className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />

            </button>


            {/* Live Chat */}

            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="group flex min-h-[145px] items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <HiOutlineChatBubbleLeftRight className="text-2xl text-emerald-600" />
                </div>

                <div className="mt-4 flex items-center gap-2">

                  <h3 className="font-bold text-slate-900">
                    Live Support
                  </h3>

                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Chat with a support specialist.
                </p>

              </div>

              <HiOutlineChevronRight className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />

            </button>

          </div>

        </section>


        {/* =====================================
            SUPPORT HOURS
        ====================================== */}

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <HiOutlineClock className="text-xl text-slate-500" />
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-800">
              Support availability
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Live support is available 24/7.
            </p>

          </div>

        </div>


        {/* =====================================
            DISCLOSURES
        ====================================== */}

        <section className="mt-10 space-y-4 border-t border-slate-200 pt-6 text-[11px] leading-relaxed text-slate-400">

          <p>
            Beacon Gold Crest by Beacon Gold Crest® is a brand
            of Beacon Gold Crest Bank USA. All deposit products
            are provided or issued by Beacon Gold Crest Bank USA,
            Salt Lake City Branch.
          </p>

          <p>
            Important information about procedures for opening a
            new account: federal law requires financial institutions
            to obtain, verify, and record information that identifies
            each person who opens an account.
          </p>

          <p>
            When you open an account, we may ask for your name,
            address, date of birth, and other information that allows
            us to identify you.
          </p>

        </section>

      </main>


      {/* =====================================
          CONTACT MODAL
      ====================================== */}

      <Modal
        opened={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Contact Beacon Gold Crest"
        centered
        radius="lg"
        size="md"
      >

        <Stack gap="md">

          <div className="rounded-2xl bg-emerald-50 p-4">

            <p className="text-sm font-semibold text-emerald-900">
              We're here to help
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Choose one of the options below to get in touch
              with our support team.
            </p>

          </div>


          <a
            href="mailto:support@beacongoldcrest.gmail.com"
            className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <HiOutlineEnvelope className="text-xl text-blue-600" />
            </div>

            <div>

              <p className="text-sm font-semibold text-slate-800">
                Email Support
              </p>

              <p className="mt-1 text-xs text-slate-500">
                support@beacongoldcrest.gmail.com
              </p>

            </div>

          </a>


          <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <HiOutlinePhone className="text-xl text-emerald-600" />
            </div>

            <div>

              <p className="text-sm font-semibold text-slate-800">
                Phone Support
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Available 24/7 through your account support channel.
              </p>

            </div>

          </div>


          <Button
            variant="light"
            color="gray"
            fullWidth
            onClick={() => setContactOpen(false)}
          >
            Close
          </Button>

        </Stack>

      </Modal>


      {/* =====================================
          LIVE CHAT MODAL
      ====================================== */}

      <Modal
        opened={chatOpen}
        onClose={() => setChatOpen(false)}
        title={
          <div className="flex items-center gap-2">

            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span className="font-semibold">
              Live Support
            </span>

          </div>
        }
        centered
        radius="lg"
        size="md"
      >

        <div className="flex h-[55vh] flex-col">

          {/* Messages */}

          <div className="flex-1 space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-4">

            {messages.map((message, index) => (

              <div
                key={index}
                className={
                  message.from === 'user'
                    ? 'flex justify-end'
                    : 'flex justify-start'
                }
              >

                <div
                  className={
                    message.from === 'user'
                      ? 'max-w-[80%] rounded-2xl rounded-br-md bg-emerald-700 px-4 py-3 text-sm leading-5 text-white'
                      : 'max-w-[80%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm leading-5 text-slate-700 shadow-sm'
                  }
                >
                  {message.text}
                </div>

              </div>

            ))}

          </div>


          {/* Input */}

          <div className="mt-3 flex items-center gap-2">

            <TextInput
              className="flex-1"
              placeholder="Type a message..."
              value={draft}
              onChange={(event) =>
                setDraft(event.currentTarget.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  sendMessage()
                }
              }}
            />

            <Button
              color="green"
              onClick={sendMessage}
              disabled={!draft.trim()}
              px="md"
            >
              <HiOutlinePaperAirplane className="text-lg" />
            </Button>

          </div>

        </div>

      </Modal>

    </div>
  )
}