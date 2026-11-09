import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const AUTH_ROUTES = ['/sign-in', '/sign-up']

// Um cookie expirado ou revogado continua presente, e redirecionar só pela presença
// dele faria /sign-in e / se redirecionarem sem fim.
async function isSessionValid(request: NextRequest) {
    try {
        const response = await fetch(
            new URL('/api/auth/get-session', request.url),
            { headers: { cookie: request.headers.get('cookie') ?? '' } }
        )
        return response.ok && Boolean(await response.json())
    } catch {
        return false
    }
}

// Checagem otimista pelo cookie; a validação real da sessão fica nas páginas e rotas.
export async function proxy(request: NextRequest) {
    const hasSessionCookie = Boolean(getSessionCookie(request))
    const isAuthRoute = AUTH_ROUTES.includes(request.nextUrl.pathname)

    if (!hasSessionCookie && !isAuthRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    if (hasSessionCookie && isAuthRoute && (await isSessionValid(request))) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/transactions', '/sign-in', '/sign-up'],
}
