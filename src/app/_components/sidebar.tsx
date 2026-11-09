import Image from 'next/image'

import logo from '@/src/assets/logo.png'
import { Logout } from './logout'
import { NavLinks } from './nav-links'

export const Sidebar = () => {
    return (
        <aside className="sticky top-0 hidden h-screen w-44 shrink-0 flex-col border-r border-card-border bg-app text-[#F1F5F9] md:flex lg:w-64">
            <div className="flex items-center gap-3 px-6 py-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary">
                    <Image src={logo} alt="FinTrack" priority />
                </div>
                <p className="text-xl font-bold leading-5 tracking-[-0.025em]">
                    FinTrack
                </p>
            </div>

            <nav className="flex flex-1 flex-col gap-2 px-4 py-4">
                <NavLinks />
            </nav>

            <div className="border-t border-card-border px-4 py-6">
                <Logout />
            </div>
        </aside>
    )
}
