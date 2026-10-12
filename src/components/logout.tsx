"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Logout from "@/src/assets/logout.png"

export function LogoutButton() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.push("/sign-in")}
            className="flex items-center gap-3 text-slate-500 hover:text-red-500 cursor-pointer"
        >
            <Image src={Logout} alt="" />
            Sair
        </button>
    )
}
