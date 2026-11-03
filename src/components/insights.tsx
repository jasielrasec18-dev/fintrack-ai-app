"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Star from "@/src/assets/star.png";
import Analytics from "@/src/assets/analytics.png";
import Lightbulb from "@/src/assets/lightbulb.png";
import Refresh from "@/src/assets/refresh.png";
import type { TransactionCategory } from "@prisma/client";

interface CategorySummary {
  category: TransactionCategory;
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

interface AiResponse {
  suggestion: string;
  topCategory: string | null;
  topCategoryAmount: string | null;
}

export default function Insights({
  month,
  year,
  depositsTotal,
  expensesTotal,
  investmentsTotal,
  balance,
  totalExpensePerCategory,
}: InsightsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [topCategory, setTopCategory] = useState<string | null>(null);
  const [topCategoryAmount, setTopCategoryAmount] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          year,
          depositsTotal,
          expensesTotal,
          investmentsTotal,
          balance,
          totalExpensePerCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao carregar análise.");
        return;
      }
      setSuggestion((data as AiResponse).suggestion ?? null);
      setTopCategory((data as AiResponse).topCategory ?? null);
      setTopCategoryAmount((data as AiResponse).topCategoryAmount ?? null);
    } catch {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [
    month,
    year,
    depositsTotal,
    expensesTotal,
    investmentsTotal,
    balance,
    totalExpensePerCategory,
  ]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <Image src={Star} alt="" />
        <h3 className="text-xl font-bold">Insights com IA</h3>
      </div>

      {loading ? (
        <div className="bg-[#161b26] p-8 rounded-2xl border border-[#1d293d] flex flex-col items-center justify-center gap-4 min-h-[200px]">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500" aria-hidden />
          <p className="text-sm text-slate-400">Analisando seus dados do mês…</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
          <p className="text-sm text-red-400">{error}</p>
          <button
            type="button"
            onClick={fetchInsights}
            className="mt-3 text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          {topCategory && topCategoryAmount && (
            <div className="bg-[#161b26] p-6 rounded-2xl border border-[#1d293d] flex gap-4">
              <div className="bg-purple-100 dark:bg-purple-500/20 text-primary p-3 rounded-xl h-fit">
                <Image src={Analytics} alt="" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Categoria com maior gasto</p>
                <p className="font-semibold text-white">
                  {topCategory}: {topCategoryAmount}
                </p>
              </div>
            </div>
          )}

          {suggestion && (
            <div className="bg-emerald-500/5 border-emerald-500/20 p-6 rounded-2xl border flex gap-4">
              <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl h-fit shrink-0">
                <Image src={Lightbulb} alt="" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-emerald-400 mb-2">Sugestão de economia</p>
                <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {suggestion}
                </div>
              </div>
            </div>
          )}

          {!suggestion && !topCategory && !loading && !error && (
            <div className="bg-[#161b26] p-6 rounded-2xl border border-[#1d293d] text-center text-slate-400 text-sm">
              Adicione transações no mês para receber sugestões da IA.
            </div>
          )}
        </>
      )}

      <button
        type="button"
        onClick={fetchInsights}
        disabled={loading}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image src={Refresh} alt="" />
        <span className="font-medium">Atualizar análise</span>
      </button>
    </div>
  );
}
