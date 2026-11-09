import type { TransactionCategory, TransactionType } from '@prisma/client'
import dayjs from './dayjs'

export interface MonthRef {
    year: number
    month: string
}

export interface TransactionTotal {
    /** Mês no formato YYYY-MM */
    monthKey: string
    type: TransactionType
    category: TransactionCategory
    amount: number
}

export interface CategoryTotal {
    category: TransactionCategory
    totalAmount: number
}

export type BudgetStatus = 'ok' | 'warning' | 'over'

// As transações são gravadas à meia-noite UTC, então os limites também são UTC.
const startOfMonth = (year: number, month: string) =>
    dayjs.utc(`${year}-${month}-01`).startOf('month')

const toMonthRef = (date: dayjs.Dayjs): MonthRef => ({
    year: date.year(),
    month: date.format('MM'),
})

export const toMonthKey = (date: Date) => dayjs.utc(date).format('YYYY-MM')

export function getMonthRange(year: number, month: string) {
    const start = startOfMonth(year, month)
    return { start: start.toDate(), end: start.add(1, 'month').toDate() }
}

export function getPreviousMonth(year: number, month: string): MonthRef {
    return toMonthRef(startOfMonth(year, month).subtract(1, 'month'))
}

/** Os últimos `count` meses até o informado, do mais antigo para o mais novo. */
export function getLastMonths(
    year: number,
    month: string,
    count: number
): MonthRef[] {
    const last = startOfMonth(year, month)
    return Array.from({ length: count }, (_, index) =>
        toMonthRef(last.subtract(count - 1 - index, 'month'))
    )
}

export function calcBalance(
    deposits: number,
    expenses: number,
    investments: number
) {
    return deposits - expenses - investments
}

export function calcPercentChange(current: number, previous: number) {
    if (previous === 0) return 0
    return ((current - previous) / Math.abs(previous)) * 100
}

export function calcCategoryPercentages(items: CategoryTotal[]) {
    const total = items.reduce((sum, item) => sum + item.totalAmount, 0)

    return items.map((item) => ({
        ...item,
        percentageOfTotal:
            total > 0 ? Math.round((item.totalAmount / total) * 100) : 0,
    }))
}

export function sumByType(
    totals: TransactionTotal[],
    monthKey: string,
    type: TransactionType
) {
    return totals
        .filter((row) => row.monthKey === monthKey && row.type === type)
        .reduce((sum, row) => sum + row.amount, 0)
}

export function getExpensesByCategory(
    totals: TransactionTotal[],
    monthKey: string
): CategoryTotal[] {
    const byCategory = new Map<TransactionCategory, number>()

    for (const row of totals) {
        if (row.monthKey === monthKey && row.type === 'EXPENSE') {
            byCategory.set(
                row.category,
                (byCategory.get(row.category) ?? 0) + row.amount
            )
        }
    }

    return [...byCategory].map(([category, totalAmount]) => ({
        category,
        totalAmount,
    }))
}

export function getBudgetStatus(percentage: number): BudgetStatus {
    if (percentage > 100) return 'over'
    return percentage >= 80 ? 'warning' : 'ok'
}

export function calcBudgetProgress(
    budgets: { category: TransactionCategory; amount: number }[],
    expenses: CategoryTotal[]
) {
    return budgets.map(({ category, amount }) => {
        const spent =
            expenses.find((item) => item.category === category)?.totalAmount ??
            0
        const percentage = amount > 0 ? Math.round((spent / amount) * 100) : 0

        return {
            category,
            limit: amount,
            spent,
            percentage,
            status: getBudgetStatus(percentage),
        }
    })
}
