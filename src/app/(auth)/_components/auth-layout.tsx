import Link from 'next/link'
import DolarIcon from '../../../assets/dolar-icon.png'
import Image from 'next/image'

interface AuthLayoutProps {
    title: string
    description: string
    children: React.ReactNode
    footerText: string
    footerLinkText: string
    footerHref: string
}

export const AuthLayout = ({
    children,
    description,
    title,
    footerHref,
    footerLinkText,
    footerText
}: AuthLayoutProps) => {
    return (
        <section className="flex min-h-screen items-center justify-center bg-[#0B0E14] p-4 sm:p-10">
            <div className="w-full max-w-[400px] rounded-3xl border border-white/10 bg-[#18181B] p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/40">
                        <Image
                            src={DolarIcon}
                            alt=""
                        />
                    </div>

                    <h1 className="mb-2 text-xl font-bold text-white">
                        {title}
                    </h1>
                    <p className="text-xs text-[#9F9FA9]">{description}</p>
                </div>

                {children}

                <div className="mt-10 text-center">
                    <p className="text-sm text-[#9F9FA9]">
                        {footerText}
                        <Link href={footerHref} className="ml-1 text-primary font-semibold hover:underline">
                            {footerLinkText}
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}