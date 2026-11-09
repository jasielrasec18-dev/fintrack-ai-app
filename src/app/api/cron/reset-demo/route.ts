import { NextResponse } from 'next/server'
import { resetDemo } from '@/src/lib/demo'

export const runtime = 'nodejs'

export async function GET(req: Request) {
    const secret = process.env.CRON_SECRET
    if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    try {
        return NextResponse.json(await resetDemo())
    } catch (err) {
        console.error('[reset-demo] erro ao reiniciar a conta', err)
        return NextResponse.json(
            { error: 'Erro ao reiniciar a conta de demonstração.' },
            { status: 500 }
        )
    }
}
