'use client'

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts'
import { formatBRL } from '@/src/lib/format'

interface MonthlyEvolutionChartProps {
    data: { label: string; ganhos: number; gastos: number }[]
}

const LEGEND = [
    { name: 'Ganhos', color: '#9333EA' },
    { name: 'Gastos', color: '#F43F5E' },
]

export function MonthlyEvolutionChart({ data }: MonthlyEvolutionChartProps) {
    const hasData = data.some((item) => item.ganhos > 0 || item.gastos > 0)

    return (
        <div className="h-full rounded-3xl border border-card-border bg-card p-8">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-white">
                    Evolução mensal
                </h3>
                <div className="flex gap-4">
                    {LEGEND.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-2"
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                                aria-hidden
                            />
                            <span className="text-[10px] font-bold uppercase text-text-subtle">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {hasData ? (
                <div className="mt-6 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={4}>
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                formatter={(value) => formatBRL(Number(value))}
                                contentStyle={{
                                    background: '#1E293B',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 12,
                                }}
                                labelStyle={{ color: '#FFFFFF' }}
                                itemStyle={{ color: '#CBD5E1' }}
                            />
                            <Bar
                                dataKey="ganhos"
                                name="Ganhos"
                                fill="#9333EA"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="gastos"
                                name="Gastos"
                                fill="#F43F5E"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="mt-6 flex h-64 items-center justify-center text-sm text-text-muted">
                    Sem movimentações nos últimos meses
                </div>
            )}
        </div>
    )
}
