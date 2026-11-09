import dayjs from '@/src/lib/dayjs'
import { formatBRL } from '@/src/lib/format'
import { TransactionIcon } from '@/src/app/_components/transaction-icon'
import Link from 'next/link'
import type { TransactionType } from '@prisma/client'
import { TransactionFormDialog } from './transaction-form-dialog'
import { getRecentTransactions } from '../_data/get-recent-transactions'
import { TRANSACTION_CATEGORY_LABELS } from '../_constants/transaction'

const AMOUNT_STYLES: Record<
    TransactionType,
    { color: string; prefix: string }
> = {
    DEPOSIT: { color: 'text-success', prefix: '+' },
    EXPENSE: { color: 'text-danger', prefix: '-' },
    INVESTMENT: { color: 'text-info', prefix: '' },
}

export const RecentTransactions = async () => {
    const recentTransactions = await getRecentTransactions()

    return (
        <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xl font-bold text-white">
                    Transações recentes
                </p>
                <TransactionFormDialog />
            </div>

            <div className="overflow-hidden rounded-3xl border border-card-border bg-card">
                {recentTransactions.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-text-muted">
                        Nenhuma transação ainda. Clique em Adicionar para
                        começar.
                    </p>
                ) : (
                    <div>
                        {recentTransactions.map((transaction) => {
                            const { color, prefix } =
                                AMOUNT_STYLES[transaction.type]

                            return (
                                <div
                                    key={transaction.id}
                                    className="flex items-center gap-4 border-b border-card-border px-5 py-5 transition-colors last:border-none hover:bg-slate-800/50"
                                >
                                    <TransactionIcon
                                        category={transaction.category}
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-white">
                                            {transaction.name}
                                        </p>
                                        <p className="text-xs text-text-subtle">
                                            {dayjs
                                                .utc(transaction.date)
                                                .format('DD [de] MMMM')}{' '}
                                            •{' '}
                                            {
                                                TRANSACTION_CATEGORY_LABELS[
                                                    transaction.category
                                                ]
                                            }
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 text-lg font-bold whitespace-nowrap ${color}`}
                                    >
                                        {prefix}
                                        {formatBRL(Number(transaction.amount))}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
                <div className="border-t border-card-border py-4 text-center">
                    <Link
                        className="text-sm font-semibold text-[#A855F7] hover:underline"
                        href="/transactions"
                    >
                        Ver todo o histórico
                    </Link>
                </div>
            </div>
        </div>
    )
}
