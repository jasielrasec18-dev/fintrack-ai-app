import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-app p-6 text-center">
            <h1 className="text-2xl font-bold text-white">
                Página não encontrada
            </h1>
            <p className="text-sm text-text-muted">
                O endereço acessado não existe.
            </p>
            <Link
                href="/"
                className="flex h-12 items-center rounded-xl bg-primary px-6 font-bold text-white transition-colors hover:bg-[#7E22CE]"
            >
                Voltar ao dashboard
            </Link>
        </main>
    )
}
