import React from 'react'
import { BiChevronDown, BiLock } from "react-icons/bi";

import { Link } from 'react-router';

export default function Header() {
    return (
        <div>
            {/* Navbar */}
            <nav className="relative z-10 lg:mx-20 flex items-center justify-between px-7 pb-">
                <div className="flex items-center gap-14">

                    <Link to='/'> <img src="/logo-dark.png" alt="" className="size-32 object-contain" /></Link>

                    <div className="hidden items-center gap-10 text-sm text-blue md:flex">
                        <button className="flex items-center gap-1 border-b-2 border-blue pb-6 pt-6">Savings <BiChevronDown className="h-4 w-4" /></button>
                        <button className="flex items-center gap-1  hover:text-white">CDs <BiChevronDown className="h-4 w-4" /></button>
                        <button className="flex items-center gap-1  hover:text-white">Tools &amp; Resources <BiChevronDown className="h-4 w-4" /></button>
                    </div>
                </div>

                <div className="hidden items-center gap-8 text-[15px] text-blue md:flex">
                    <Link to="/compare" className="hover:text-white">Compare savings products</Link>
                    <Link to="/login" className="flex items-center gap-2"><BiLock className="h-4 w-4" />Log in</Link>
                </div>
            </nav>
        </div>
    )
}
