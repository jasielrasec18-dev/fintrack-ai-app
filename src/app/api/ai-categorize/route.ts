import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { TransactionCategory } from '@prisma/client'
import { z } from 'zod'
import { auth } from '@/src/lib/auth'
import { consumeAiQuota } from '@/src/lib/ai-usage'
import {
    createGeminiClient,
    GEMINI_MAX_OUTPUT_TOKENS,
    GEMINI_MODEL,
} from '@/src/lib/gemini'
import { matchCategory } from '@/src/app/_constants/category-keywords'
import { TRANSACTION_CATEGORY_LABELS } from '@/src/app/_constants/transaction'

export const runtime = 'nodejs'
export const maxDuration = 30

const CATEGORIES = Object.values(TransactionCategory)
const NO_SUGGESTION = { category: null, type: null }

const bodySchema = z.object({ name: z.string().trim().min(3).max(100) })
const answerSchema = z.object({ category: z.enum(TransactionCategory) })

const SYSTEM_PROMPT = `Classifique o título de uma transação financeira pessoal em uma destas categorias: ${CATEGORIES.map(
    (category) => `${category} (${TRANSACTION_CATEGORY_LABELS[category]})`
).join(
    ', '
)}. Use OTHER se o título não indicar claramente outra categoria. Responda em JSON.`

export async function POST(req: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const parsed = bodySchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Parâmetros inválidos.' },
            { status: 400 }
        )
    }

    const known = matchCategory(parsed.data.name)
    if (known) {
        return NextResponse.json(known)
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return NextResponse.json(NO_SUGGESTION)
    }

    // Uma falha aqui nunca atrapalha o formulário: ele só fica sem sugestão.
    try {
        if (!(await consumeAiQuota(session.user.id, 'categorize'))) {
            return NextResponse.json(NO_SUGGESTION)
        }

        const response = await createGeminiClient(
            apiKey
        ).models.generateContent({
            model: GEMINI_MODEL,
            contents: parsed.data.name,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0,
                maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
                responseMimeType: 'application/json',
                responseJsonSchema: {
                    type: 'object',
                    properties: {
                        category: { type: 'string', enum: CATEGORIES },
                    },
                    required: ['category'],
                },
            },
        })

        const { category } = answerSchema.parse(
            JSON.parse(response.text ?? '{}')
        )

        return NextResponse.json({ category, type: null })
    } catch (err) {
        console.error('[ai-categorize] erro ao sugerir categoria', err)
        return NextResponse.json(NO_SUGGESTION)
    }
}
