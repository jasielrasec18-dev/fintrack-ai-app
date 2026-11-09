'use client'

import Image from 'next/image'
import bulbIcon from '@/src/assets/bulb-icon.png'
import insightsIcon from '@/src/assets/insights-icon.png'
import starIcon from '@/src/assets/star-icon.png'
import refreshIcon from '@/src/assets/refresh-icon.png'
import { useCallback, useEffect, useRef, useState } from 'react'

interface AiInsightsProps {
    month: string
    year: number
}

interface AiResponse {
    error?: string
    empty?: boolean
    suggestion?: string | null
    topCategory?: string | null
    topCategoryAmount?: string | null
}

async function requestInsights(
    month: string,
    year: number,
    force: boolean,
    signal: AbortSignal
): Promise<AiResponse> {
    try {
        const response = await fetch('/api/ai-insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month, year, force }),
            signal,
        })

        const data: AiResponse = await response
            .json()
            .catch(() => ({ error: 'Resposta inválida do servidor.' }))

        return response.ok
            ? data
            : { error: data.error ?? 'Erro ao carregar análise.' }
    } catch {
        return { error: 'Erro ao conectar. Tente novamente.' }
    }
}

export const AiInsights = ({ month, year }: AiInsightsProps) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [insights, setInsights] = useState<AiResponse | null>(null)
    const controllerRef = useRef<AbortController | null>(null)

    const fetchInsights = useCallback(
        (force: boolean) => {
            controllerRef.current?.abort()
            const controller = new AbortController()
            controllerRef.current = controller

            requestInsights(month, year, force, controller.signal).then(
                (data) => {
                    // Requisição cancelada: uma mais recente já assumiu o estado.
                    if (controller.signal.aborted) return

                    setError(data.error ?? null)
                    if (!data.error) setInsights(data)
                    setLoading(false)
                }
            )
        },
        [month, year]
    )

    useEffect(() => {
        fetchInsights(false)

        return () => controllerRef.current?.abort()
    }, [fetchInsights])

    const handleRefresh = () => {
        setLoading(true)
        setError(null)
        fetchInsights(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Image src={starIcon} alt="" />
                <h3 className="text-xl font-bold text-white">
                    Insights com IA
                </h3>
            </div>

            {loading ? (
                <div
                    className="space-y-6 animate-pulse"
                    role="status"
                    aria-label="Analisando seus dados do mês"
                >
                    <div className="h-24 rounded-2xl border border-card-border bg-card" />
                    <div className="h-36 rounded-2xl border border-success/20 bg-success/5" />
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
                    <p className="text-sm text-red-400">{error}</p>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-3 cursor-pointer text-sm font-medium text-[#A855F7] hover:text-[#C084FC]"
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : insights?.empty ? (
                <div className="rounded-2xl border border-card-border bg-card p-6 text-center text-sm text-text-muted">
                    Adicione transações neste mês para receber sugestões da IA.
                </div>
            ) : (
                <>
                    {insights?.topCategory && insights.topCategoryAmount && (
                        <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-card p-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                                <Image src={insightsIcon} alt="" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-white">
                                    Categoria com maior gasto
                                </p>
                                <p className="text-sm text-text-muted">
                                    {insights.topCategory}:{' '}
                                    <span className="font-semibold text-[#A855F7]">
                                        {insights.topCategoryAmount}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}

                    {insights?.suggestion && (
                        <div className="flex gap-4 rounded-2xl border border-success/20 bg-success/5 p-6">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/20">
                                <Image src={bulbIcon} alt="" />
                            </div>
                            <div className="min-w-0">
                                <p className="mb-2 font-semibold text-white">
                                    Sugestão de economia
                                </p>
                                <p className="text-sm leading-relaxed text-[#CBD5E1]">
                                    {insights.suggestion}
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}

            <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-card-border text-text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Image
                    src={refreshIcon}
                    alt=""
                    className={loading ? 'animate-spin' : undefined}
                />
                <span>Atualizar análise</span>
            </button>
        </div>
    )
}
