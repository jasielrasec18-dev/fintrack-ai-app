'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dashboardIcon from '@/src/assets/dashboard-icon.png'
import transactionsIcon from '@/src/assets/transactions-icon.png'

const NAV_ITEMS = [
    { href: '/', label: 'Dashboard', icon: dashboardIcon },
    { href: '/transactions', label: 'Transações', icon: transactionsIcon },
]

interface NavLinksProps {
    onNavigate?: () => void
}

export const NavLinks = ({ onNavigate }: NavLinksProps) => {
    const pathname = usePathname()

    return (
        <>
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex h-[52px] w-full items-center gap-3 rounded-xl px-4 transition-colors ${
                            isActive
                                ? 'bg-primary text-white'
                                : 'text-text-muted hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <Image src={item.icon} alt="" />
                        <span className="text-base font-medium leading-normal">
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </>
    )
}
