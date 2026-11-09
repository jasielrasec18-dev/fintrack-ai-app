import Link from 'next/link'
import type { TransactionCategory } from '@prisma/client'
import { formatBRL } from '@/src/lib/format'
import type { BudgetStatus } from '@/src/lib/finance'
import { TRANSACTION_CATEGORY_LABELS } from '../_constants/transaction'

interface BudgetsCardProps {
    budgets: {
        category: TransactionCategory
        limit: number
        spent: number
        percentage: number
        status: BudgetStatus
    }[]
}

const STATUS_STYLES: Record<BudgetStatus, { bar: string; text: string }> = {
    ok: { bar: 'bg-success', text: 'text-success-text' },
    warning: { bar: 'bg-[#EAB308]', text: 'text-[#FACC15]' },
    over: { bar: 'bg-danger', text: 'text-danger-text' },
}

export const BudgetsCard = ({ budgets }: BudgetsCardProps) => {
    return (
        <div className="rounded-3xl border border-card-border bg-card p-8">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold text-white">Orçamentos</h3>
                <Link
                    href="/budgets"
                    className="inline-block py-2 text-sm font-semibold text-[#A855F7] hover:underline"
                >
                    Gerenciar
                </Link>
            </div>

            {budgets.length === 0 ? (
                <p className="mt-6 text-sm text-text-muted">
                    Defina limites mensais por categoria para acompanhar seus
                    gastos aqui.
                </p>
            ) : (
                <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
                    {budgets.map((budget) => {
                        const styles = STATUS_STYLES[budget.status]

                        return (
                            <li key={budget.category}>
                                <div className="flex items-baseline justify-between gap-3">
                                    <span className="truncate text-sm font-semibold text-white">
                                        {
                                            TRANSACTION_CATEGORY_LABELS[
                                                budget.category
                                            ]
                                        }
                                    </span>
                                    <span className="shrink-0 text-xs text-text-muted">
                                        {formatBRL(budget.spent)} de{' '}
                                        {formatBRL(budget.limit)} ·{' '}
                                        <span className={styles.text}>
                                            {budget.percentage}%
                                        </span>
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1E293B]">
                                    <div
                                        className={`h-full rounded-full ${styles.bar}`}
                                        style={{
                                            width: `${Math.min(budget.percentage, 100)}%`,
                                        }}
                                    />
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
