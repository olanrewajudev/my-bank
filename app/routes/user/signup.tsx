import { BiLock, BiPhone } from "react-icons/bi";
import { IoChevronDownSharp, IoChevronForward, IoAddCircleOutline, IoInformationCircleOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import formatPhone, { FAQs } from "~/component/general/constant";
import UserFooter from "~/component/user/footer";
import { EMPLOYMENT_STATUSES, ErrorAlert, HotAlert, US_STATES } from "~/component/utils";
import { User_urls } from "~/component/endpoints/user";
import { CookieName } from "~/component/Apis";
import Cookies from 'js-cookie'
import { dispatchToken } from "~/lib/reducer";
import type { PersonalInfo, VerifyIdentity } from "../../../global";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
const SIGNUP_STEPS = ["Get started", "Personal info", "Verify identity", "Open account"]


export default function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [active, setActive] = useState(0)

    const [step, setStep] = useState(0) // index into SIGNUP_STEPS
    const [accountType, setAccountType] = useState("Online Savings Account")
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ firstName: "", mi: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", agreed: false, })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [verifyIdentity, setVerifyIdentity] = useState<VerifyIdentity>({ primaryAddress: "", aptSuite: "", city: "", state: "", zip: "", countryOfCitizenship: "United States", alternatePhone: "", dob: "", confirmSsn: "", employmentStatus: "", })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    function handleActive(value: number) {
        if (active !== value) return setActive(value)
        return setActive(0)
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth",})
    }, [step])
    
    function updatePersonalInfo<K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) {
        setPersonalInfo((prev) => ({ ...prev, [key]: value }))
    }

    function updateVerifyIdentity<K extends keyof VerifyIdentity>(key: K, value: VerifyIdentity[K]) {
        setVerifyIdentity((prev) => ({ ...prev, [key]: value }))
    }
    function formatDOB(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 8)
        const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
        return parts.filter(Boolean).join("/")
    }

    function toApiDob(mmddyyyy: string) {
        // form stores "MM/DD/YYYY", API wants "YYYY-MM-DD"
        const [mm, dd, yyyy] = mmddyyyy.split("/")
        return `${yyyy}-${mm}-${dd}`
    }

    const passwordValid =
        personalInfo.password.length >= 8 &&
        /[A-Za-z]/.test(personalInfo.password) &&
        /\d/.test(personalInfo.password)

    const personalInfoValid =
        personalInfo.firstName.trim() !== "" &&
        personalInfo.lastName.trim() !== "" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email) &&
        personalInfo.phone.replace(/\D/g, "").length >= 10 &&
        passwordValid &&
        personalInfo.password === personalInfo.confirmPassword &&
        personalInfo.agreed

    const verifyIdentityValid =
        verifyIdentity.primaryAddress.trim() !== "" &&
        verifyIdentity.city.trim() !== "" &&
        verifyIdentity.state.trim() !== "" &&
        /^\d{5}$/.test(verifyIdentity.zip) &&
        verifyIdentity.countryOfCitizenship.trim() !== "" &&
        /^\d{2}\/\d{2}\/\d{4}$/.test(verifyIdentity.dob) &&

        verifyIdentity.employmentStatus.trim() !== ""

    function goToStep(index: number) {
        setStep(Math.max(0, Math.min(index, SIGNUP_STEPS.length - 1)))
    }

    const handleSubmission = async () => {
        setError("")
        setLoading(true)
        try {
            const payload = {
                firstname: personalInfo.firstName,
                lastname: personalInfo.lastName,
                mi: personalInfo.mi,
                phone: personalInfo.phone.replace(/\D/g, ""),
                email: personalInfo.email,
                password: personalInfo.password,
                confirm_password: personalInfo.confirmPassword,
                agreed: personalInfo.agreed,
                accounttype: accountType.toLowerCase().includes("savings") ? "personal" : accountType.toLowerCase(),
                address: verifyIdentity.primaryAddress,
                city: verifyIdentity.city,
                state: verifyIdentity.state,
                zipcode: verifyIdentity.zip,
                dob: toApiDob(verifyIdentity.dob),
            }

            const res = await User_urls.register(payload)
            if (res.status === 200) {
                if (res.data?.token) {
                    Cookies.set(CookieName, res.data.token)
                    dispatch(dispatchToken(res.data.token))
                    navigate("/user/dashboard")
                    HotAlert(res.data.msg)
                }
            } else {
                ErrorAlert(res.data.msg)
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen  bg-white">
            <div>
                {/* Navbar */}
                <nav className="border-b border-gray-200">
                    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
                        <Link to='/'> <img src="/logo-dark.png" alt="" className="size-32 object-contain" /></Link>

                        <div className="flex items-center gap-8 text-[#143B63]">
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
                        Government. Beacon Gold Crest Bank USA, Salt Lake City Branch.
                    </p>
                </div>
            </div>

            {/* Step Indicator */}
            <section className="mx-auto max-w-3xl lg:px-20 pt-12">
                <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
                    {SIGNUP_STEPS.map((label, index) => {
                        const isDone = index < step
                        const isCurrent = index === step
                        return (
                            <React.Fragment key={label}>
                                <div className="flex flex-col justify-center items-center gap-3">
                                    <span className={`text-sm ${isDone || isCurrent ? "text-[#2f9e6f]" : "text-slate-400"}`}>{label}</span>
                                    <button
                                        onClick={() => index < step && goToStep(index)}
                                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${isDone ? "border-[#2f9e6f] bg-[#2f9e6f]" : isCurrent ? "border-[#2f9e6f] bg-[#2f9e6f]" : "border-slate-300 bg-white"}`}
                                    >
                                        {isDone && <span className="text-[10px] leading-none text-white">✓</span>}
                                    </button>
                                </div>
                            </React.Fragment>
                        )
                    })}
                </div>
            </section>
            <section className="py-5 lg:w-[55%] mx-auto">

                {/* Step content */}
                <section className="mx-auto max-w-3xl px-8 py-10 lg:py-20">
                    {step === 0 && (
                        <div>
                            <h1 className="lg:text-5xl text-3xl font-light text-[#101d3d]">Let's get started</h1>
                            <p className="mt-2 text-sm lg:text-base text-[#101d3d]">
                                Already a customer? Please{" "}
                                <Link to="/login" className="text-blue underline underline-offset-4">log in.</Link>{" "}
                                We'll pre-fill your info to save time.
                            </p>

                            <label className="mt-6 block text-base text-[#101d3d]">Account type</label>
                            <div className="relative mt-3">
                                <select value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full appearance-none rounded-sm border border-slate-300 px-6 py-3 text-base text-[#101d3d] outline-none">
                                    <option>Online Savings Account</option>
                                    <option>Certificate of Deposit</option>
                                    <option>High-Yield CD</option>
                                </select>
                                <IoChevronDownSharp className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue" />
                            </div>

                            <p className="mt-4 text-sm text-[#101d3d]">No minimum balance required. No fees.</p>

                            <p className="mt-6 text-sm leading-relaxed text-slate-700">
                                Annual Percentage Yield (APY) is 3.40% with an interest rate of 3.34% as of
                                July 23, 2026. Interest rate and APY are variable and may change at our
                                discretion at any time without notice. For more information regarding
                                interest rate calculation, please refer to our{" "}
                                <Link to="/terms" className="text-blue underline underline-offset-4">Deposit Account Agreement.</Link>
                            </p>

                            <div className="mt-10 border-t border-slate-200" />


                            <div className="mt-10 border-t border-slate-200" />
                            <button onClick={() => goToStep(1)} className="mt-12 rounded-sm bg-blue px-12 py-4 text-lg text-white transition hover:opacity-90">Continue</button>
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h1 className="lg:text-4xl text-2xl text-[#101d3d]">Personal Information</h1>
                            <p className="mt-4 lg:text-lg text-slate-700">This should be your legal full name as it appears on your government ID</p>
                            <div className="mt-10 grid lg:grid-cols-3 md:grid-cols-2 gap-6">
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

                            <label className="mt-10 mb-2 block text-base text-[#101d3d]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={personalInfo.password}
                                    onChange={(e) => updatePersonalInfo("password", e.target.value)}
                                    className="w-full rounded-sm border border-slate-300 px-4 py-4 pr-14 text-lg text-[#101d3d] outline-none placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">Must be at least 8 characters and include a letter and a number.</p>

                            <label className="mt-8 mb-2 block text-base text-[#101d3d]">Confirm password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter your password"
                                    value={personalInfo.confirmPassword}
                                    onChange={(e) => updatePersonalInfo("confirmPassword", e.target.value)}
                                    className="w-full rounded-sm border border-slate-300 px-4 py-4 pr-14 text-lg text-[#101d3d] outline-none placeholder:text-slate-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
                                </button>
                            </div>
                            {personalInfo.confirmPassword !== "" && personalInfo.password !== personalInfo.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">Passwords don't match.</p>
                            )}

                            <label className="mt-10 flex items-start gap-4">
                                <input
                                    type="checkbox"
                                    checked={personalInfo.agreed}
                                    onChange={(e) => updatePersonalInfo("agreed", e.target.checked)}
                                    className="mt-1 h-5 w-5 accent-blue"
                                />
                                <span className="lg:text-lg leading-relaxed text-[#101d3d]">
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
                            <h1 className="lg:text-5xl text-3xl font-light text-[#101d3d]">Tell us about yourself</h1>
                            <p className="mt-4 lg:text-lg">
                                <a href="#" className="text-blue underline underline-offset-4">
                                    Learn how we keep your data secure.
                                </a>
                            </p>

                            {/* Residential address */}
                            <div className="mt-12">
                                <h2 className="flex items-center gap-2 text-2xl text-[#101d3d]">
                                    Residential address
                                    <IoInformationCircleOutline className="h-5 w-5 text-blue" />
                                </h2>
                                <p className="mt-3 text-base leading-relaxed text-[#101d3d]">
                                    Enter your home address. It cannot be a PO box or business address.
                                </p>

                                <div className="mt-6 grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-base text-[#101d3d]">Primary address</label>
                                        <textarea
                                            rows={2}
                                            value={verifyIdentity.primaryAddress}
                                            onChange={(e) => updateVerifyIdentity("primaryAddress", e.target.value)}
                                            className="w-full resize-none rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-base text-[#101d3d]">Apt/Suite (optional)</label>
                                        <input
                                            type="text"
                                            placeholder="Optional"
                                            value={verifyIdentity.aptSuite}
                                            onChange={(e) => updateVerifyIdentity("aptSuite", e.target.value)}
                                            className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>

                                <label className="mt-6 mb-2 block text-base text-[#101d3d]">City</label>
                                <input
                                    type="text"
                                    value={verifyIdentity.city}
                                    onChange={(e) => updateVerifyIdentity("city", e.target.value)}
                                    className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                                />

                                <div className="mt-6 grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="mb-2 block text-base text-[#101d3d]">State</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={verifyIdentity.state}
                                                onChange={(e) => updateVerifyIdentity("state", e.target.value)}
                                                className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-base text-[#101d3d]">ZIP code</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={5}
                                            value={verifyIdentity.zip}
                                            onChange={(e) => updateVerifyIdentity("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                                            className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 border-t border-slate-200" />

                            {/* Identity */}
                            <div className="mt-12">
                                <h2 className="text-2xl text-[#101d3d]">Identity</h2>
                                <p className="mt-3 text-base leading-relaxed text-[#101d3d]">
                                    We ask this information as part of our legal requirement to know our customers.
                                </p>

                                <label className="mt-6 mb-2 flex items-center gap-2 text-base text-[#101d3d]">
                                    Country of citizenship
                                    <IoInformationCircleOutline className="h-4 w-4 text-blue" />
                                </label>
                                <div className="relative">
                                    <select
                                        value={verifyIdentity.countryOfCitizenship}
                                        onChange={(e) => updateVerifyIdentity("countryOfCitizenship", e.target.value)}
                                        className="w-full appearance-none rounded-sm border border-slate-300 px-4 py-4 text-lg text-blue outline-none"
                                    >
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>Other</option>
                                    </select>
                                    <IoChevronDownSharp className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue" />
                                </div>

                                <label className="mt-6 mb-2 block text-base text-[#101d3d]">Alternate phone number (optional)</label>
                                <input
                                    type="tel"
                                    placeholder="(###) ###-#### (Optional)"
                                    value={verifyIdentity.alternatePhone}
                                    onChange={(e) => updateVerifyIdentity("alternatePhone", formatPhone(e.target.value))}
                                    className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none placeholder:text-slate-400"
                                />

                                <label className="mt-6 mb-2 block text-base text-[#101d3d]">Date of birth</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="MM/DD/YYYY"
                                    value={verifyIdentity.dob}
                                    onChange={(e) => updateVerifyIdentity("dob", formatDOB(e.target.value))}
                                    className="w-full rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none placeholder:text-slate-400"
                                />


                            </div>

                            <div className="mt-12 border-t border-slate-200" />

                            {/* Employment */}
                            <div className="mt-12">
                                <h2 className="text-2xl text-[#101d3d]">Employment</h2>

                                <label className="mt-6 mb-2 flex items-center gap-2 text-base text-[#101d3d]">
                                    Employment status
                                    <IoInformationCircleOutline className="h-4 w-4 text-blue" />
                                </label>
                                <div className="relative">
                                    <select
                                        value={verifyIdentity.employmentStatus}
                                        onChange={(e) => updateVerifyIdentity("employmentStatus", e.target.value)}
                                        className="w-full appearance-none rounded-sm border border-slate-300 px-4 py-4 text-lg text-[#101d3d] outline-none"
                                    >
                                        <option value="" disabled>Employment status</option>
                                        {EMPLOYMENT_STATUSES.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <IoChevronDownSharp className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue" />
                                </div>
                            </div>

                            <button
                                onClick={() => verifyIdentityValid && goToStep(3)}
                                disabled={!verifyIdentityValid}
                                className={`mt-12 rounded-sm px-14 py-4 text-lg text-white transition ${verifyIdentityValid ? "bg-blue hover:opacity-90" : "cursor-not-allowed bg-slate-300"
                                    }`}
                            >
                                Continue
                            </button>

                            <p className="mt-6 flex items-center gap-2 text-sm text-slate-600">
                                <BiLock className="h-4 w-4" />
                                Your information is protected with 128-bit SSL encryption.
                            </p>

                            <p className="mt-8 text-sm leading-relaxed text-slate-500">
                                Important information about procedures for opening a new account: To help
                                the government fight the funding of terrorism and money laundering
                                activities, federal law requires all financial institutions to obtain,
                                verify, and record information that identifies each person who opens an
                                account. What this means for you: When you open an account, we will ask
                                for your name, address, date of birth and other information that will
                                allow us to identify you.
                            </p>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h1 className="text-4xl text-[#101d3d]">Open account</h1>
                            <p className="mt-4 text-lg text-slate-700">
                                Review your information and submit to open your account.
                            </p>

                            {error && (
                                <p className="mt-4 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
                            )}

                            <button
                                onClick={handleSubmission}
                                disabled={loading}
                                className="mt-8 rounded-sm bg-blue px-14 py-4 text-lg text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
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