'use client'

import { authClient } from '@/src/lib/auth-client'
import { useRouter } from 'next/navigation'
import logoutIcon from '@/src/assets/logout-icon.png'
import Image from 'next/image'

export const Logout = () => {
    const router = useRouter()

    async function handleLogout() {
        await authClient.signOut()
        router.push('/sign-in')
    }

    return (
        <button
            type="button"
            className="flex h-[52px] w-full cursor-pointer items-center gap-3 rounded-xl px-4 text-text-muted transition-colors hover:bg-white/5 hover:text-white"
            onClick={handleLogout}
        >
            <Image src={logoutIcon} alt="" />
            <span className="text-base font-medium leading-normal text-center">
                Sair
            </span>
        </button>
    )
}