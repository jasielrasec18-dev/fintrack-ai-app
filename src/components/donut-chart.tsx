"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10B981", "#F43F5E", "#3B82F6"]; // Ganhos, Gastos, Invest.

export interface DonutChartProps {
  depositsTotal: number;
  expensesTotal: number;
  investmentsTotal: number;
  balance: number;
}

export function DonutChart({
  depositsTotal,
  expensesTotal,
  investmentsTotal,
  balance,
}: DonutChartProps) {
  const data = [
    { name: "Ganhos", value: Math.round(depositsTotal * 100) / 100 },
    { name: "Gastos", value: Math.round(expensesTotal * 100) / 100 },
    { name: "Invest.", value: Math.round(investmentsTotal * 100) / 100 },
  ].filter((item) => item.value > 0);

  const total = depositsTotal + expensesTotal + investmentsTotal;
  const balancePercent =
    total > 0 ? Math.round((balance / total) * 100) : 0;

  if (data.length === 0) {
    return (
      <div className="relative w-full h-64 flex flex-col items-center justify-center text-muted-foreground">
        <span className="text-sm">Nenhuma transação neste mês</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={80}
            outerRadius={90}
            paddingAngle={data.length > 1 ? 6 : 0}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-muted-foreground">SALDO</span>
        <span className="text-2xl font-bold">
          {balance.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
          })}
        </span>
        {total > 0 && (
          <span className="text-xs text-muted-foreground mt-0.5">
            {balancePercent}% do total
          </span>
        )}
      </div>
    </div>
  );
}
