import React from 'react'
import { Link } from "react-router";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function UserFooter() {
    return (
        <div>

            <footer className="bg-[#242844] text-white py-20">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-20">
                        {/* Left Section */}
                        <div className="max-w-3xl">
                            {/* Logo */}
                            {/* <img src="/logo_white.svg" alt="Beacon Gold Crest" className="h-10 object-contain mb-12" /> */}
                       <Link to='/'> <img src="/beacon1.jpg" alt="" className="size-32 object-contain" /></Link>
                            {/* Links */}
                            <div className="flex flex-wrap gap-7 text-sm mb-14">
                                <Link to='' className="hover:underline">Site Terms</Link>
                                <Link to='' className="hover:underline">Privacy Policy</Link>
                                <Link to='' className="hover:underline">Your Privacy Choices</Link>
                            </div>

                            {/* Legal Text */}
                            <div className="space-y-8 text-xs leading text-gray-300">
                                <p>Beacon Gold Crest® is a brand of Beacon Gold Crest Bank USA. All loans, deposit products, and credit cards are provided or issued by Beacon Gold Crest Bank USA, Salt Lake City Branch. Member FDIC.</p>
                                <p>All loans, deposit products, and credit cards are provided or issued by Beacon Gold Crest Bank USA, Salt Lake City Branch. Member FDIC.</p>
                                <p>Important information about procedures for opening a new account: To help the government fight the funding of terrorism and money laundering activities, federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account.</p>
                                <p>What this means for you: When you open an account, we will ask for your name, address, date of birth and other information that will allow us to identify you.</p>
                                <p>NMLS ID: 208156. NMLS Consumer Access Website:
                                    <Link to="" className="text-sky-400 underline ml-2 hover:text-sky-300">www.nmlsconsumeraccess.org</Link>
                                </p>
                            </div>

                            <div className="flex gap-10 mt-12">
                                <img src="/norton_secure_seal.svg" alt="Norton" className="h-20 object-contain" />
                                <img src="/equal.svg" alt="Equal Housing" className="h-20 object-contain" />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="">
                            <div className="flex gap-3 mb-20">
                                <button className="bg-white text-[#242844] px-10 py-2 rounded-md font-medium hover:bg-gray-200 transition">FAQs</button>
                                <button className="border border-white px-10 py-2 rounded-md hover:bg-white hover:text-[#242844] transition">Contact Us</button>
                            </div>

                            <div className="text-gray-300 mb-8 text-sm">Connect with us</div>

                            <div className="flex gap-5 text-2xl">
                                <FaFacebook className="cursor-pointer hover:text-gray-300" />
                                <FaInstagram className="cursor-pointer hover:text-gray-300" />
                                <FaYoutube className="cursor-pointer hover:text-gray-300" />
                                <FaXTwitter className="cursor-pointer hover:text-gray-300" />
                                <FaLinkedin className="cursor-pointer hover:text-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
