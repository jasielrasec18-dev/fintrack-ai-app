import { Sidebar } from './sidebar'

export const SKELETON_CARD = 'rounded-3xl border border-card-border bg-card'

export const LoadingShell = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen bg-app">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <div className="h-20 border-b border-card-border bg-app" />
                <main
                    className="animate-pulse p-4 md:p-8"
                    role="status"
                    aria-label="Carregando"
                >
                    {children}
                </main>
            </div>
        </div>
    )
}
