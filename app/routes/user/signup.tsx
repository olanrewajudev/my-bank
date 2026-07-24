import React, { useState } from "react";
import { BiLock, BiPhone } from "react-icons/bi";
import { IoChevronDownSharp, IoChevronForward, IoAddCircleOutline } from "react-icons/io5";
import { Link } from "react-router";
import formatPhone, { FAQs } from "~/component/general/constant";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import UserFooter from "~/component/user/footer";

const SIGNUP_STEPS = ["Get started", "Personal info", "Verify identity", "Open account"]

type PersonalInfo = {
    firstName: string
    mi: string
    lastName: string
    email: string
    phone: string
    agreed: boolean
}



export default function Signup() {
    const [active, setActive] = useState(0)
    const [step, setStep] = useState(0) // index into SIGNUP_STEPS
    const [accountType, setAccountType] = useState("Online Savings Account")
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        firstName: "",
        mi: "",
        lastName: "",
        email: "",
        phone: "",
        agreed: false,
    })

    function handleActive(value: number) {
        if (active !== value) return setActive(value)
        return setActive(0)
    }

    function updatePersonalInfo<K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) {
        setPersonalInfo((prev) => ({ ...prev, [key]: value }))
    }

    const personalInfoValid =
        personalInfo.firstName.trim() !== "" &&
        personalInfo.lastName.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email) &&
        personalInfo.phone.replace(/\D/g, "").length >= 10 &&
        personalInfo.agreed

    function goToStep(index: number) {
        setStep(Math.max(0, Math.min(index, SIGNUP_STEPS.length - 1)))
    }

    return (
        <div className="min-h-screen  bg-white">
            <div>
                {/* Navbar */}
                <nav className="border-b border-gray-200">
                    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
                        <Link to='/'>
                            <img src="/Public/logo_blue.svg" alt="" className="size-28" />
                        </Link>
                        <div className="flex items-center gap-8 text-[#143B63]">
                            <a href="tel:1-855-730-7283" className="flex items-center gap-2 text-sm"><BiPhone className="h-5 w-5" />1-855-730-7283</a>
                            <Link to="/login" className="flex items-center gap-2 text-sm"><BiLock className="h-5 w-5" />Login</Link>
                        </div>
                    </div>
                </nav>
            </div>
            {/* FDIC */}
            <div className=" py-5 ">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-8">
                    <h2 className="text-2xl font-extrabold text-[#143B63]">FDIC</h2>
                    <p className="text-xs italic text-slate-700">
                        FDIC-Insured - Backed by the full faith and credit of the U.S.
                        Government. Goldman Sachs Bank USA, Salt Lake City Branch.
                    </p>
                </div>
            </div>

            {/* Step Indicator */}
            <section className="mx-auto max-w-3xl px-20 pt-12">
                <div className="flex items-center justify-between">
                    {SIGNUP_STEPS.map((label, index) => {
                        const isDone = index < step
                        const isCurrent = index === step
                        return (
                            <React.Fragment key={label}>
                                <div className="flex flex-col justify-center items-center gap-3">
                                    <span className={`text-sm ${isDone || isCurrent ? "text-[#2f9e6f]" : "text-slate-400"}`}>{label}</span>
                                    <button
                                        onClick={() => index < step && goToStep(index)}
                                        className={`h-5 w-5 rounded-full border-2 transition ${isDone ? "border-[#2f9e6f] bg-[#2f9e6f]" : isCurrent ? "border-[#2f9e6f] bg-[#2f9e6f]" : "border-slate-300 bg-white"}`}
                                    />
                                </div>
                                {index < SIGNUP_STEPS.length - 1 && (<div className="mx-2 h-px flex-1 bg-slate-200" />)}
                            </React.Fragment>
                        )
                    })}
                </div>
            </section>
            <section className="py-5 w-[55%] mx-auto">

                {/* Step content */}
                <section className="mx-auto max-w-3xl px-8 py-20">
                    {step === 0 && (
                        <div>
                            <h1 className="text-5xl text-[#101d3d]">Let's get started</h1>
                            <p className="mt-8 text-base text-[#101d3d]">
                                Already a customer? Please{" "}
                                <Link to="/login" className="text-blue underline underline-offset-4">log in.</Link>{" "}
                                We'll pre-fill your info to save time.
                            </p>

                            <label className="mt-12 block text-lg text-[#101d3d]">Account type</label>
                            <div className="relative mt-3">
                                <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full appearance-none rounded-sm border border-slate-300 px-6 py-4 text-xl text-[#101d3d] outline-none">
                                    <option>Online Savings Account</option>
                                    <option>Certificate of Deposit</option>
                                    <option>High-Yield CD</option>
                                </select>
                                <IoChevronDownSharp className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue" />
                            </div>

                            <p className="mt-4 text-lg text-[#101d3d]">No minimum balance required. No fees.</p>

                            <p className="mt-6 text-base leading-relaxed text-slate-700">
                                Annual Percentage Yield (APY) is 3.40% with an interest rate of 3.34% as of
                                July 23, 2026. Interest rate and APY are variable and may change at our
                                discretion at any time without notice. For more information regarding
                                interest rate calculation, please refer to our{" "}
                                <Link to="/terms" className="text-blue underline underline-offset-4">Deposit Account Agreement.</Link>
                            </p>

                            <div className="mt-10 border-t border-slate-200" />

                            <button className="mt-10 flex items-center gap-3 text-lg text-blue"><IoAddCircleOutline className="h-6 w-6" />Open multiple accounts at the same time</button>

                            <div className="mt-10 border-t border-slate-200" />
                            <button onClick={() => goToStep(1)} className="mt-12 rounded-sm bg-blue px-12 py-4 text-lg text-white transition hover:opacity-90">Continue</button>
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h1 className="text-4xl text-[#101d3d]">Personal Information</h1>
                            <p className="mt-4 text-lg text-slate-700">This should be your legal full name as it appears on your government ID</p>
                            <div className="mt-10 grid grid-cols-[1fr_100px_1fr] gap-6">
                                <div>
                                    <label className="mb-2 block text-base text-[#101d3d]">First name</label>
                                    <input type="text" placeholder="First name" value={personalInfo.firstName} onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                                        className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-base text-[#101d3d]">MI</label>
                                    <input
                                        type="text"
                                        placeholder="MI"
                                        maxLength={1}
                                        value={personalInfo.mi}
                                        onChange={(e) => updatePersonalInfo("mi", e.target.value)}
                                        className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-base text-[#101d3d]">Last name</label>
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        value={personalInfo.lastName}
                                        onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                                        className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                                    />
                                </div>
                            </div>

                            <label className="mt-10 mb-2 flex items-center gap-2 text-base text-[#101d3d]">
                                Email address
                            </label>
                            <input
                                type="email"
                                placeholder="email@address.com"
                                value={personalInfo.email}
                                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                                className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                            />

                            <label className="mt-10 mb-2 block text-base text-[#101d3d]">Phone number</label>
                            <input
                                type="tel"
                                placeholder="(###) ###-####"
                                value={personalInfo.phone}
                                onChange={(e) => updatePersonalInfo("phone", formatPhone(e.target.value))}
                                className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                            />

                            <label className="mt-10 flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={personalInfo.agreed}
                                    onChange={(e) => updatePersonalInfo("agreed", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue"
                                />
                                <span className="text-lg leading-relaxed text-[#101d3d]">
                                    By checking this box, you agree to and acknowledge the receipt of: (i){" "}
                                    <Link to="/esign" className="text-blue underline underline-offset-4">
                                        eSign Agreement
                                    </Link>{" "}
                                    to receive documents from us electronically; and (ii) Our{" "}
                                    <Link to="/privacy" className="text-blue underline underline-offset-4">
                                        Privacy Policy
                                    </Link>
                                    ,{" "}
                                    <Link to="/privacy-notice" className="text-blue underline underline-offset-4">
                                        Privacy Notice
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/terms" className="text-blue underline underline-offset-4">
                                        Site Terms
                                    </Link>
                                </span>
                            </label>

                            <button
                                onClick={() => personalInfoValid && goToStep(2)}
                                disabled={!personalInfoValid}
                                className={`mt-10 rounded-sm px-14 py-4 text-lg text-white transition ${personalInfoValid ? "bg-blue hover:opacity-90" : "cursor-not-allowed bg-slate-300"
                                    }`}
                            >
                                Continue
                            </button>

                            <p className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                                <BiLock className="h-4 w-4" />
                                Your information is protected with 128-bit SSL encryption.
                            </p>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h1 className="text-4xl text-[#101d3d]">Verify identity</h1>
                            <p className="mt-4 text-lg text-slate-700">
                                Add your identity verification fields here (SSN, date of birth, address).
                            </p>
                            <button
                                onClick={() => goToStep(3)}
                                className="mt-12 rounded-sm bg-blue px-12 py-4 text-lg text-white transition hover:opacity-90"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h1 className="text-4xl text-[#101d3d]">Open account</h1>
                            <p className="mt-4 text-lg text-slate-700">
                                Add funding source and final review/submit fields here.
                            </p>
                        </div>
                    )}
                </section>

                {/* Help Section */}
                <section className="py-10">
                    <div className="mx-auto max-w-4xl px-8">
                        <h2 className="mb-12 text-3xl font-light">Help and support</h2>

                        <p className="mb-6 text-xl">Need help?{" "}
                            <a href="#" className="text-base text-blue font-light underline underline-offset-4">Contact Us</a>
                        </p>

                        {/* Accordion */}
                        <div className="w-full max-w-2xl mx-auto text-sm">
                            {FAQs.map((item, index: number) => {
                                const exists = index + 1 === active;
                                const ActiveIcon = exists ? IoChevronDownSharp : IoChevronForward;
                                return (
                                    <div key={index} onClick={() => handleActive(index + 1)} className="mb-6 cursor-pointer">
                                        {/* Question row */}
                                        <div className={`flex items-center gap-3 px-2 py-4 ${exists ? 'border border-blue w-fit' : ''}`}>
                                            <ActiveIcon className="text-blue text-xl shrink-0" />
                                            <h1 className="text-lg text-blue">{item.q}</h1>
                                        </div>
                                        {exists && (
                                            <div className="mt-3 px-2 text-slate-700 text-base leading-relaxed">{item.a}</div>
                                        )}
                                        {!exists && <div className="" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </section>
            <UserFooter />
        </div>
    );
}
