import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from './_components/ui/sonner'
import '../styles/globals.css'

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
    ),
    title: 'FinTrack AI',
    description: 'Controle financeiro pessoal com insights de IA',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR" className={`dark ${inter.variable}`}>
            <body className="antialiased">
                {children}
                <Toaster />
            </body>
        </html>
    )
}
