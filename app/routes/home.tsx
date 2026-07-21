import React from "react";
import { BiChevronDown, BiLock, BiTime } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const products = [
  {
    title: "Online Savings Account",
    subtitle: "No minimum balance",
    rate: "3.40%",
    color: "text-teal-600",
    link: "Explore Online Savings >",
  },
  {
    title: "High-Yield CD",
    subtitle: "14 months",
    rate: "4.10%",
    color: "text-teal-600",
    link: "Explore 14-Month CD >",
  },
  {
    title: "No-Penalty CD",
    subtitle: "11 months",
    rate: "4.00%",
    color: "text-blue-600",
    link: "Explore No-Penalty CDs >",
  },
];

const resources = [
  {
    title: "Difference Between Savings, CD, and Investment Accounts",
    description:
      "When choosing between these accounts, it's important to consider your timeline, goals, and risk tolerance.",
    readTime: "3 min read",
    bg: "bg-slate-100",
    image: <div className="w-24 h-24 rounded-full bg-teal-500/30" />,
  },
  {
    title: "What Is a No-Penalty CD and How Does It Work?",
    description:
      "A no-penalty CD offers a simple way to earn interest on your savings with some added flexibility.",
    readTime: "3 min read",
    bg: "bg-blue-50",
    image: <div className="w-24 h-24 rounded-full bg-blue-500/30" />,
  },
  {
    title: "Why Is the Cost of Living Going Up? 5 Tips for Consumers",
    description:
      "Sticky inflation and weak job growth are straining consumer wallets.",
    readTime: "3 min read",
    bg: "bg-slate-100",
    image: <div className="w-24 h-24 rounded-full bg-slate-400/30" />,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 py-20 lg:grid-cols-2">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <h1 className="text-[72px] font-light leading-none tracking-tight text-slate-900">
            Earn{" "}
            <span className="font-normal">3.40% APY</span>{" "}
            <span className="text-blue-500">+ 1.00% APY</span>
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <h2 className="text-[56px] font-light leading-none">
              when you refer a friend!
            </h2>

            <BsInfo className="text-blue-500" size={20} />
          </div>

          <p className="mt-10 max-w-xl text-xl leading-9 text-slate-700">
            Open an Online Savings Account and refer a friend who's new to
            Marcus—you both could earn an extra 1.00% APY for 3 months!
            Terms apply.
          </p>

          <button className="mt-10 w-80 rounded-md bg-blue-600 py-4 text-lg font-medium text-white transition hover:bg-blue-700">
            Learn More
          </button>

          <div className="mt-16">
            <h3 className="font-bold text-slate-700">FDIC</h3>

            <p className="mt-2 max-w-lg text-sm text-gray-500">
              FDIC-Insured – Backed by the full faith and credit of the U.S.
              Government.
            </p>

            <p className="text-sm text-gray-500">
              Goldman Sachs Bank USA, Salt Lake City Branch.
            </p>
          </div>
        </div>
      </section>

      {/* Savings Products */}

      <section className="max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-5xl text-center font-light mb-14">
          Savings products to help you grow your money
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {products.map((item) => (
            <div
              key={item.title}
              className="bg-slate-100 p-12 flex flex-col justify-between h-[420px]"
            >
              <div>
                <h3 className="text-3xl mb-16">{item.title}</h3>

                <p className="text-xl mb-6">{item.subtitle}</p>

                <h1 className={`text-7xl font-light ${item.color}`}>
                  {item.rate}
                </h1>

                <div className="flex items-center gap-2 mt-4">
                  <p className="text-xl">Annual Percentage Yield</p>

                  <BsInfo className="text-blue-500" size={20} />
                </div>
              </div>

              <a href="#" className="underline text-2xl">
                {item.link}
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-3xl mb-8">Additional CD terms are available</p>

          <button className="border-2 border-blue-600 text-blue-600 px-16 py-5 rounded hover:bg-blue-600 hover:text-white transition">
            Compare savings products
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-14 leading-6">
          Annual Percentage Yields (APY) as of July 20, 2026. Maximum balance
          limits apply. APY may change at any time before or after account
          opening.
        </p>
      </section>

      {/* Security */}

      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 px-8 py-24 items-center">
        <div>
          <h1 className="text-7xl font-light mb-8">Security focused</h1>

          <p className="text-2xl leading-10 text-slate-700 max-w-xl">
            At Marcus, we make it a priority to protect your privacy and
            safeguard your account information.
          </p>

          <button className="mt-10 bg-blue-600 text-white px-16 py-5 rounded hover:bg-blue-700">
            Learn more
          </button>
        </div>

        <div className="flex justify-center">
          <div className="w-[500px] h-[420px] rounded-3xl bg-gradient-to-b from-blue-400 to-blue-700 flex items-center justify-center">
            <div className="bg-slate-800 rounded-full px-12 py-8">
              <span className="text-green-400 text-6xl">✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App */}

      <section className="bg-slate-50 py-28">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-6xl font-light leading-tight mb-10">
              We're here to help you make the most of your money
            </h1>

            <p className="text-2xl leading-10 text-slate-700 max-w-xl mb-12">
              Download the Marcus app today and keep your money at your
              fingertips.
            </p>

            <div className="flex gap-5">
              <button className="bg-black text-white rounded-lg px-8 py-4">
                App Store
              </button>

              <button className="bg-black text-white rounded-lg px-8 py-4">
                ▶ Google Play
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-[350px] h-[550px] bg-slate-800 rounded-[50px] shadow-2xl flex items-center justify-center">
              <span className="text-white text-[180px] font-bold">M</span>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}

      <section className="max-w-7xl mx-auto px-8 py-24">
        <h2 className="text-5xl text-center font-light mb-16">
          Resources that are helpful
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((item) => (
            <div key={item.title} className="bg-white overflow-hidden">
              <div
                className={`h-56 flex items-center justify-center ${item.bg}`}
              >
                {item.image}
              </div>

              <div className="pt-6">
                <h3 className="text-2xl font-medium text-slate-900 mb-3 leading-snug">
                  {item.title}
                </h3>

                <p className="text-slate-500 mb-6 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <BiTime size={16} />
                  <span>{item.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="bg-blue-600 text-white px-10 py-4 rounded font-medium hover:bg-blue-700 transition">
            See all resources
          </button>
        </div>
      </section>

      {/* Footer */}

      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10">
            <div>
              <h4 className="text-slate-400 mb-5">Marcus</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="hover:text-slate-300">
                    About Marcus
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-300">
                    Security Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-300">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-400 mb-5">Products</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="hover:text-slate-300">
                    Savings Accounts & CDs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-300">
                    Credit Card FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-400 mb-5">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="hover:text-slate-300">
                    Articles
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-300">
                    Financial Calculators
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-start gap-4">
              <button className="border border-white rounded-md px-8 py-3 font-medium hover:bg-white hover:text-slate-900 transition">
                FAQs
              </button>
              <button className="border border-white rounded-md px-8 py-3 font-medium hover:bg-white hover:text-slate-900 transition">
                Contact Us
              </button>
            </div>

            <div>
              <h4 className="text-slate-400 mb-5">Connect with Us</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-slate-300">
                  <FaFacebook size={22} />
                </a>
                <a href="#" className="hover:text-slate-300">
                  <FaInstagram size={22} />
                </a>
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

          <div className="flex gap-4 mt-14">
            <button className="flex items-center gap-2 bg-black border border-slate-700 rounded-lg px-5 py-2.5">
              <BiLock className="opacity-0" />
              <span className="text-xs text-left leading-tight">
                <span className="block text-[10px] text-slate-400">
                  Download on the
                </span>
                <span className="block font-semibold text-base">
                  App Store
                </span>
              </span>
            </button>

            <button className="flex items-center gap-2 bg-black border border-slate-700 rounded-lg px-5 py-2.5">
              <span className="text-xs text-left leading-tight">
                <span className="block text-[10px] text-slate-400">
                  GET IT ON
                </span>
                <span className="block font-semibold text-base">
                  Google Play
                </span>
              </span>
            </button>
          </div>

          <hr className="border-slate-700 mt-12" />
        </div>
      </footer>
    </div>
  );
}
