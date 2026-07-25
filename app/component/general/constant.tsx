export const products = [
  {
    title: "Online Savings Account",
    subtitle: "No minimum balance",
    rate: "3.40%",
    color: "text-green",
    link: "Explore Online Savings >",
  },
  {
    title: "High-Yield CD",
    subtitle: "14 months",
    rate: "4.10%",
    color: "text-teal",
    link: "Explore 14-Month CD >",
  },
  {
    title: "No-Penalty CD",
    subtitle: "11 months",
    rate: "4.00%",
    color: "text-blue",
    link: "Explore No-Penalty CDs >",
  },
];

export const resources = [
  {
    title: "Difference Between Savings, CD, and Investment Accounts",
    description:
      "When choosing between these accounts, it's important to consider your timeline, goals, and risk tolerance.",
    readTime: "3 min read",
    bg: "bg-slate-100",
    image: '/cd1.jpeg',
  },
  {
    title: "What Is a No-Penalty CD and How Does It Work?",
    description:
      "A no-penalty CD offers a simple way to earn interest on your savings with some added flexibility.",
    readTime: "",
    bg: "bg-blue-50",
    image: '/image.jpg',
  },
  {
    title: "Why Is the Cost of Living Going Up? 5 Tips for Consumers",
    description:
      "Sticky inflation and weak job growth are straining consumer wallets.",
    readTime: "3 min read",
    bg: "bg-slate-100",
    image: '/cd3.png',
  },
];

export function TransferIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 8h13l-3-3M20 16H7l3 3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="9" y="15" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">
        $
      </text>
    </svg>
  )
}
import React from "react";
export default function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 10)
    const part1 = digits.slice(0, 3)
    const part2 = digits.slice(3, 6)
    const part3 = digits.slice(6, 10)
    if (digits.length > 6) return `(${part1}) ${part2}-${part3}`
    if (digits.length > 3) return `(${part1}) ${part2}`
    if (digits.length > 0) return `(${part1}`
    return ""
}
export const FAQs = [
  {
    q: "How secure is Marcus?",
    a: (
      <ul className="list-disc pl-6 space-y-4">
        <li>
          At Marcus, we make it a priority to protect your privacy and
          safeguard your account information. We've implemented a variety of
          services, features, and policies to keep your account secure.
        </li>

        <li>
          Marcus uses multi-factor authentication to help verify your
          identity. Multi-factor authentication ensures that only you have
          access to your account.
        </li>

        <li>
          Your information is encrypted while being transmitted using 128-bit
          SSL.
        </li>

        <li>
          Learn more about our{" "}
          <a href="#" className="text-blue underline underline-offset-4">
            Security Center
          </a>
          .
        </li>
      </ul>
    ),
  },

  {
    q: "What should I do if I forget my email or password?",
    a: (
      <ul className="list-disc pl-6 space-y-4">
        <li>
          If you forget your password, click{" "}
          <span className="font-medium">"Create or reset password"</span> above.
        </li>

        <li>
          If you forget your email address, please{" "}
          <a href="#" className="text-blue underline underline-offset-4">
            call us
          </a>
          .
        </li>
      </ul>
    ),
  },

  {
    q: "I'm still having difficulty logging in. What do I do?",
    a: (
      <>
        <p className="mb-5">
          These tips may be helpful in logging in to your account:
        </p>

        <ul className="list-disc pl-6 space-y-4">
          <li>Ensure the email you entered is correct.</li>

          <li>
            If your CAPS LOCK is on, this may affect recognizing the correct
            password.
          </li>

          <li>
            If you're prompted to enter a 6-digit PIN, ensure it is the PIN
            provided in the text message or email you received. Make sure you
            are logging in within 15 minutes of receiving your PIN. If it has
            been more than 15 minutes, click{" "}
            <span className="font-medium">"Request new PIN."</span>
          </li>

          <li>
            If you received a PIN to your email and cannot find it in your
            inbox, check your spam folder or, if you have Gmail, check your{" "}
            <span className="font-medium">"Promotions"</span> tab.
          </li>
        </ul>

        <p className="mt-6">
          If you need additional assistance, please{" "}
          <a href="#" className="text-blue underline underline-offset-4">
            call us
          </a>
          .
        </p>
      </>
    ),
  },
];