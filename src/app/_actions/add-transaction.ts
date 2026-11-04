'use server'

import { Prisma } from '@prisma/client'
import {
    type CreateTransactionFormData,
    createTransactionFormSchema,
} from '../_schemas/transaction'
import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

type AddTransactionParams = Omit<
    Prisma.TransactionCreateInput,
    'user' | 'userId'
>

export const addTransaction = async (params: AddTransactionParams) => {
    const data = createTransactionFormSchema.parse(params)

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id

    if (!userId) {
        redirect('/sign-in')
    }

    await prisma.transaction.create({
        data: {
            ...data,
            user: { connect: { id: userId }}
        },
    })
}