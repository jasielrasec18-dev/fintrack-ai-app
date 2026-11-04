import { auth } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const getRecentTransactions = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id

    if (!userId) {
        redirect('/sign-in')
    }

    const lastTransactions = await prisma.transaction.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: 'desc',
        },
        take: 3,
    })

    return lastTransactions
}