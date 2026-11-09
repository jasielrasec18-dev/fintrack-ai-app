import Image from 'next/image'

import userAvatar from '@/src/assets/avatar.png'
import { DEMO_EMAIL } from '@/src/lib/demo-config'
import { MobileNav } from './mobile-nav'

interface HeaderProps {
    userName: string
    userEmail: string
    date: Date
}

export const Header = ({ userName, userEmail, date }: HeaderProps) => {
    const firstName = userName.split(' ')[0]
    const greeting = `Bem-vindo de volta, ${firstName}! 👋`

    return (
        <div className="sticky top-0 z-10">
            {userEmail === DEMO_EMAIL && (
                <p className="border-b border-primary/30 bg-primary/15 px-4 py-1.5 text-center text-xs text-[#E9D5FF]">
                    Você está no modo demonstração — os dados são reiniciados
                    diariamente.
                </p>
            )}
            <header className="flex h-20 items-center justify-between gap-4 border-b border-card-border bg-app px-4 md:px-8">
                <MobileNav />
                <div className="flex min-w-0 flex-1 flex-col">
                    <div className="text-lg font-bold leading-6 tracking-[-0.025em] text-[#F1F5F9]">
                        {greeting}
                    </div>
                    <div className="text-xs font-normal leading-4 tracking-[-0.025em] text-text-muted">
                        {date
                            .toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })
                            .replace(/^\w/, (c) => c.toUpperCase())}
                    </div>
                </div>

                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#1E293B] ring-1 ring-card-border">
                    <Image
                        src={userAvatar}
                        alt="Usuário"
                        className="h-10 w-10 object-cover"
                        priority
                    />
                </div>
            </header>
        </div>
    )
}
