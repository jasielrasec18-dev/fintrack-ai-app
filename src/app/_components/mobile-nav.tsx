'use client'

import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'
import { Logout } from './logout'
import { NavLinks } from './nav-links'

export const MobileNav = () => {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label="Abrir menu"
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-text-muted hover:bg-white/5 hover:text-white md:hidden"
                >
                    <MenuIcon className="h-6 w-6" />
                </button>
            </DialogTrigger>

            <DialogContent className="border border-white/10 bg-card">
                <DialogTitle className="text-lg font-semibold text-white">
                    Menu
                </DialogTitle>
                <nav className="flex flex-col gap-2">
                    <NavLinks onNavigate={() => setOpen(false)} />
                    <Logout />
                </nav>
            </DialogContent>
        </Dialog>
    )
}
