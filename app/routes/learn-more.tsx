
import React, { useMemo, useState } from 'react'
import { BiCheckCircle, BiChevronDown, BiChevronUp, BiLock } from 'react-icons/bi'
import { Link } from 'react-router'
import Footer from '~/component/general/footer'
import { REFERRAL_STEPS } from '~/component/utils'



function ReferringSteps() {
    return (
        <section className="bg-white px-10 py-20">
            <div className="">
                <h2 className="text-center text-[38px] font-normal text-[#101d3d]">
                    Referring friends to Beacon Gold Crest is easy!
                </h2>

                <div className="mt-16 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 items-center justify-center">
                    {REFERRAL_STEPS.map((step) => (
                        <div key={step.number}>
                            <div className="text-[64px] font-light leading-none text-[#2f9e6f]">
                                {step.number}
                            </div>
                            <div className="mt-4 text-[24px] text-[#101d3d]">{step.title}</div>
                            <p className="mt-4 max-w-[280px] text-[16px] leading-relaxed text-slate-600">
                                {step.body}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="mt-16 text-center text-[17px] text-[#101d3d]">
                    See{' '}
                    <Link to="/terms" className="text-[#3f6fcf] underline underline-offset-2">
                        full terms
                    </Link>{' '}
                    or our{' '}
                    <Link to="/faqs" className="text-[#3f6fcf] underline underline-offset-2">
                        FAQs
                    </Link>{' '}
                    for more information.
                </p>
            </div>
        </section>
    )
}


type Bank = {
    id: string
    name: string
    apy: number // percentage, e.g. 3.4
    isBeacon?: boolean
}

const ALL_BANKS: Bank[] = [
    { id: 'marcus', name: 'Beacon Gold Crest', apy: 3.4, isBeacon: true },
    { id: 'national-average', name: 'National Average', apy: 0.4 },
    { id: 'ally', name: 'Ally Bank', apy: 3.0 },
    { id: 'amex', name: 'American Express', apy: 3.0 },
    { id: 'chase', name: 'Chase', apy: 0.02 },
    { id: 'citibank', name: 'Citibank', apy: 0.03 },
]

const PERIOD_OPTIONS: { label: string; periodsPerYear: number }[] = [
    { label: 'Weekly', periodsPerYear: 52 },
    { label: 'Bi-Weekly', periodsPerYear: 26 },
    { label: 'Monthly', periodsPerYear: 12 },
    { label: 'Annually', periodsPerYear: 1 },
]

function calcInterest(apyPercent: number, deposit: number, recurring: number, periodsPerYear: number, years: number) {
    const apy = apyPercent / 100
    const principalInterest = deposit * apy * years
    const totalPeriods = Math.round(periodsPerYear * years)
    const periodRate = apy / periodsPerYear
    let recurringInterest = 0
    for (let k = 1; k <= totalPeriods; k++) {
        const periodsRemaining = totalPeriods - k
        recurringInterest += recurring * periodRate * periodsRemaining
    }
    return principalInterest + recurringInterest
}

function formatDollars(n: number) {
    return `$${Math.round(n).toLocaleString('en-US')}`
}

function SavingsCalculator() {
    const [initialDeposit, setInitialDeposit] = useState(20000)
    const [recurringDeposit, setRecurringDeposit] = useState(0)
    const [periodLabel, setPeriodLabel] = useState('Monthly')
    const [years, setYears] = useState(1)
    const [pickerOpen, setPickerOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>(ALL_BANKS.map((b) => b.id))

    const periodsPerYear = PERIOD_OPTIONS.find((p) => p.label === periodLabel)?.periodsPerYear ?? 12

    const rows = useMemo(() => {
        const banks = ALL_BANKS.filter((b) => b.isBeacon || selectedIds.includes(b.id))
        const withInterest = banks.map((b) => ({
            ...b,
            interest: calcInterest(b.apy, initialDeposit, recurringDeposit, periodsPerYear, years),
        }))
        const max = Math.max(...withInterest.map((b) => b.interest), 1)
        return withInterest.map((b) => ({ ...b, pct: Math.max((b.interest / max) * 100, 2) }))
    }, [initialDeposit, recurringDeposit, periodsPerYear, years, selectedIds])

    function toggleBank(id: string) {
        setSelectedIds((prev) => {
            const isSelected = prev.includes(id)
            if (isSelected) return prev.filter((x) => x !== id)
            const nonBeaconCount = prev.filter((x) => x !== 'marcus').length
            if (nonBeaconCount >= 4) return prev
            return [...prev, id]
        })
    }

    return (
        <section className="bg-white px-10 py-20">
            <div className="mx-auto max-w-[1600px]">
                <h2 className="text-center text-[34px] font-normal text-[#101d3d]">
                    Beacon Gold Crest Online Savings Account potential interest vs. other banks
                </h2>
                <p className="mt-3 text-center text-[18px] text-slate-600">
                    Choose up to 4 banks to compare
                </p>

                <div className="mt-14 grid grid-cols-1 border border-slate-200 lg:grid-cols-[420px_1fr]">
                    {/* Inputs */}
                    <div className="border-b border-slate-200 p-10 lg:border-b-0 lg:border-r">
                        <label className="block text-[15px] text-[#101d3d]">Initial Deposit</label>
                        <div className="mt-2 flex items-center rounded-sm border border-slate-300 px-4 py-3">
                            <span className="mr-1 text-[17px] text-slate-500">$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={initialDeposit.toLocaleString('en-US')}
                                onChange={(e) => {
                                    const num = Number(e.target.value.replace(/[^0-9]/g, '')) || 0
                                    setInitialDeposit(num)
                                }}
                                className="w-full text-[17px] text-[#101d3d] outline-none"
                            />
                        </div>

                        <label className="mt-8 block text-[15px] text-[#101d3d]">
                            Recurring Deposit Amount
                        </label>
                        <div className="mt-2 flex items-center rounded-sm border border-slate-300 px-4 py-3">
                            <span className="mr-1 text-[17px] text-slate-500">$</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={recurringDeposit.toLocaleString('en-US')}
                                onChange={(e) => {
                                    const num = Number(e.target.value.replace(/[^0-9]/g, '')) || 0
                                    setRecurringDeposit(num)
                                }}
                                className="w-full text-[17px] text-[#101d3d] outline-none"
                            />
                        </div>

                        <label className="mt-8 block text-[15px] text-[#101d3d]">
                            Recurring Deposit Period
                        </label>
                        <div className="relative mt-2">
                            <select
                                value={periodLabel}
                                onChange={(e) => setPeriodLabel(e.target.value)}
                                className="w-full appearance-none rounded-sm border border-slate-300 px-4 py-3 text-[17px] text-[#101d3d] outline-none"
                            >
                                {PERIOD_OPTIONS.map((p) => (
                                    <option key={p.label} value={p.label}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                            <BiChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3f6fcf]" />
                        </div>

                        <label className="mt-8 block text-[15px] text-[#101d3d]">
                            Save for {years} Year{years > 1 ? 's' : ''}
                        </label>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="mt-4 w-full accent-[#3f6fcf]"
                        />
                        <div className="mt-1 flex justify-between text-[14px] text-slate-500">
                            <span>1 Yr</span>
                            <span>10 Yr</span>
                        </div>

                        <p className="mt-8 text-[14px] leading-relaxed text-slate-500">
                            Annual Percentage Yield (APY) as of July 23, 2026. APY may change at
                            any time before or after account is opened.{' '}
                            <Link to="/terms#balance-limits" className="text-[#3f6fcf] underline underline-offset-2">
                                Maximum balance limits apply
                            </Link>
                            .
                        </p>
                        <p className="mt-4 text-[14px] leading-relaxed text-slate-500">
                            This calculator is for illustrative purposes only and may not apply
                            to your individual circumstances. Calculated values assume that
                            principal and interest remain on deposit and are rounded to the
                            nearest dollar. All APYs are subject to change.
                        </p>
                    </div>

                    {/* Comparison panel */}
                    <div className="relative bg-[#101d3d] p-10">
                        <div className="flex items-start justify-between">
                            <p className="text-[20px] text-white">Tap the button to select banks</p>
                            <button
                                onClick={() => setPickerOpen((v) => !v)}
                                className="flex-none rounded-sm bg-[#3f6fcf] px-6 py-3 text-[16px] text-white transition hover:bg-[#4a7ddb]"
                            >
                                Select banks
                            </button>
                        </div>

                        {pickerOpen && (
                            <div className="mt-4 grid grid-cols-2 gap-3 rounded-sm bg-[#182548] p-5 sm:grid-cols-3">
                                {ALL_BANKS.filter((b) => !b.isBeacon).map((b) => (
                                    <label key={b.id} className="flex items-center gap-2 text-[14px] text-slate-200">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(b.id)}
                                            onChange={() => toggleBank(b.id)}
                                            className="accent-[#3f6fcf]"
                                        />
                                        {b.name}
                                    </label>
                                ))}
                            </div>
                        )}

                        <div className="mt-10 space-y-10">
                            {rows.map((bank) => (
                                <div key={bank.id} className="flex items-center gap-6">
                                    <div className="w-44 flex-none">
                                        {bank.isBeacon ? (
                                            <div className="leading-tight">
                                                <div className="flex items-baseline text-[22px] font-semibold text-white">
                                                    Beacon Gold Crest<span className="text-[#5b8def]">:</span>
                                                </div>
                                                <div className="-mt-1 text-[9px] font-semibold tracking-wide text-white">
                                                    by Goldman Sachs<sup className="text-[7px]">®</sup>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-[18px] text-slate-200">{bank.name}</div>
                                        )}
                                        <div className="mt-1 text-[13px] text-slate-400">
                                            {bank.apy.toFixed(2)}% APY
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div
                                            className="h-[6px] rounded-full bg-[#5b8def]"
                                            style={{ width: `${bank.pct}%` }}
                                        />
                                    </div>

                                    <div className="w-20 flex-none text-right text-[22px] text-slate-100">
                                        {formatDollars(bank.interest)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-[13px] leading-relaxed text-slate-500">
                    Rates of the selected banks reflect New York savings rates for similar
                    products at the select banks with a minimum balance of $2,500. Rates may
                    vary by state and do not account for bonus, special or promotional APYs.
                    National Average is based on the APY average for savings accounts with a
                    minimum balance of at least $2,500 as reflected in the FDIC's published
                    National Rates and Rate Caps for Savings deposit products, accurate as of
                    June 15, 2026. See the{' '}
                    <Link to="https://www.fdic.gov" className="text-[#3f6fcf] underline underline-offset-2">
                        FDIC website
                    </Link>{' '}
                    for more information. Rates of selected banks as reported by Curinos,{' '}
                    <Link to="https://www.curinos.com" className="text-[#3f6fcf] underline underline-offset-2">
                        www.curinos.com
                    </Link>
                    . Curinos has obtained the data from the various financial institutions
                    that it tracks and its accuracy cannot be guaranteed. This calculator does
                    not include all savings accounts available in the marketplace.
                </p>
            </div>
        </section>
    )
}

const HIGH_YIELD_BENEFITS = [
    'Everyday high-yield rate—currently 3.40% APY.',
    'Unlimited access to funds.',
    'No fees. No minimum deposit.',
    'Backed by the financial expertise of Goldman Sachs.',
]

function HighYieldBenefits() {
    return (
        <section className="bg-[#f4f5f7] px-10 py-20">
            <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
                <div className="relative overflow-hidden rounded-sm">
                    <svg viewBox="0 0 1200 900" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                        <rect width="1200" height="900" fill="#3f6fcf" />
                        <path
                            d="M0 380 C150 280 300 480 480 380 C650 290 800 250 950 340 C1050 400 1150 380 1200 340 L1200 900 L0 900 Z"
                            fill="#2f9e6f"
                        />
                        <path
                            d="M0 420 C150 340 300 520 480 430 C650 350 800 320 950 400 C1050 450 1150 430 1200 400 L1200 900 L0 900 Z"
                            fill="#245847"
                            opacity="0.5"
                        />
                        <circle cx="820" cy="420" r="70" fill="#245847" opacity="0.6" />
                        <text x="795" y="445" fontSize="70" fill="#1c3d33" fontFamily="sans-serif">
                            $
                        </text>
                        {Array.from({ length: 18 }).map((_, i) => (
                            <rect
                                key={i}
                                x={60 + ((i * 71) % 1080)}
                                y={40 + ((i * 53) % 280)}
                                width="8"
                                height="8"
                                fill="#e8ede9"
                                opacity="0.8"
                                transform={`rotate(${(i * 37) % 360} ${60 + ((i * 71) % 1080)} ${40 + ((i * 53) % 280)})`}
                            />
                        ))}
                        <g transform="translate(760,560)">
                            <circle cx="0" cy="0" r="18" fill="#e8ede9" />
                            <path
                                d="M0 18 L0 70 M0 70 L-30 100 M0 70 L20 100"
                                stroke="#e8ede9"
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <circle cx="70" cy="-10" r="18" fill="#e8ede9" />
                            <path
                                d="M70 8 L70 60 M70 60 L40 95 M70 60 L100 90"
                                stroke="#e8ede9"
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </g>
                    </svg>
                </div>

                <div>
                    <h2 className="text-[33px] font-normal leading-tight text-[#101d3d]">
                        Beacon Gold Crest high-yield savings gives you more than just a rate boost
                    </h2>

                    <ul className="mt-10 space-y-6">
                        {HIGH_YIELD_BENEFITS.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-4">
                                <BiCheckCircle className="mt-0.5 h-5 w-5 flex-none text-[#101d3d]" />
                                <span className="text-[15px] text-[#101d3d]">{benefit}</span>
                            </li>
                        ))}
                    </ul>

                    <Link
                        to="/savings/new/account-creation"
                        className="mt-10 inline-block rounded-sm bg-[#3f6fcf] px-10 py-4 text-[17px] text-white transition hover:bg-[#4a7ddb]"
                    >
                        Open an Account
                    </Link>
                </div>
            </div>
        </section>
    )
}

const REFERRAL_FAQS: { question: string; answer: React.ReactNode }[] = [
    {
        question: 'What is Beacon Gold Crest Referred?',
        answer: (
            <>
                Beacon Gold Crest customers earn a 1.00% APY Rate Boost ("Beacon Gold Crest Referred Rate Boost") on
                their Beacon Gold Crest Online Savings Account(s) on which they're the primary owner when
                they refer a customer who is new to Beacon Gold Crest. The new customer earns a rate
                boost, too.{' '}
                <Link to="/terms" className="text-[#3f6fcf] underline underline-offset-2">
                    Click here
                </Link>{' '}
                for the current Beacon Gold Crest Referred program details and terms.
            </>
        ),
    },
    {
        question: 'How will the Beacon Gold Crest Referred Rate Boost be paid out?',
        answer: 'Add the payout details here.',
    },
    {
        question: 'What kind of accounts can earn a Beacon Gold Crest Referred Bonus?',
        answer: 'Add eligible account types here.',
    },
    {
        question: 'When will my Beacon Gold Crest Referred Rate Boost take effect?',
        answer: 'Add activation timing here.',
    },
    {
        question: 'Can I refer more than one friend, and how many Beacon Gold Crest Referred Rate Boosts can I earn?',
        answer: 'Add referral limit details here.',
    },
]

function FAQItem({
    question,
    answer,
    defaultOpen = false,
}: {
    question: string
    answer: React.ReactNode
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="border-b border-slate-200 py-8">
            <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
                <span className="text-[20px] text-[#101d3d]">{question}</span>
                {open ? (
                    <BiChevronUp className="h-6 w-6 flex-none text-[#101d3d]" />
                ) : (
                    <BiChevronDown className="h-6 w-6 flex-none text-[#101d3d]" />
                )}
            </button>

            {open && (
                <div className="mt-6 max-w-3xl text-[17px] leading-relaxed text-slate-600">{answer}</div>
            )}
        </div>
    )
}

function ReferralFAQs() {
    return (
        <section className="bg-white px-10 py-20">
            <div className="">
                <h2 className="text-center text-[38px] font-normal text-[#101d3d]">
                    Have questions? We have answers.
                </h2>

                <div className="mt-16">
                    <h3 className="text-[28px] text-[#101d3d]">Frequently Asked Questions</h3>
                    <Link to="/faqs" className="mt-2 inline-block text-[16px] text-[#3f6fcf] underline underline-offset-2">
                        See all Beacon Gold Crest FAQs &gt;
                    </Link>

                    <h4 className="mt-14 text-[24px] text-[#101d3d]">
                        General Questions about the referral program
                    </h4>

                    <div className="mt-2">
                        {REFERRAL_FAQS.map((faq, i) => (
                            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} defaultOpen={i === 0} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
export default function LearnMore() {
    return (
        <div className="bg-[#101d3d]">
            <section className="relative overflow-hidden bg-[#101d3d]">
                {/* Decorative background: clouds + folded mountains + walking figure */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <svg
                        className="absolute bottom-0 right-0 h-[420px] w-[900px] max-w-[70vw]"
                        viewBox="0 0 900 420"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* small cloud, upper */}
                        <g opacity="0.9">
                            <circle cx="150" cy="70" r="26" fill="#4a8a76" />
                            <circle cx="180" cy="60" r="20" fill="#4a8a76" />
                            <circle cx="118" cy="62" r="18" fill="#4a8a76" />
                        </g>
                        {/* small cloud, lower-left */}
                        <g opacity="0.9">
                            <circle cx="60" cy="230" r="24" fill="#4a8a76" />
                            <circle cx="90" cy="222" r="18" fill="#4a8a76" />
                            <circle cx="32" cy="224" r="16" fill="#4a8a76" />
                        </g>

                        {/* left small mountain */}
                        <polygon points="60,420 200,260 280,420" fill="#2e6b58" />
                        <polygon points="200,260 280,420 200,420" fill="#245847" />

                        {/* middle mountain with lollipop tree */}
                        <polygon points="220,420 380,230 500,420" fill="#3a8068" />
                        <polygon points="380,230 500,420 380,420" fill="#2e6b58" />
                        <line x1="430" y1="330" x2="430" y2="380" stroke="#245847" strokeWidth="4" />
                        <circle cx="430" cy="310" r="22" fill="#5aa688" />

                        {/* tall right mountain with walking figure on ridge */}
                        <polygon points="420,420 700,120 900,420" fill="#3a8068" />
                        <polygon points="700,120 900,420 700,420" fill="#2e6b58" />
                        <polygon points="640,230 700,120 760,230" fill="#4a9077" opacity="0.6" />

                        {/* walking figure */}
                        <g transform="translate(760,150)">
                            <circle cx="0" cy="0" r="8" fill="#e8ede9" />
                            <path
                                d="M0 8 L0 40 M0 18 L-16 30 M0 18 L16 10 M0 40 L-14 66 M0 40 L14 62"
                                stroke="#e8ede9"
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </g>
                    </svg>
                </div>

                {/* Nav */}
                <nav className="relative z-10 mx-auto flex max-w-[1600px] items-center justify-between px-7 py-6">
                    <div className="flex items-center gap-14">
                        <div className="leading-tight">
                            <div className="flex items-baseline text-[28px] font-semibold text-white">
                                Beacon<span className="text-[#ffe524]">:</span>
                            </div>
                            <div className="-mt-1 text-[11px] font-semibold tracking-wide text-white">
                            </div>
                        </div>

                        <div className="hidden items-center gap-10 text-sm text-slate-200 md:flex">
                            <button className="flex items-center gap-1 border-b-2 border-white pb-6 pt-6 text-white">
                                Savings <BiChevronDown className="h-4 w-4" />
                            </button>
                            <button className="flex items-center gap-1 text-slate-300 hover:text-white">
                                CDs <BiChevronDown className="h-4 w-4" />
                            </button>
                            <button className="flex items-center gap-1 text-slate-300 hover:text-white">
                                Tools &amp; Resources <BiChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="hidden items-center gap-8 text-[15px] text-slate-200 md:flex">
                        <Link to="/compare" className="hover:text-white">
                            Compare savings products
                        </Link>
                        <Link to="/login" className="flex items-center gap-2 text-white">
                            <BiLock className="h-4 w-4" />
                            Log in
                        </Link>
                    </div>
                </nav>

                {/* Content */}
                <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-10 pb-24 pt-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="max-w-xl">
                        <h1 className="text-[3rem] font-normal leading-[1.05] text-white">Give your savings a boost     </h1>
                        <p className="mt-8 text-[15px] leading-relaxed text-slate-200">
                            It's simple: When you open an Online Savings Account and refer a
                            friend who's new to Beacon Gold Crest, you both could earn an extra{' '}
                            <span className="text-[#7fd6b0]">1.00% APY</span> for 3 months.
                        </p>

                        <div className="mt-8 text-base text-white">
                            <p>Already a customer?</p>
                            <p><Link to="/login" className="text-[#7fb2f0] underline underline-offset-2">Log in</Link>{' '}to refer friends.</p>
                        </div>

                        <div className="mt-6 text-base text-white">
                            <p>Received a link from a Beacon Gold Crest customer?</p>
                            <p>You must use that link to earn a referral rate boost.</p>
                        </div>

                        <div className="mt-9 flex flex-wrap items-center gap-8">
                            <Link to="/savings/new/account-creation" className="rounded-sm border-2 border-[#5b8def] bg-[#3f6fcf] px-10 py-4 text- text-white transition hover:bg-[#4a7ddb]">
                                Open an Account
                            </Link>
                            <Link to="/terms" className="text-sm text-[#7fb2f0] underline underline-offset-2">See full terms</Link>
                        </div>

                        <div className="mt-14 flex items-start gap-4">
                            <div className="mt-1 flex h-9 w-14 flex-none items-center justify-center rounded-sm bg-white text-[13px] font-bold tracking-tight text-[#101d3d]">
                                FDIC
                            </div>
                            <p className="text-[14px] italic leading-snug text-slate-300">FDIC-Insured – Backed by the full faith and credit of the U.S.Government. Beacon Gold Crest Bank USA, Salt Lake City Branch.</p>
                        </div>
                    </div>

                    {/* Right column: promo card */}
                    <div className="lg:pt-2">
                        <div className="max-w-lg rounded-sm bg-white p-10 shadow-xl">
                            <h2 className="text-[22px] text-[#101d3d]">
                                Online Savings Account with referral rate boost
                            </h2>

                            <div className="mt-6 flex flex-wrap items-baseline gap-3">
                                <span className="text-[42px] font-medium text-[#101d3d]">
                                    3.40% APY
                                </span>
                                <span className="text-[42px] font-medium text-[#2f9e6f]">
                                    +1.00% APY
                                </span>
                            </div>

                            <p className="mt-6 text-[15px] leading-relaxed text-slate-600">
                                Annual Percentage Yield as of July 23, 2026. APY may change at
                                any time before or after account is opened.{' '}
                                <Link to="/terms#balance-limits" className="text-[#3f6fcf] underline underline-offset-2">
                                    Maximum balance limits apply
                                </Link>
                                .
                            </p>

                            <p className="mt-5 text-[15px] leading-relaxed text-slate-600">
                                The Beacon Gold Crest Referred Rate Boost is a promotional Annual
                                Percentage Yield (APY) increase of 1.00%, on top of the stated
                                Online Savings Account APY available at marcus.com (currently
                                3.40% APY), for a period of 3 months. Upon expiration of the
                                3-month Promotional Rate Period, the Online Savings Account
                                will revert to earning the Online Savings Account APY available
                                at that time; an account that earned one Beacon Gold Crest Referred Rate
                                Boost would earn a combined APY of 3.65%, assuming the Online
                                Savings Account APY remained the same for the remaining 9
                                months.{' '}
                                <Link to="/terms" className="text-[#3f6fcf] underline underline-offset-2">
                                    See full terms.
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <ReferringSteps />

            <SavingsCalculator />

            <HighYieldBenefits />

            <ReferralFAQs />
            {/* high yield */}
            <Footer />
        </div>
    )
}
