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
        <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#94A3B8]" onClick={handleLogout}>
            <Image src={logoutIcon} alt="" />
            <span className="text-base font-medium leading-normal text-center">
                Sair
            </span>
        </button>
    )
}