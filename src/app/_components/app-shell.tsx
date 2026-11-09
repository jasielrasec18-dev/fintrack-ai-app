import { Header } from './header'
import { Sidebar } from './sidebar'

interface AppShellProps {
    user: { name: string; email: string }
    children: React.ReactNode
}

export const AppShell = ({ user, children }: AppShellProps) => {
    return (
        <div className="flex min-h-screen bg-app">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    userName={user.name}
                    userEmail={user.email}
                    date={new Date()}
                />
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    )
}
