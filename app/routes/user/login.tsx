import React, { useState } from "react";
import { BiLock, } from "react-icons/bi";
import { IoChevronDownSharp, IoChevronForward } from "react-icons/io5";
import { Link } from "react-router";
import { FAQs } from "~/component/general/constant";
import Footer from "~/component/general/footer";
import {
    FaFacebook,
    FaInstagram,
    FaYoutube,
    FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import UserFooter from "~/component/user/footer";
export default function Login() {
    const [active, setActive] = useState(0)

    function handleActive(value: number) {
        if (active !== value) return setActive(value)
        return setActive(0)
    }
    return (
        <div className="min-h-screen  bg-white">
            <div>
                {/* Navbar */}
                <nav className="border-b border-gray-200">
                    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
                        <Link to='/'> <img src="/Public/logo_blue.svg" alt="" className="size-28" /></Link>
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

            {/* Login */}
            <section className="w-[50%] mx-auto mt-8">
                <div className="mb-8 px-3 bg-[#EEF4FA] flex items-center justify-between ">
                    <div className="">  <img src="/Public/qr_banner_image.png" alt="" className="h-28" /></div>
                    <div className="">
                        <h2 className="text-lg text-slate-800 leading-9" >Get the Marcus app</h2>
                        <p className="mt- text-sm text-slate-500">Scan to download or open the app</p>
                    </div>
                    <div className=""><img src="/Public/codeqr.png" alt="" className="h-24" /></div>
                </div>

                <div className="">
                    <h1 className="mb-14 text-[2.7rem] font-light text-[#23284A]">Secure login</h1>

                    {/* Email */}
                    <div className="mb-7">
                        <label className="mb-3 block text-base text-slate-700">Email address</label>
                        <input type="email" className="h-14 w-full border border-slate-300 px-5 text-xl outline-none focus:border-blue focus:border-2" />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-3 block text-base text-slate-700">Password</label>
                        <input type="password" className="h-14 w-full border border-slate-300 px-5 text-xl outline-none focus:border-blue focus:border-2" />
                    </div>

                    {/* Buttons */}
                    <div className="mt-12 flex items-center gap-8">
                        <button className="rounded bg-blue px-10 text-base py-4 text-white hover:bg-[#005FB8]">Continue</button>
                        <a href="#" className="text-base text-blue font-light underline underline-offset-4">Create or reset password</a>
                    </div>

                    {/* SSL */}
                    <div className="mt-4 flex items-center gap-2 text-base text-darkgray">
                        <BiLock size={22} />
                        <p>Your information is protected with 128-bit SSL encryption.</p>
                    </div>
                </div>
            </section>
            <div className="border-b pt-36 border-gray"></div>
            {/* Help Section */}
            <section className="py-10 w-[40%] mx-auto">
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