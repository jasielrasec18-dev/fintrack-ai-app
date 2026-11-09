import { AppShell } from './_components/app-shell'
import BalanceCard from './_components/balance-card'
import { FinancialMetricCard } from './_components/financial-metric-card'
import { ChartCard } from './_components/chart-card'
import { AiInsights } from './_components/ai-insights'
import { BudgetsCard } from './_components/budgets-card'
import { CategoryExpenses } from './_components/category-expenses'
import { MonthlyEvolutionChart } from './_components/monthly-evolution-chart'
import { RecentTransactions } from './_components/recent-transactions'
import { TransactionFormDialog } from './_components/transaction-form-dialog'
import { getDashboard } from './_data/get-dashboard'
import dayjs from '@/src/lib/dayjs'
import { z } from 'zod'

const monthSchema = z.string().regex(/^(0[1-9]|1[0-2])$/)
const yearSchema = z.coerce.number().int().min(2000).max(2100)

interface DashboardPageProps {
    searchParams: Promise<{ month?: string; year?: string }>
}

export default async function Home({ searchParams }: DashboardPageProps) {
    const { month, year } = await searchParams

    const today = dayjs()
    const parsedMonth = monthSchema.safeParse(month)
    const parsedYear = yearSchema.safeParse(year)
    const currentMonth = parsedMonth.success
        ? parsedMonth.data
        : today.format('MM')
    const currentYear = parsedYear.success ? parsedYear.data : today.year()

    const data = await getDashboard(currentMonth, currentYear)

    return (
        <AppShell user={data.session.user}>
            <div className="mx-auto w-full max-w-[1120px] space-y-8">
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <BalanceCard
                            balance={data.balance}
                            revenues={data.depositsTotal}
                            expenses={data.expensesTotal}
                        />
                    </div>
                    <FinancialMetricCard
                        difference={data.difference}
                        percentage={data.percentage}
                        previousBalance={data.previousBalance}
                    />
                </section>

                <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="min-w-0">
                        <ChartCard
                            month={currentMonth}
                            depositsTotal={data.depositsTotal}
                            expensesTotal={data.expensesTotal}
                            investmentsTotal={data.investmentsTotal}
                            balance={data.balance}
                        />
                    </div>

                    <div className="min-w-0">
                        <AiInsights
                            key={`${currentYear}-${currentMonth}`}
                            month={currentMonth}
                            year={currentYear}
                        />
                    </div>
                </section>

                <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="min-w-0">
                        <MonthlyEvolutionChart data={data.evolution} />
                    </div>
                    <div className="min-w-0">
                        <CategoryExpenses
                            items={data.totalExpensePerCategory}
                        />
                    </div>
                </section>

                <section>
                    <BudgetsCard budgets={data.budgets} />
                </section>

                <section>
                    <RecentTransactions />
                </section>
            </div>
            <TransactionFormDialog variant="fab" />
        </AppShell>
    )
}
