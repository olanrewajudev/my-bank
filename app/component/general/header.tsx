import React from 'react'

import { BiChevronDown, BiLock } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";
import { SlMenu } from 'react-icons/sl';
import { Link } from 'react-router';

export default function Header() {
    return (
        <div>
            {/* Navbar */}
            <nav className="border-b border-gray-200">
                <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-8">
                    <div className="flex items-center gap-20">
                        {/* Logo */}
                       <Link to='/'> <img src="/logo_blue.svg" alt="" className="size-28" /></Link>

                        {/* Links */}
                        <div className="hidden gap-10 lg:flex">
                            <button className="flex text-sm items-center gap-1 text-gray-700 hover:text-black">Savings <BiChevronDown size={16} /></button>
                            <button className="flex text-sm items-center gap-1 text-gray-700 hover:text-black">CDs <BiChevronDown size={16} /></button>
                            <button className="flex text-sm items-center gap-1 text-gray-700 hover:text-black">Tools & Resources<BiChevronDown size={16} /></button>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="lg:flex items-center gap-8 hidden">
                        <a href="#" className="text-gray-700 hover:text-black">Compare savings products</a>
                        <Link to='/login' className="flex items-center gap-2"><BiLock size={18} />Log in</Link>
                    </div>
                    <div className="lg:hidden "><SlMenu /></div>
                </div>
            </nav>
        </div>
    )
}
