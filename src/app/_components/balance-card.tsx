import Image from 'next/image'
import iconReceitas from '@/src/assets/revenues-icon.png'
import iconDespesas from '@/src/assets/expenses-icon.png'
import decorative from '@/src/assets/decorative-icon.png'
import { formatBRL } from '@/src/lib/format'

export interface BalanceCardProps {
    /** Saldo total (receitas - despesas) */
    balance: number
    /** Total de receitas do período */
    revenues: number
    /** Total de despesas do período */
    expenses: number
}

export default function BalanceCard({
    balance,
    revenues,
    expenses,
}: BalanceCardProps) {
    return (
        <section
            className="relative flex h-full w-full flex-col justify-between gap-2 self-stretch overflow-hidden rounded-3xl bg-primary p-8 shadow-[0px_8px_10px_-6px_rgba(168,85,247,0.2),0px_20px_25px_-5px_rgba(168,85,247,0.2)]"
            aria-label="Resumo do saldo"
        >
            <div
                className="pointer-events-none absolute rounded-full bg-white/10 w-[256px] h-[256px] top-[46px] right-[-80px]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute rounded-full bg-white/5 w-[192px] h-[192px] left-[-48px] top-[-48px]"
                aria-hidden
            />

            <div className="relative flex flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-[1.43] text-[#F3E8FF]/90">
                        Saldo total
                    </p>
                    <p className="text-4xl font-bold sm:text-5xl leading-none tracking-[-0.025em] text-white">
                        {formatBRL(balance)}
                    </p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <Image
                        src={decorative}
                        alt=""
                        width={24}
                        height={24}
                        className="object-contain"
                    />
                </div>
            </div>

            <div
                className="mt-6 border-t border-white/20 pt-6"
                role="separator"
                aria-hidden
            />

            <div className="flex flex-row flex-wrap items-stretch justify-stretch gap-4">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-row items-center gap-2">
                        <Image
                            src={iconReceitas}
                            alt=""
                            width={14}
                            height={20}
                            className="h-[14px] w-3.5 shrink-0 object-contain"
                        />
                        <span className="text-xs font-normal leading-[1.33] text-[#F3E8FF]">
                            Receitas
                        </span>
                    </div>
                    <p className="text-xl font-semibold leading-[1.4] text-white">
                        {formatBRL(revenues)}
                    </p>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex flex-row items-center gap-2">
                        <Image
                            src={iconDespesas}
                            alt=""
                            width={14}
                            height={20}
                            className="h-[14px] w-3.5 shrink-0 object-contain"
                        />
                        <span className="text-xs font-normal leading-[1.33] text-[#F3E8FF]">
                            Despesas
                        </span>
                    </div>
                    <p className="text-xl font-semibold leading-[1.4] text-white">
                        {formatBRL(expenses)}
                    </p>
                </div>
            </div>
        </section>
    )
}