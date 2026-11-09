import { auth } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { getMonthSummary } from './get-month-summary'

export const getDashboard = async (month: string, year: number) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/sign-in')
    }

    const summary = await getMonthSummary(session.user.id, month, year)

    return { ...summary, session }
}
