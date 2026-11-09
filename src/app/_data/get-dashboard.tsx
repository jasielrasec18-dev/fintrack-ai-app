import { calcBudgetProgress } from '@/src/lib/finance'
import { requireSession } from '@/src/lib/session'
import { getBudgets } from './get-budgets'
import { getMonthSummary } from './get-month-summary'

export const getDashboard = async (month: string, year: number) => {
    const session = await requireSession()

    const [summary, budgets] = await Promise.all([
        getMonthSummary(session.user.id, month, year),
        getBudgets(session.user.id),
    ])

    return {
        ...summary,
        budgets: calcBudgetProgress(budgets, summary.totalExpensePerCategory),
        session,
    }
}
