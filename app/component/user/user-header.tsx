import React from 'react'

import { BiChevronDown, BiLock } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";
import { HiOfficeBuilding } from 'react-icons/hi';
import { Link } from 'react-router';

export default function UserHeader() {
    return (
        <div className=''>
            {/* Navbar */}
            <nav className="w-full absolute bottom-0 bg-white shadow-2xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
                    <Link to='/user/dashboard' className='flex flex-col items-center'>
                        <HiOfficeBuilding />
                        <div className="text-xs">Accounts</div>
                    </Link>
                    <Link to='/user/transfer' className='flex flex-col items-center'>
                        <HiOfficeBuilding />
                        <div className="text-xs">Transfer/Pay</div>
                    </Link>
                    <Link to='/user/help' className='flex flex-col items-center'>
                        <HiOfficeBuilding />
                        <div className="text-xs">Help</div>
                    </Link>
                    <Link to='/user/profile' className='flex flex-col items-center'>
                        <HiOfficeBuilding />
                        <div className="text-xs">Profile</div>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
