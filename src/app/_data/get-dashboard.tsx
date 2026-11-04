import { prisma } from '@/src/lib/prisma'
import { TransactionType } from '@prisma/client'

import { auth } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const getDashboard = async (month: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id

    if (!userId) {
        redirect('/sign-in')
    }

    const year = 2026

    const startOfMonth = new Date(`${year}-${month}-01T00:00:00.000Z`)

    const startOfNextMonth = new Date(
        month === '12'
            ? `${year + 1}-01-01T00:00:00.000Z`
            : `${year}-${String(Number(month) + 1).padStart(2, '0')}-01T00:00:00.000Z`
    )

    const where = {
        userId,
        date: {
            gte: startOfMonth,
            lt: startOfNextMonth,
        },
    }

    const previousMonth = String(Number(month) - 1).padStart(2, '0')

    const startOfPreviousMonth = new Date(
        month === '01'
            ? `${year - 1}-01-01T00:00:00.000Z`
            : `${year}-${String(previousMonth)}-01T00:00:00.000Z`
    )

    const startOfCurrentMonth = startOfMonth

    const previousWhere = {
        userId,
        date: {
            gte: startOfPreviousMonth,
            lt: startOfCurrentMonth,
        },
    }

    const depositsTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...where,
                    type: 'DEPOSIT',
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount
    )

    const investmentsTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...where,
                    type: 'INVESTMENT',
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount
    )

    const expensesTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...where,
                    type: 'EXPENSE',
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount
    )

    const balance = depositsTotal - investmentsTotal - expensesTotal // saldo

    const transactionsTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...where,
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount
    )

    const previousDepositsTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...previousWhere,
                    type: 'DEPOSIT',
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount
    )

    const previousInvestmentsTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...previousWhere,
                    type: 'INVESTMENT',
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount
    )

    const previousExpensesTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...previousWhere,
                    type: 'EXPENSE',
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount
    )

    const previousBalance =
        previousDepositsTotal - previousExpensesTotal - previousInvestmentsTotal

    const difference = balance - previousBalance

    const percentage =
        previousBalance === 0
            ? 0
            : (difference / Math.abs(previousBalance)) * 100

    const typePercentage = {
        [TransactionType.DEPOSIT]: Math.round(
            (Number(depositsTotal) / Number(transactionsTotal)) * 100
        ),
        [TransactionType.EXPENSE]: Math.round(
            (Number(expensesTotal) / Number(transactionsTotal)) * 100
        ),
        [TransactionType.INVESTMENT]: Math.round(
            (Number(investmentsTotal) / Number(transactionsTotal)) * 100
        ),
    }

    const totalExpensePerCategory = (
        await prisma.transaction.groupBy({
            by: ['category'],
            where: {
                ...where,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        })
    ).map((category) => ({
        category: category.category,
        totalAmount: Number(category._sum.amount),
        percentageOfTotal: Math.round(
            (Number(category._sum.amount) / Number(expensesTotal)) * 100
        ),
    }))

    return {
        depositsTotal,
        investmentsTotal,
        expensesTotal,
        transactionsTotal,
        balance,
        totalExpensePerCategory,
        typePercentage,
        session,
        difference,
        percentage,
    }
}