import { BiChevronDown, BiTime } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";
import { products, resources } from "~/component/general/constant";
import {Link} from 'react-router'
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[42rem] overflow-hidden">
        {/* Background Image */}
        <img src="/FinalHomepageReferral.png" alt="Referral Banner" className="absolute inset-0 h-full w-full object-cover" />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-[40rem] max-w-7xl items-center px-8">
          <div className="">
            <h1 className="text-[4rem] leading-none tracking-tight">
              Earn <span className="font-normal">3.40% APY</span>{" "}
              <span className="text-blue">+ 1.00% APY</span>
            </h1>

            <div className="mb-5">
              <h2 className="text-[3.5rem] font-light leading-none">when you refer a friend!</h2>
            </div>

            <p className="mt-1 max-w-xl text-base font-light leading-">
              Open an Online Savings Account and refer a friend who's new to
              Marcus—you both could earn an extra 1.00% APY for 3 months.
              Terms apply.
            </p>

          <div className="mt-10">  <Link to='savings/referrals' className=" rounded-md bg-blue px-20 py-4 text-lg font-light text-white hover:bg-blue-700">Learn More</Link></div>

            <div className="mt-12 max-w-lg flex items-center gap-2">
              <h3 className="font-bold text-lg text-blue-950">FDIC</h3>
              <div className="">
                <p className="text-xs italic">FDIC-Insured – Backed by the full faith and credit of the U.S. Government.</p>
                <p className="text-xs italic">Goldman Sachs Bank USA, Salt Lake City Branch.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Products */}
      <section className="max-w-7xl mx-auto px-8 mt-20">
        <h2 className="text-3xl text-center font-medium mb-14">Savings products to help you grow your money</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {products.map((item) => (
            <div key={item.title} className="bg-gray p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-light mb-12">{item.title}</h3>
                <p className="text-lg mb-6 font-medium">{item.subtitle}</p>
                <h1 className={`text-5xl font- ${item.color}`}>{item.rate}</h1>
                <div className="flex items-center gap-2 mt-3">
                  <p className="text-lg">Annual Percentage Yield</p>
                  <BsInfo className="text-blue" size={20} />
                </div>
              </div>
              <a href="#" className="underline text-lg mt-8">{item.link}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Security */}
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mt-16">
          <p className="text-lg font-medium mb-4">Additional CD terms are available</p>
          <button className="border-2 border-blue text-blue  px-28 py-4 rounded hover:bg-blue hover:text-white transition">Compare savings products</button>
        </div>

        <p className="text-xs text-gray-500 mt-10 leading-6">
          Annual Percentage Yields (APY) as of July 22, 2026. Maximum balance limits apply. Online Savings Account:
          APY may change at any time before or after account is opened. High-Yield CD: APY may change at any time before
          CD is opened and funded. Penalties that may reduce CD earnings will apply to a withdrawal of principal prior to
          maturity. $500 minimum to open a CD and earn stated APY. Promotional 14-Month CD term length
          available until 7/28/2026. Learn More. No-Penalty CD: APY may change at any time before a No-Penalty
          CD is opened and funded. Withdrawal permitted beginning seven days after the funding date. Must withdraw
          full balance. $500 minimum to earn stated APY for No-Penalty CD.
        </p>
      </div>
      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 px-8 items-center">
        <div>
          <div className="text-[3rem] font-medium mb-4">Security focused</div>
          <p className="text-lg text-slate-700 font-medium">At Marcus, we make it a priority to protect your <br /> privacy andsafeguard your account information.</p>
          <button className="bg-blue text-white px-16 py-4 mt-10 rounded hover:bg-blue">Learn more</button>
        </div>

        <img src="/shield.png" alt="" className="" />
      </section>

      {/* Mobile App */}
      <section className="bg-[#F9F9FA] py-20">
        <div className="flex items-start justify-between max-w-7xl mx-auto  ">
        <div className=" w-[40rem]">
          <h1 className="text-3xl font-normal leading-tight mb-5">We're here to help you make the most of your money</h1>
          <p className="text-xl text-slate-700">Download the Marcus app today and keep your money at your fingertips.</p>
          <div className="flex -mt-5 gap-5">
            <img src="/app-download-appstore-b.png" alt="" className="size-[12rem] object-contain" />
            <img src="/app-download-playstore-b.png" alt="" className="size-[12rem] object-contain" />
          </div>
        </div>
        <div className=""> <img src="/app-icon.png" alt="" className="size-[25rem] object-contain" /></div>

      </div>
      </section>


      <section className="bg-skyblue">
       <div className="max-w-7xl mx-auto px-8 py-24">
         <h2 className="text-5xl text-center font-light mb-16">Resources that are helpful</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((item) => (
            <div key={item.title} className="bg-white overflow-hidden">
              {/* <div className={`h-56 flex items-center justify-center ${item.bg}`}>{item.image}</div> */}
              <img src={item.image} alt="" className="" />
              <div className="py-5 px-4">
                <h3 className="text-2xl font-medium text-slate-900 mb-3 leading-snug">{item.title}</h3>
                <p className="text-slate-500 mb-6 leading-relaxed">{item.description}</p>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <BiTime size={16} />
                  <span>{item.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="bg-blue text-white px-10 py-4 rounded font-medium hover:bg-blue transition">See all resources</button>
        </div>
       </div>
      </section>


    </div>
  );
}
