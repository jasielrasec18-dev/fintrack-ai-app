import { prisma } from '@/src/lib/prisma'

export const getBudgets = async (userId: string) => {
    const budgets = await prisma.budget.findMany({
        where: { userId },
        select: { category: true, amount: true },
    })

    return budgets.map(({ category, amount }) => ({
        category,
        amount: Number(amount),
    }))
}
