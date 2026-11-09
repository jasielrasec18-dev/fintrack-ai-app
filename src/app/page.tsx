import { Sidebar } from './_components/sidebar'
import { Header } from './_components/header'
import BalanceCard from './_components/balance-card'
import { FinancialMetricCard } from './_components/financial-metric-card'
import { ChartCard } from './_components/chart-card'
import { AiInsights } from './_components/ai-insights'
import { RecentTransactions } from './_components/recent-transactions'
import { AddTransactionButton } from './_components/add-transaction-button'
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
        <div className="flex min-h-screen bg-app">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    userName={data.session.user.name}
                    userEmail={data.session.user.email}
                    date={new Date()}
                />
                <main className="p-4 md:p-8">
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

                        <section>
                            <RecentTransactions />
                        </section>
                    </div>
                    <AddTransactionButton variant="fab" />
                </main>
            </div>
        </div>
    )
}
