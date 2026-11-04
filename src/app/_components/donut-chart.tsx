'use client'

import { PieChart, Pie, ResponsiveContainer } from 'recharts'

export interface DonutChartProps {
    depositsTotal: number
    expensesTotal: number
    investmentsTotal: number
    balance: number
}

export function DonutChart({
    depositsTotal,
    expensesTotal,
    investmentsTotal,
    balance,
}: DonutChartProps) {
    // Dados monetários base
    const data = [
        {
            name: 'Ganhos',
            value: Math.round(depositsTotal * 100) / 100,
            fill: '#9333EA',
        },
        {
            name: 'Gastos',
            value: Math.round(expensesTotal * 100) / 100,
            fill: '#F43F5E',
        },
        {
            name: 'Invest.',
            value: Math.round(investmentsTotal * 100) / 100,
            fill: '#3B82F6',
        },
    ].filter((item) => item.value > 0)

    // Total baseado apenas no que está sendo exibido
    const total = data.reduce((acc, item) => acc + item.value, 0)

    // Percentual individual
    const getPercent = (value: number) => {
        return total > 0 ? Math.round((value / total) * 100) : 0
    }

    // Percentual do saldo
    const balancePercent = total > 0 ? Math.round((balance / total) * 100) : 0

    if (data.length === 0) {
        return (
            <div className="w-full flex items-center justify-center py-16 text-muted-foreground">
                <span className="text-sm">Nenhuma transação neste mês</span>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col">
            {/* Área fixa do gráfico */}
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
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Centro do Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-muted-foreground">SALDO</span>

                    <span className="text-2xl font-bold">
                        {balance.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
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

            {/* Legenda */}
            <div className="mt-8 flex w-full flex-wrap justify-center gap-6 border-t border-card-dark pt-6">
                {data.map((entry) => (
                    <div
                        key={entry.name}
                        className="flex flex-col items-center gap-1 min-w-[100px]"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.fill }}
                                aria-hidden
                            />
                            <span className="text-[10px] font-bold uppercase tracking-[-0.05em] text-border-aside">
                                {entry.name}
                            </span>
                        </div>

                        <span className="text-lg font-bold text-text-primary">
                            {getPercent(entry.value)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}