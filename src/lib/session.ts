import { cache } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from './auth'

/** Busca a sessão uma única vez por request. */
export const getSession = cache(async () =>
    auth.api.getSession({ headers: await headers() })
)

export async function requireSession() {
    const session = await getSession()

    if (!session) {
        redirect('/sign-in')
    }

    return session
}
