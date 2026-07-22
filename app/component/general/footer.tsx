import React from 'react'
import { BiLock } from 'react-icons/bi';
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
export default function Footer() {
  return (
    <div>
      {/* Footer */}

      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
            <div>
              <h4 className="text-slate-400 mb-5">Marcus</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-slate-300">About Marcus</a></li>
                <li><a href="#" className="hover:text-slate-300">Security Center</a></li>
                <li><a href="#" className="hover:text-slate-300">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-400 mb-5">Products</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-slate-300">Savings Accounts & CDs</a></li>
                <li><a href="#" className="hover:text-slate-300">Credit Card FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-400 mb-5">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#" className="hover:text-slate-300">Articles</a></li>
                <li><a href="#" className="hover:text-slate-300">Financial Calculators</a></li>
              </ul>
            </div>

            <div className="flex flex-col items-start gap-4">
              <button className="border border-white rounded-md px-8 py-3 font-medium hover:bg-white hover:text-slate-900 transition">FAQs</button>
              <button className="border border-white rounded-md px-8 py-3 font-medium hover:bg-white hover:text-slate-900 transition">Contact Us</button>
            </div>

            <div>
              <h4 className="text-slate-400 mb-5">Connect with Us</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-slate-300"><FaFacebook size={22} /></a>
                <a href="#" className="hover:text-slate-300"><FaInstagram size={22} /></a>
                <a href="#" className="hover:text-slate-300">
                  <FaYoutube size={22} />
                </a>
                <a href="#" className="hover:text-slate-300">
                  <FaXTwitter size={22} />
                </a>
                <a href="#" className="hover:text-slate-300">
                  <FaLinkedin size={22} />
                </a>
              </div>
            </div>
          </div>
          <div className="flex -mt-5 gap-5">
            <img src="/Public/app-download-appstore-b.png" alt="" className="size-[12rem] object-contain" />
            <img src="/Public/app-download-playstore-b.png" alt="" className="size-[12rem] object-contain" />
          </div>

          <hr className="border-slate-700 mt-12" />
        </div>
      </footer>
    </div>
  )
}
