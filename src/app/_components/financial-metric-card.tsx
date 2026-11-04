import Image from 'next/image'
import PigIcon from '@/src/assets/pig-icon.png'

interface FinancialMetricCard {
    percentage: number
    difference: number
}

export const FinancialMetricCard = ({
    difference,
    percentage,
}: FinancialMetricCard) => {
    const isPositive = difference >= 0

    return (
        <div className="flex flex-col items-center justify-center bg-[#161B26] rounded-2xl py-6 px-4">
            <div className="mb-4 py-5 px-4 bg-[#10B981]/20 rounded-full">
                <Image src={PigIcon} alt="Pig Icon" />
            </div>
            <h4 className="text-lg font-bold mb-2">Economia do mês</h4>
            <p
                className={`text-3xl font-bold mb-2
                ${isPositive ? 'text-[#10B981]' : 'text-red-500'}
                `}
            >
                {isPositive ? '+' : '-'}
                {Math.abs(percentage).toFixed(0)}%
            </p>
            <p className="text-center text-xs text-[#64748B]">
                {isPositive
                    ? `Você economizou ${Math.abs(difference).toLocaleString(
                          'pt-BR',
                          {
                              style: 'currency',
                              currency: 'BRL',
                          }
                      )} a mais que no mês passado.`
                    : `Você economizou ${Math.abs(difference).toLocaleString(
                          'pt-BR',
                          {
                              style: 'currency',
                              currency: 'BRL',
                          }
                      )} a menos que no mês passado.`}
            </p>
        </div>
    )
}