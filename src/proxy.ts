import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const AUTH_ROUTES = ['/sign-in', '/sign-up']

// Checagem otimista pelo cookie; a validação real da sessão fica nas páginas e rotas.
export function proxy(request: NextRequest) {
    const hasSession = Boolean(getSessionCookie(request))
    const isAuthRoute = AUTH_ROUTES.includes(request.nextUrl.pathname)

    if (!hasSession && !isAuthRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    if (hasSession && isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/transactions', '/sign-in', '/sign-up'],
}
