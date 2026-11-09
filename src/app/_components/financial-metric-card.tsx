import Image from 'next/image'
import PigIcon from '@/src/assets/pig-icon.png'
import { formatBRL } from '@/src/lib/format'

interface FinancialMetricCardProps {
    percentage: number
    difference: number
    previousBalance: number
}

export const FinancialMetricCard = ({
    difference,
    percentage,
    previousBalance,
}: FinancialMetricCardProps) => {
    const isPositive = difference >= 0
    const hasPreviousData = previousBalance !== 0
    const amount = formatBRL(Math.abs(difference))

    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-card-border bg-card px-4 py-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                <Image src={PigIcon} alt="" />
            </div>
            <h4 className="mb-2 text-lg font-bold text-white">
                Economia do mês
            </h4>
            {hasPreviousData ? (
                <>
                    <p
                        className={`mb-2 text-3xl font-bold ${
                            isPositive ? 'text-success' : 'text-danger'
                        }`}
                    >
                        {isPositive ? '+' : '-'}
                        {Math.abs(percentage).toFixed(0)}%
                    </p>
                    <p className="text-center text-xs text-text-subtle">
                        {isPositive
                            ? `Você economizou ${amount} a mais que no mês passado.`
                            : `Você gastou ${amount} a mais que no mês passado.`}
                    </p>
                </>
            ) : (
                <p className="text-center text-xs text-text-subtle">
                    Sem dados do mês anterior
                </p>
            )}
        </div>
    )
}
