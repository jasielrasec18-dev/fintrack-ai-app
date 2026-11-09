import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createHash } from 'node:crypto'
import { ApiError } from '@google/genai'
import { z } from 'zod'
import { auth } from '@/src/lib/auth'
import { consumeAiQuota } from '@/src/lib/ai-usage'
import { formatBRL } from '@/src/lib/format'
import {
    createGeminiClient,
    GEMINI_MAX_OUTPUT_TOKENS,
    GEMINI_MODEL,
} from '@/src/lib/gemini'
import { prisma } from '@/src/lib/prisma'
import { getMonthSummary } from '@/src/app/_data/get-month-summary'
import { TRANSACTION_CATEGORY_LABELS } from '@/src/app/_constants/transaction'
import { MONTH_OPTIONS } from '@/src/app/_constants/months'

export const runtime = 'nodejs'
export const maxDuration = 30

const bodySchema = z.object({
    month: z.string().regex(/^(0[1-9]|1[0-2])$/),
    year: z.number().int().min(2000).max(2100),
    force: z.boolean().optional(),
})

const insightSchema = z.object({
    suggestion: z.string().trim().min(1),
})

const SYSTEM_PROMPT =
    'Você é um consultor financeiro pessoal. Responda SEMPRE em JSON no formato {"suggestion": string}. A sugestão deve ter no máximo 2 frases (até 220 caracteres), em português do Brasil, prática e específica para a categoria que mais pesa.'

function getGeminiErrorResponse(err: ApiError) {
    const isInvalidKey =
        err.status === 401 ||
        err.status === 403 ||
        (err.status === 400 && /api key/i.test(err.message))

    if (isInvalidKey) {
        return { error: 'Chave do Gemini inválida.', status: 502 }
    }
    if (err.status === 429) {
        return {
            error: 'Limite de uso do Gemini atingido. Tente novamente mais tarde.',
            status: 429,
        }
    }
    if (err.status === 404) {
        return { error: 'Modelo de IA indisponível.', status: 502 }
    }
    if (err.status === 503 || err.status === 504) {
        return {
            error: 'Serviço de IA sobrecarregado. Tente novamente em instantes.',
            status: 503,
        }
    }
    return { error: 'Erro no serviço de IA.', status: 502 }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        console.error('[ai-insights] GEMINI_API_KEY ausente')
        return NextResponse.json(
            { error: 'IA indisponível: chave não configurada.' },
            { status: 503 }
        )
    }

    const parsed = bodySchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Parâmetros inválidos.' },
            { status: 400 }
        )
    }

    const { month, year, force } = parsed.data

    try {
        const summary = await getMonthSummary(session.user.id, month, year)

        if (
            summary.depositsTotal +
                summary.expensesTotal +
                summary.investmentsTotal ===
            0
        ) {
            return NextResponse.json({
                empty: true,
                suggestion: null,
                topCategory: null,
                topCategoryAmount: null,
            })
        }

        const categories = summary.totalExpensePerCategory
            .toSorted((a, b) => b.totalAmount - a.totalAmount)
            .map((item) => ({
                ...item,
                label: TRANSACTION_CATEGORY_LABELS[item.category],
            }))
        const top = categories[0] ?? null

        const monthName = MONTH_OPTIONS.find(
            (option) => option.value === month
        )?.label

        const userPrompt = `Dados de ${monthName} de ${year}:
- Ganhos: ${formatBRL(summary.depositsTotal)}
- Gastos: ${formatBRL(summary.expensesTotal)}
- Investimentos: ${formatBRL(summary.investmentsTotal)}
- Saldo: ${formatBRL(summary.balance)}

Gastos por categoria:
${
    categories
        .map(
            (item) =>
                `- ${item.label}: ${formatBRL(item.totalAmount)} (${item.percentageOfTotal}% dos gastos)`
        )
        .join('\n') || 'Nenhum gasto registrado.'
}`

        const topCategory = {
            topCategory: top?.label ?? null,
            topCategoryAmount: top ? formatBRL(top.totalAmount) : null,
        }

        // O hash muda quando os dados do prompt mudam, e isso invalida o cache.
        const dataHash = createHash('sha256').update(userPrompt).digest('hex')
        const key = {
            userId_year_month: {
                userId: session.user.id,
                year,
                month: Number(month),
            },
        }

        if (!force) {
            const cached = await prisma.aiInsight.findUnique({ where: key })
            if (cached?.dataHash === dataHash) {
                return NextResponse.json({
                    suggestion: cached.suggestion,
                    ...topCategory,
                })
            }
        }

        if (!(await consumeAiQuota(session.user.id, 'insights'))) {
            return NextResponse.json(
                { error: 'Limite diário de análises atingido.' },
                { status: 429 }
            )
        }

        const response = await createGeminiClient(
            apiKey
        ).models.generateContent({
            model: GEMINI_MODEL,
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.4,
                maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
                responseMimeType: 'application/json',
                responseJsonSchema: {
                    type: 'object',
                    properties: { suggestion: { type: 'string' } },
                    required: ['suggestion'],
                },
            },
        })

        const { suggestion } = insightSchema.parse(
            JSON.parse(response.text ?? '{}')
        )

        await prisma.aiInsight.upsert({
            where: key,
            create: {
                userId: session.user.id,
                year,
                month: Number(month),
                suggestion,
                dataHash,
            },
            update: { suggestion, dataHash },
        })

        return NextResponse.json({ suggestion, ...topCategory })
    } catch (err) {
        if (err instanceof ApiError) {
            console.error('[ai-insights] Gemini', err.status, err.message)
            const { error, status } = getGeminiErrorResponse(err)
            return NextResponse.json({ error }, { status })
        }
        console.error('[ai-insights] erro inesperado', err)
        return NextResponse.json(
            { error: 'Erro ao gerar insights.' },
            { status: 500 }
        )
    }
}
