'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-app p-6 text-center">
            <h1 className="text-2xl font-bold text-white">Algo deu errado</h1>
            <p className="text-sm text-text-muted">
                Não foi possível carregar esta página.
            </p>
            <button
                type="button"
                onClick={reset}
                className="h-12 cursor-pointer rounded-xl bg-primary px-6 font-bold text-white transition-colors hover:bg-[#7E22CE]"
            >
                Tentar novamente
            </button>
        </main>
    )
}
