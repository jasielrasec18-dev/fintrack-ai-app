'use server'

import { prisma } from '@/src/lib/prisma'
import { auth } from '@/src/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const deleteTransaction = async (id: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/sign-in')
    }

    await prisma.transaction.deleteMany({
        where: { id, userId: session.user.id },
    })

    revalidatePath('/')
    revalidatePath('/transactions')
}
