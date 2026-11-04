import { Sidebar } from './_components/sidebar'
import { Header } from './_components/header'
import BalanceCard from './_components/balance-card'
import { FinancialMetricCard } from './_components/financial-metric-card'
import { ChartCard } from './_components/chart-card'
import { AiInsights } from './_components/ai-insights'
import { RecentTransactions } from './_components/recent-transactions'
import { getDashboard } from './_data/get-dashboard'
import dayjs from 'dayjs'

interface DashboardPageProps {
    searchParams: Promise<{ month?: string }>
}

export default async function Home({ searchParams }: DashboardPageProps) {
    const { month } = await searchParams

    const currentMonth = month ?? dayjs().format('MM')

    const data = await getDashboard(currentMonth)

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
                                depositsTotal={data.depositsTotal}
                                expensesTotal={data.expensesTotal}
                                investmentsTotal={data.investmentsTotal}
                                balance={data.balance}
                            />
                        </div>

                        <div className="flex-1">
                            <AiInsights
                                month={currentMonth}
                                year={dayjs().year()}
                                depositsTotal={data.depositsTotal}
                                expensesTotal={data.expensesTotal}
                                investmentsTotal={data.investmentsTotal}
                                balance={data.balance}
                                totalExpensePerCategory={
                                    data.totalExpensePerCategory
                                }
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