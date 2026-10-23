import { DonutChart } from "./donut-chart";

interface ChartCardProps {
  depositsTotal: number;
  expensesTotal: number;
  investmentsTotal: number;
  balance: number;
}

export default function ChartCard({
  depositsTotal,
  expensesTotal,
  investmentsTotal,
  balance,
}: ChartCardProps) {
  return (
    <div className="bg-[#161b26] p-6 rounded-3xl border border-[#1d293d]">
      <h3 className="text-xl font-bold mb-6">Gráficos</h3>
      <div className="flex justify-center">
        <DonutChart
          depositsTotal={depositsTotal}
          expensesTotal={expensesTotal}
          investmentsTotal={investmentsTotal}
          balance={balance}
        />
      </div>
    </div>
  );
}
