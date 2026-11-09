import { prisma } from '@/src/lib/prisma'
import { requireSession } from '@/src/lib/session'

export const getRecentTransactions = async () => {
    const session = await requireSession()

    return prisma.transaction.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            date: 'desc',
        },
        take: 3,
    })
}
