import Image from 'next/image'
import { Inter } from 'next/font/google'

import userAvatar from '@/src/assets/avatar.png'

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
})

interface HeaderProps {
    userName: string
    date: Date
}

export const Header = ({
    userName,
    date
}: HeaderProps) => {
    const firstName = userName.split(' ')[0]
    const greeting = `Bem-vindo de volta, ${firstName}! 👋`

    return (
        <header
            className={`${inter.className} flex items-center justify-between 
            border-b border-[#1E293B] bg-[#0F111A] px-8 py-4`}
        >
            <div className="flex flex-col">
                <div className="text-lg font-bold leading-6 tracking-[-0.025em] text-[#F1F5F9]">
                    {greeting}
                </div>
                <div className="text-xs font-normal leading-4 tracking-[-0.025em] text-[#94A3B8]">
                    {date.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                    }).replace(/^\w/, (c) => c.toUpperCase())}
                </div>
            </div>

            <div className="h-10 w-10 overflow-hidden rounded-full bg-[#1E293B]">
                <Image
                    src={userAvatar}
                    alt="Usuário"
                    className="h-10 w-10 object-cover"
                    priority
                />
            </div>
        </header>
    )
}