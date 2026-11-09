'use server'

import {
    type CreateTransactionFormData,
    createTransactionFormSchema,
} from '../_schemas/transaction'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth'
import { DEMO_EMAIL, DEMO_TRANSACTION_LIMIT } from '@/src/lib/demo-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const addTransaction = async (
    params: CreateTransactionFormData
): Promise<{ error?: string }> => {
    const data = createTransactionFormSchema.parse(params)

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id

    if (!userId) {
        redirect('/sign-in')
    }

    if (session.user.email === DEMO_EMAIL) {
        const total = await prisma.transaction.count({ where: { userId } })
        if (total >= DEMO_TRANSACTION_LIMIT) {
            return {
                error: `A conta de demonstração permite até ${DEMO_TRANSACTION_LIMIT} transações.`,
            }
        }
    }

    await prisma.transaction.create({
        data: {
            ...data,
            user: { connect: { id: userId } },
        },
    })

    revalidatePath('/')
    revalidatePath('/transactions')

    return {}
}
