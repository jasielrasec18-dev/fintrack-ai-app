import type { TransactionCategory } from '@prisma/client'
import { formatBRL } from '@/src/lib/format'
import {
    CATEGORY_ICON,
    TRANSACTION_CATEGORY_LABELS,
} from '../_constants/transaction'

interface CategoryExpensesProps {
    items: {
        category: TransactionCategory
        totalAmount: number
        percentageOfTotal: number
    }[]
}

export const CategoryExpenses = ({ items }: CategoryExpensesProps) => {
    const sorted = items.toSorted((a, b) => b.totalAmount - a.totalAmount)

    return (
        <div className="h-full rounded-3xl border border-card-border bg-card p-8">
            <h3 className="text-xl font-bold text-white">
                Gastos por categoria
            </h3>

            {sorted.length === 0 ? (
                <div className="mt-6 flex h-64 items-center justify-center text-sm text-text-muted">
                    Nenhum gasto neste mês
                </div>
            ) : (
                <ul className="mt-6 space-y-4">
                    {sorted.map((item) => {
                        const { emoji, bg } = CATEGORY_ICON[item.category]

                        return (
                            <li
                                key={item.category}
                                className="flex items-center gap-3"
                            >
                                <span
                                    className={`${bg} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg`}
                                    aria-hidden
                                >
                                    {emoji}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <span className="truncate text-sm font-semibold text-white">
                                            {
                                                TRANSACTION_CATEGORY_LABELS[
                                                    item.category
                                                ]
                                            }
                                        </span>
                                        <span className="shrink-0 text-xs text-text-muted">
                                            {formatBRL(item.totalAmount)} ·{' '}
                                            {item.percentageOfTotal}%
                                        </span>
                                    </div>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1E293B]">
                                        <div
                                            className="h-full rounded-full bg-primary"
                                            style={{
                                                width: `${item.percentageOfTotal}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
