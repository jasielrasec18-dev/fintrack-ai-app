import Image from "next/image";
import Star from "@/src/assets/star.png";
import Lightbulb from "@/src/assets/lightbulb.png";

interface CategorySummary {
  category: string;
  totalAmount: number;
  percentageOfTotal: number;
}

interface InsightsProps {
  month: string;
  year: number;
  depositsTotal: number;
  expensesTotal: number;
  investmentsTotal: number;
  balance: number;
  totalExpensePerCategory: CategorySummary[];
}

export default function Insights({ month, year }: InsightsProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Image src={Star} alt="" />
        <h3 className="text-xl font-bold">Insights com IA</h3>
      </div>

      <p className="text-xs text-slate-500">
        Período de referência: {month}/{year}
      </p>

      <div className="bg-emerald-500/5 border-emerald-500/20 p-6 rounded-2xl border flex gap-4">
        <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl h-fit shrink-0">
          <Image src={Lightbulb} alt="" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-emerald-400 mb-2">Sugestão de economia</p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Em breve a IA vai analisar seus gastos do mês e sugerir economias
            personalizadas neste espaço.
          </p>
        </div>
      </div>
    </div>
  );
}
