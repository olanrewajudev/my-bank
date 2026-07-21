import React from 'react'

import { BiChevronDown, BiLock } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";

export default function Header() {
    return (
        <div>
            {/* Navbar */}
            <nav className="border-b">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
                    {/* Logo */}
                    <div>
                        <h1 className="text-4xl font-bold text-slate-800">Marcus<span className="text-blue-500">.</span></h1>
                        <p className="-mt-1 text-sm text-slate-600">by Goldman Sachs</p>
                    </div>

                    {/* Links */}
                    <div className="hidden gap-10 lg:flex">
                        <button className="flex items-center gap-1 text-gray-700 hover:text-black">Savings <BiChevronDown size={16} /></button>
                        <button className="flex items-center gap-1 text-gray-700 hover:text-black">CDs <BiChevronDown size={16} /></button>
                        <button className="flex items-center gap-1 text-gray-700 hover:text-black">Tools & Resources<BiChevronDown size={16} /></button>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-8">
                        <a href="#" className="text-gray-700 hover:text-black">Compare savings products</a>
                        <button className="flex items-center gap-2"><BiLock size={18} />Log in</button>
                    </div>
                </div>
            </nav>

        </div>
    )
}
