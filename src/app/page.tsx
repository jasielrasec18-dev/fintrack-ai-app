import Sidebar from "@/src/components/sidebar";
import Header from "@/src/components/header";

import Image from "next/image";
import PigIcon from "@/src/assets/pig-icon.png";

export default function Home() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <Header />

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="bg-[#161b26] p-6 rounded-3xl border border-[#1d293d] flex flex-col justify-center items-center">
            <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-full mb-4">
              <Image src={PigIcon} alt="" />
            </div>
            <h4 className="text-lg font-bold">Economia do mês</h4>
            <p className="text-3xl font-bold text-emerald-500 mt-2">+12%</p>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Seu dashboard financeiro aparece aqui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
