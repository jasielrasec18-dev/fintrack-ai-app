import Image from 'next/image'
import { Inter } from 'next/font/google'

import dashboardIcon from '@/src/assets/dashboard-icon.png'
import transactionsIcon from '@/src/assets/transactions-icon.png'
import logo from '@/src/assets/logo.png'
import { Logout } from './logout'
import Link from 'next/link'

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
})

export const Sidebar = () => {
    return (
        <aside
            className={`${inter.className} flex w-64 flex-col border-r border-[#1E293B] bg-[#0F111A] text-[#F1F5F9]`}
        >
            <div className="flex items-center gap-3 px-6 py-6">
                <div className="bg-[#9333EA] rounded-xl py-4 px-2.5">
                    <Image src={logo} alt="FinTrack" priority />
                </div>
                <p className="text-xl font-bold leading-5 tracking-[-0.025em]">
                    FinTrack
                </p>
            </div>

            <nav className="flex flex-1 flex-col gap-2 px-4 py-4">
                <Link
                    href="/"
                    className="flex w-full items-center gap-3 rounded-xl bg-[#9333EA] px-4 py-3 text-white"
                >
                    <Image src={dashboardIcon} alt="" />
                    <span className="text-base font-medium leading-normal">
                        Dashboard
                    </span>
                </Link>

                <Link
                    href='/transactions'
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#94A3B8]"
                >
                    <Image src={transactionsIcon} alt="" />
                    <span className="text-base font-medium leading-normal">
                        Transações
                    </span>
                </Link>
            </nav>

            <div className="border-t border-[#1E293B] px-6 py-6">
                <Logout />
            </div>
        </aside>
    )
}