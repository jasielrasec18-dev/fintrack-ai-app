import { DonutChart } from './donut-chart'
import { MonthSelect } from './month-select'

export interface DonutChartProps {
    depositsTotal: number
    expensesTotal: number
    investmentsTotal: number
    balance: number
}

export const ChartCard = ({
    depositsTotal,
    expensesTotal,
    investmentsTotal,
    balance,
}: DonutChartProps) => {
    return (
        <div className="bg-[#161B26] py-9 px-8 rounded-3xl">
            <div className="flex items-center justify-between">
                <h3>Gráficos</h3>
                <MonthSelect />
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