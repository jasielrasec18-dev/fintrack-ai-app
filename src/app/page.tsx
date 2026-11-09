import { Sidebar } from './_components/sidebar'
import { Header } from './_components/header'
import BalanceCard from './_components/balance-card'
import { FinancialMetricCard } from './_components/financial-metric-card'
import { ChartCard } from './_components/chart-card'
import { AiInsights } from './_components/ai-insights'
import { RecentTransactions } from './_components/recent-transactions'
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
        <div className="flex min-h-screen bg-[#0F111A]">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Header userName={data.session.user.name} date={new Date()} />
                <main className="p-8 space-y-8">
                    <section className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                        <div className="lg:col-span-2 col-span-1">
                            <BalanceCard
                                balance={data.balance}
                                revenues={data.depositsTotal}
                                expenses={data.expensesTotal}
                            />
                        </div>
                        <FinancialMetricCard
                            difference={data.difference}
                            percentage={data.percentage}
                        />
                    </section>

                    <section className="flex gap-8">
                        <div className="flex-1">
                            <ChartCard
                                month={currentMonth}
                                depositsTotal={data.depositsTotal}
                                expensesTotal={data.expensesTotal}
                                investmentsTotal={data.investmentsTotal}
                                balance={data.balance}
                            />
                        </div>

                        <div className="flex-1">
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
                </main>
            </div>
        </div>
    )
}