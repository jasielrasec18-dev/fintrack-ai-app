import Sidebar from "@/src/components/sidebar";
import Header from "@/src/components/header";
import BalanceCard from "@/src/components/balance-card";
import ChartCard from "@/src/components/chart-card";
import Insights from "@/src/components/insights";
import Transactions from "@/src/components/transactions";

import PigIcon from "@/src/assets/pig-icon.png";
import Image from "next/image";

const data = {
  balance: 4750,
  depositsTotal: 8200,
  expensesTotal: 2450,
  investmentsTotal: 1000,
};

export default function Home() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <Header />

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BalanceCard {...data} />
            <div className="bg-[#161b26] p-6 rounded-3xl border border-[#1d293d] flex flex-col justify-center items-center">
              <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-full mb-4">
                <Image src={PigIcon} alt="" />
              </div>
              <h4 className="text-lg font-bold">Economia do mês</h4>
              <p className="text-3xl font-bold text-emerald-500 mt-2">+12%</p>
            </div>
          </section>

          <section className="flex w-full gap-8">
            <div className="w-1/2">
              <ChartCard
                depositsTotal={data.depositsTotal}
                expensesTotal={data.expensesTotal}
                investmentsTotal={data.investmentsTotal}
                balance={data.balance}
              />
            </div>
            <div className="w-1/2">
              <Insights
                month="06"
                year={2026}
                depositsTotal={data.depositsTotal}
                expensesTotal={data.expensesTotal}
                investmentsTotal={data.investmentsTotal}
                balance={data.balance}
                totalExpensePerCategory={[]}
              />
            </div>
          </section>

          <Transactions />
        </div>
      </div>
    </div>
  );
}
