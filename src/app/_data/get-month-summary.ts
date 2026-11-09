import { TransactionType } from '@prisma/client'
import dayjs from '@/src/lib/dayjs'
import { prisma } from '@/src/lib/prisma'

const getTotalsByType = async (userId: string, start: Date, end: Date) => {
    const groups = await prisma.transaction.groupBy({
        by: ['type'],
        where: { userId, date: { gte: start, lt: end } },
        _sum: { amount: true },
    })

    const totalOf = (type: TransactionType) =>
        Number(groups.find((group) => group.type === type)?._sum.amount ?? 0)

    const depositsTotal = totalOf(TransactionType.DEPOSIT)
    const expensesTotal = totalOf(TransactionType.EXPENSE)
    const investmentsTotal = totalOf(TransactionType.INVESTMENT)

    return {
        depositsTotal,
        expensesTotal,
        investmentsTotal,
        balance: depositsTotal - expensesTotal - investmentsTotal,
    }
}

export const getMonthSummary = async (
    userId: string,
    month: string,
    year: number
) => {
    // As transações são gravadas à meia-noite UTC, então os limites também são UTC.
    const startOfMonth = dayjs.utc(`${year}-${month}-01`).startOf('month')
    const start = startOfMonth.toDate()
    const end = startOfMonth.add(1, 'month').toDate()
    const previousStart = startOfMonth.subtract(1, 'month').toDate()

    const [current, previous, expensesByCategory] = await Promise.all([
        getTotalsByType(userId, start, end),
        getTotalsByType(userId, previousStart, start),
        prisma.transaction.groupBy({
            by: ['category'],
            where: {
                userId,
                type: TransactionType.EXPENSE,
                date: { gte: start, lt: end },
            },
            _sum: { amount: true },
        }),
    ])

    const difference = current.balance - previous.balance
    const percentage =
        previous.balance === 0
            ? 0
            : (difference / Math.abs(previous.balance)) * 100

    const totalExpensePerCategory = expensesByCategory.map((item) => {
        const totalAmount = Number(item._sum.amount ?? 0)

        return {
            category: item.category,
            totalAmount,
            percentageOfTotal: Math.round(
                (totalAmount / current.expensesTotal) * 100
            ),
        }
    })

    return {
        ...current,
        previousBalance: previous.balance,
        difference,
        percentage,
        totalExpensePerCategory,
    }
}
