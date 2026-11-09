import { DonutChart } from './donut-chart'
import { MonthSelect } from './month-select'

export interface DonutChartProps {
    month: string
    depositsTotal: number
    expensesTotal: number
    investmentsTotal: number
    balance: number
}

export const ChartCard = ({
    month,
    depositsTotal,
    expensesTotal,
    investmentsTotal,
    balance,
}: DonutChartProps) => {
    return (
        <div className="rounded-3xl border border-card-border bg-card p-8">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-white">Gráficos</h3>
                <MonthSelect month={month} />
            </div>

            <div>
                <DonutChart
                    depositsTotal={depositsTotal}
                    expensesTotal={expensesTotal}
                    investmentsTotal={investmentsTotal}
                    balance={balance}
                />
            </div>
        </div>
    )
}