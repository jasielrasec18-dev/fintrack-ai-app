import dayjs from './dayjs'
import { prisma } from './prisma'

const DAILY_LIMITS = {
    insights: 10,
    categorize: 100,
} as const

export type AiFeature = keyof typeof DAILY_LIMITS

/** Registra um uso e informa se ele ainda cabe no limite diário do usuário. */
export async function consumeAiQuota(userId: string, feature: AiFeature) {
    const day = dayjs.utc().startOf('day').toDate()

    const { count } = await prisma.aiUsage.upsert({
        where: { userId_feature_day: { userId, feature, day } },
        create: { userId, feature, day, count: 1 },
        update: { count: { increment: 1 } },
        select: { count: true },
    })

    return count <= DAILY_LIMITS[feature]
}
