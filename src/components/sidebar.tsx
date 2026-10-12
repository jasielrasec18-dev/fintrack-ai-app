import Link from "next/link";
import Image from "next/image";

import DashboardIcon from "@/src/assets/reports-icon.png";
import ReportIcon from "@/src/assets/transactions-icon.png";
import Logo from "@/src/assets/logo.png";
import { LogoutButton } from "./logout";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-[#1d293d] flex flex-col bg-background-dark-header">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl">
          <Image src={Logo} alt="" />
        </div>
        <h1 className="text-xl font-bold">FinTrack</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 bg-primary rounded-xl"
        >
          <Image src={DashboardIcon} alt="" />
          Dashboard
        </Link>

        <div
          className="flex items-center gap-3 px-4 py-3 text-slate-500 rounded-xl opacity-50 cursor-not-allowed select-none"
          title="Disponível em uma próxima aula"
        >
          <Image src={ReportIcon} alt="" />
          Relatórios
        </div>
      </nav>

      <div className="p-6 border-t border-[#1d293d]">
        <LogoutButton />
      </div>
    </aside>
  );
}
