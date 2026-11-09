import { prisma } from '@/src/lib/prisma'
import {
    calcBalance,
    calcCategoryPercentages,
    calcPercentChange,
    getExpensesByCategory,
    getLastMonths,
    getMonthRange,
    getPreviousMonth,
    type MonthRef,
    sumByType,
    toMonthKey,
    type TransactionTotal,
} from '@/src/lib/finance'
import { MONTH_OPTIONS } from '../_constants/months'

const EVOLUTION_MONTHS = 6

const keyOf = ({ year, month }: MonthRef) => `${year}-${month}`

const monthLabel = (month: string) =>
    MONTH_OPTIONS.find((option) => option.value === month)?.label.slice(0, 3) ??
    month

export const getMonthSummary = async (
    userId: string,
    month: string,
    year: number
) => {
    const months = getLastMonths(year, month, EVOLUTION_MONTHS)

    // Uma consulta cobre o mês, o anterior, as categorias e a evolução.
    const groups = await prisma.transaction.groupBy({
        by: ['date', 'type', 'category'],
        where: {
            userId,
            date: {
                gte: getMonthRange(months[0].year, months[0].month).start,
                lt: getMonthRange(year, month).end,
            },
        },
        _sum: { amount: true },
    })

    const totals: TransactionTotal[] = groups.map((group) => ({
        monthKey: toMonthKey(group.date),
        type: group.type,
        category: group.category,
        amount: Number(group._sum.amount ?? 0),
    }))

    const totalsOf = (ref: MonthRef) => {
        const key = keyOf(ref)
        const depositsTotal = sumByType(totals, key, 'DEPOSIT')
        const expensesTotal = sumByType(totals, key, 'EXPENSE')
        const investmentsTotal = sumByType(totals, key, 'INVESTMENT')

        return {
            depositsTotal,
            expensesTotal,
            investmentsTotal,
            balance: calcBalance(
                depositsTotal,
                expensesTotal,
                investmentsTotal
            ),
        }
    }

    const current = totalsOf({ year, month })
    const previous = totalsOf(getPreviousMonth(year, month))

    return {
        ...current,
        previousBalance: previous.balance,
        difference: current.balance - previous.balance,
        percentage: calcPercentChange(current.balance, previous.balance),
        totalExpensePerCategory: calcCategoryPercentages(
            getExpensesByCategory(totals, keyOf({ year, month }))
        ),
        evolution: months.map((ref) => {
            const { depositsTotal, expensesTotal } = totalsOf(ref)
            return {
                label: monthLabel(ref.month),
                ganhos: depositsTotal,
                gastos: expensesTotal,
            }
        }),
    }
}
