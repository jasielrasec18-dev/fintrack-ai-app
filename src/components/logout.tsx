"use client"

import { authClient } from "@/src/lib/auth-client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Logout from "@/src/assets/logout.png"

export function LogoutButton() {
    const router = useRouter()

    async function handleLogout() {
        await authClient.signOut()
        router.push("/sign-in")
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-500 hover:text-red-500 cursor-pointer"
        >
            <Image src={Logout} alt="" />
            Sair
        </button>
    )
}
