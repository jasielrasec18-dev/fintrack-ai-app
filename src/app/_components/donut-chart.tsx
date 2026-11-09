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
    const legend = [
        { name: 'Ganhos', value: depositsTotal, fill: '#9333EA' },
        { name: 'Gastos', value: expensesTotal, fill: '#F43F5E' },
        { name: 'Invest.', value: investmentsTotal, fill: '#3B82F6' },
    ]
    const data = legend.filter((item) => item.value > 0)
    const total = data.reduce((acc, item) => acc + item.value, 0)

    const getPercent = (value: number) =>
        total > 0 ? Math.round((value / total) * 100) : 0

    // Parcela do que entrou e não foi gasta nem investida.
    const generalPercent =
        depositsTotal > 0 ? Math.round((balance / depositsTotal) * 100) : 0

    return (
        <div className="flex w-full flex-col">
            {data.length === 0 ? (
                <div className="flex h-64 w-full items-center justify-center text-text-muted">
                    <span className="text-sm">Nenhuma transação neste mês</span>
                </div>
            ) : (
                <div className="relative h-64 w-full">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                        initialDimension={{ width: 1, height: 1 }}
                    >
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={81}
                                outerRadius={91}
                                paddingAngle={data.length > 1 ? 6 : 0}
                                cornerRadius={4}
                                stroke="none"
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold tracking-widest text-text-subtle">
                            GERAL
                        </span>
                        <span className="text-3xl font-bold text-white">
                            {generalPercent}%
                        </span>
                    </div>
                </div>
            )}

            <div className="mt-8 grid grid-cols-3 divide-x divide-card-border border-t border-card-border pt-6">
                {legend.map((entry) => (
                    <div
                        key={entry.name}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.fill }}
                                aria-hidden
                            />
                            <span className="text-[10px] font-bold uppercase text-text-subtle">
                                {entry.name}
                            </span>
                        </div>
                        <span className="text-lg font-bold text-white">
                            {getPercent(entry.value)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
