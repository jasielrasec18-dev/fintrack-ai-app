'use server'

import { TransactionCategory } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/src/lib/prisma'
import { requireSession } from '@/src/lib/session'

const budgetsSchema = z.array(
    z.object({
        category: z.enum(TransactionCategory),
        // Sem valor, o limite da categoria é removido.
        amount: z.number().positive().max(999_999_999).nullable(),
    })
)

export const saveBudgets = async (
    params: { category: TransactionCategory; amount: number | null }[]
) => {
    const budgets = budgetsSchema.parse(params)
    const { user } = await requireSession()
    const userId = user.id

    await prisma.$transaction(
        budgets.map(({ category, amount }) =>
            amount === null
                ? prisma.budget.deleteMany({ where: { userId, category } })
                : prisma.budget.upsert({
                      where: { userId_category: { userId, category } },
                      create: { userId, category, amount },
                      update: { amount },
                  })
        )
    )

    revalidatePath('/')
    revalidatePath('/budgets')
}
