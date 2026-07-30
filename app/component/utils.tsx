import toast, { type Renderable, type Toast, type ValueFunction } from "react-hot-toast";
import { BiHome, BiPackage, BiWallet } from 'react-icons/bi'
import { FaHandHoldingUsd, FaMoneyBillWave, FaUsersCog } from 'react-icons/fa'
 export const adminSidebar = [
    { title: 'Home', url: ['/admin/dashboard'], Icon: BiHome },
    { title: 'Customers & Kyc Management', url: ['/admin/all-user'], Icon: FaUsersCog },
    { title: 'Deposit', url: ['/admin/deposit'], Icon: FaMoneyBillWave },
    { title: 'Withdraw', url: ['/admin/withdraw'], Icon: FaHandHoldingUsd },
]

export const HotAlert = (message: Renderable | ValueFunction<Renderable, Toast>) => {
    return toast.success(message, {
        duration: 6000,
        style: {
            borderRadius: '20px',
            background: '#fff',
            color: '#333',
            padding: '10px 18px',
            fontSize: '17px',
            minWidth: '320px',
        },
    });
};
export const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    return minutes < 60 ? `${minutes}m ago` : `${Math.floor(minutes / 60)}h ago`
}
export function formatDate(date?: string) {
    if (!date) return ""
    return new Date(date)
        .toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        })
        .replace(/\//g, "-")
}

export const ErrorAlert = (message: string) => {
    return toast.error(message, {
        duration: 7000,
        style: {
            borderRadius: '20px',
            background: '#fff',
            color: '#333',
            padding: '10px 18px',
            fontSize: '17px',
            minWidth: '320px',
        },
    });
};
export const formatAmount = (amount?: number) => {
    if (typeof amount !== "number") return "0.00";

    return amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const US_STATES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
]

export const EMPLOYMENT_STATUSES = [
    "Full-Time Employed",
    "Part-Time Employed",
    "Self-Employed",
    "Unemployed",
    "Retired",
]

export const REFERRAL_STEPS = [
    {
        number: '1',
        title: 'Open',
        body: 'Open a Marcus Online Savings Account and start earning our everyday high-yield rate.',
    },
    {
        number: '2',
        title: 'Share',
        body: "Share your unique referral link with friends who don't have a Marcus Online Savings Account or CD.",
    },
    {
        number: '3',
        title: 'Earn',
        body: "When your friend opens an Online Savings Account, you both earn a 1.00% APY rate boost for 3 months (on accounts on which you're the primary owner).",
    },
    {
        number: '4',
        title: 'Repeat',
        body: 'Spread the high-yield love: you can refer up to 5 friends for rate boosts.',
    },
]
