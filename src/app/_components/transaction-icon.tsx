import type { TransactionCategory } from '@prisma/client'
import { CATEGORY_ICON } from '../_constants/transaction'

interface TransactionIconProps {
    category: TransactionCategory
}

export function TransactionIcon({ category }: TransactionIconProps) {
    const { emoji, bg } = CATEGORY_ICON[category]

    return (
        <div
            className={`${bg} flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl`}
            aria-hidden
        >
            {emoji}
        </div>
    )
}
