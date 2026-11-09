import Image, { type StaticImageData } from 'next/image'

import Food from '@/src/assets/food-icon.png'
import Box from '@/src/assets/box-icon.png'
import Tv from '@/src/assets/tv-icon.png'

interface TransactionIconProps {
    type: 'DEPOSIT' | 'EXPENSE' | 'INVESTMENT'
}

const ICON_CONFIG: Record<
    'DEPOSIT' | 'EXPENSE' | 'INVESTMENT',
    {
        icon: StaticImageData
        bg: string
        color: string
    }
> = {
    DEPOSIT: {
        icon: Box,
        bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        color: 'text-emerald-600 dark:text-emerald-400',
    },
    EXPENSE: {
        icon: Food,
        bg: 'bg-rose-100 dark:bg-rose-500/20',
        color: 'text-rose-600 dark:text-rose-400',
    },
    INVESTMENT: {
        icon: Tv,
        bg: 'bg-blue-100 dark:bg-blue-500/20',
        color: 'text-blue-600 dark:text-blue-400',
    },
}

export function TransactionIcon({ type }: TransactionIconProps) {
    const config = ICON_CONFIG[type]

    return (
        <div className={`${config.bg} ${config.color} p-3 rounded-xl h-fit`}>
            <Image src={config.icon} alt="" width={20} height={20} />
        </div>
    )
}