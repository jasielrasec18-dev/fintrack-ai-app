'use server'

import {
    type CreateTransactionFormData,
    createTransactionFormSchema,
} from '../_schemas/transaction'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const updateTransaction = async (
    id: string,
    params: CreateTransactionFormData
) => {
    const data = createTransactionFormSchema.parse(params)

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/sign-in')
    }

    await prisma.transaction.updateMany({
        where: { id, userId: session.user.id },
        data,
    })

    revalidatePath('/')
    revalidatePath('/transactions')
}
