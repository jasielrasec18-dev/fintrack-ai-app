import Image from "next/image"
import Avatar from "@/src/assets/avatar.png"

export default function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-background-dark-header border-b sticky top-0 border-[#1d293d]">
      <div>
        <h2 className="text-lg font-semibold">
          Bem-vindo de volta! 👋
        </h2>
        <p className="text-xs text-slate-500">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long"
          })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border">
          <Image
            src={Avatar}
            alt="Avatar"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </div>
    </header>
  )
}
