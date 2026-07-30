import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { FaUsers, FaMoneyBillWave, FaWallet, FaBoxOpen, FaBitcoin, FaCommentDots } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Admin_urls } from '~/component/endpoints/admin'
import type { RootState } from '~/lib/store'

export default function AdminDashboard() {


    const { data: admindashboard = [] } = useQuery({
        queryKey: ['admin-dashboards'],
        queryFn: async () => {
            const res = await Admin_urls.adminDashboard()
            return res.data.msg
        },
    })

    console.log(admindashboard)

    const { user } = useSelector((state: RootState) => state.data)
    const getIcon = (title: string) => {
        switch (title) {
            case 'registered users':
                return <FaUsers size={22} />

            case 'total withdrawals':
            case 'total deposits':
                return <FaMoneyBillWave size={22} />

            case 'total wallets':
                return <FaWallet size={22} />

            case 'total packages':
                return <FaBoxOpen size={22} />

            case 'mining investments':
            case 'active mining':
            case 'in-active mining':
                return <FaBitcoin size={22} />

            case 'feedbacks':
                return <FaCommentDots size={22} />

            default:
                return <FaUsers size={22} />
        }
    }

    return (
        <div className="pt-5 mx-5">
            <div className="text-[2rem] font-semibold mb-5">Welcome back, {user?.firstname}</div>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {admindashboard.map((item: any, index: number) => (
                    <div key={index} className="bg-white border border-lightest rounded-xl shadow-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: item.color }}>{getIcon(item.title)}</div>
                            <div className="text-right">
                                <h2 className="text-[1.5rem] font-bold">{item.total}</h2>
                                {item.totalAmounts && (<p className="text-[0.9rem] text-gray-500">{item.totalAmounts}</p>)}
                            </div>
                        </div>
                        <div className="capitalize text-[0.95rem] font-medium text-gray-700">{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}