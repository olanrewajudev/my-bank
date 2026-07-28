import React, { useState } from "react";
import { BiLock } from "react-icons/bi";
import { IoChevronDownSharp, IoChevronForward } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import { FAQs } from "~/component/general/constant";
import UserFooter from "~/component/user/footer";
import { User_urls } from "~/component/endpoints/user";
import Cookies from 'js-cookie'
import { CookieName } from "~/component/Apis";

export default function Login() {
    const navigate = useNavigate()
    const [active, setActive] = useState(0)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    function handleActive(value: number) {
        if (active !== value) return setActive(value)
        return setActive(0)
    }

    const loginValid =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        password.trim() !== ""

    const handleLogin = async () => {
        setError("")
        if (!loginValid) {
            setError("Enter a valid email and password.")
            return
        }
        setLoading(true)
        try {
            const res = await User_urls.login({ email, password })
            if (res.data?.token) {
                Cookies.set(CookieName, res.data.token)

            }
            // navigate("/user/dashboard")
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") handleLogin()
    }

    return (
        <div className="min-h-screen  bg-white">
            <div>
                {/* Navbar */}
                <nav className="border-b border-gray-200">
                    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
                        <Link to='/'> <img src="/logo-dark.png" alt="" className="size-32 object-contain" /></Link>

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

            {/* Login */}
            <section className="lg:w-[50%] px-5 mx-auto mt-8">
                

                <div className="">
                    <h1 className="lg:mb-14 mb-7 lg:text-[2.7rem] text-[1.5rem] font-light text-[#23284A]">Secure login</h1>

                    {error && (
                        <p className="mb-6 rounded-sm bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
                    )}

                    {/* Email */}
                    <div className="mb-7">
                        <label className="mb-3 block text-base text-slate-700">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-14 w-full border border-slate-300 px-5 outline-none focus:border-blue focus:border-2"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-3 block text-base text-slate-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-14 w-full border border-slate-300 px-5 outline-none focus:border-blue focus:border-2"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="mt-12 flex items-center gap-8">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="rounded bg-blue px-5 lg:px-10 text-base py-3.5 text-white hover:bg-[#005FB8] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Continue"}
                        </button>
                        <a href="#" className="lg:text- text-sm text-blue font-light underline underline-offset-4">Create or reset password</a>
                    </div>

                    {/* SSL */}
                    <div className="mt-4 flex items-center gap-2 text-base text-darkgray">
                        <BiLock size={22} />
                        <p>Your information is protected with 128-bit SSL encryption.</p>
                    </div>
                </div>
            </section>
            <div className="border-b lg:pt-36 pt-10 border-gray"></div>
            {/* Help Section */}
            <section className="py-10 lg;w-[40%] mx-auto">
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
                                        <ActiveIcon className="text-blue text-xl flex-shrink-0" />
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
            <UserFooter />
        </div>
    );
}