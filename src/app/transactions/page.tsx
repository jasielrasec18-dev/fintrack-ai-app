import { Sidebar } from '@/src/app/_components/sidebar'
import { Header } from '@/src/app/_components/header'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/src/app/_components/ui/table'
import { auth } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { TransactionType } from '@prisma/client'
import {
    TRANSACTION_TYPE_LABELS,
    TRANSACTION_CATEGORY_LABELS,
    TRANSACTION_PAYMENT_METHOD_LABELS,
} from '../_constants/transaction'

import dayjs from '@/src/lib/dayjs'
import { formatBRL } from '@/src/lib/format'
import { AddTransactionButton } from '@/src/app/_components/add-transaction-button'
import { DeleteTransactionButton } from '@/src/app/_components/delete-transaction-button'

const TYPE_BADGE_STYLES: Record<TransactionType, string> = {
    DEPOSIT: 'bg-[#00BC7D]/20 text-success-text',
    EXPENSE: 'bg-[#FB2C36]/20 text-danger-text',
    INVESTMENT: 'bg-[#2B7FFF]/20 text-info-text',
}

export default async function TransactionsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id

    if (!userId) {
        redirect('/sign-in')
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: 'desc',
        },
    })

    return (
        <div className="flex min-h-screen bg-app">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    userName={session.user.name}
                    userEmail={session.user.email}
                    date={new Date()}
                />

                <main className="p-4 md:p-8">
                    <section className="space-y-1">
                        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-white">
                            Transações
                        </h1>
                        <p className="text-sm text-[#90A1B9]">
                            Gerencie suas entradas, despesas e investimentos
                        </p>
                    </section>

                    <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(30,41,59,0.8)] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.2),0px_20px_25px_-5px_rgba(0,0,0,0.2)]">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-white/5">
                                    <TableRow className="border-b border-white/10 hover:bg-transparent">
                                        <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                            Nome
                                        </TableHead>
                                        <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                            Categoria
                                        </TableHead>
                                        <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                            Método
                                        </TableHead>
                                        <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                            Tipo
                                        </TableHead>
                                        <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                            Data
                                        </TableHead>
                                        <TableHead className="h-auto px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                            Valor
                                        </TableHead>
                                        <TableHead className="h-auto px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                            Ações
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {transactions.length === 0 && (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell
                                                colSpan={7}
                                                className="px-4 py-10 text-center text-sm text-text-muted"
                                            >
                                                Nenhuma transação cadastrada.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {transactions.map((transaction) => (
                                        <TableRow
                                            key={transaction.id}
                                            className="border-b border-white/5 hover:bg-transparent"
                                        >
                                            <TableCell className="px-4 py-5 text-sm font-medium text-white">
                                                {transaction.name}
                                            </TableCell>
                                            <TableCell className="px-4 py-5 text-sm text-[#CAD5E2]">
                                                {
                                                    TRANSACTION_CATEGORY_LABELS[
                                                        transaction.category
                                                    ]
                                                }
                                            </TableCell>
                                            <TableCell className="px-4 py-5 text-sm text-[#90A1B9]">
                                                {
                                                    TRANSACTION_PAYMENT_METHOD_LABELS[
                                                        transaction
                                                            .paymentMethod
                                                    ]
                                                }
                                            </TableCell>
                                            <TableCell className="px-4 py-5">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_BADGE_STYLES[transaction.type]}`}
                                                >
                                                    {
                                                        TRANSACTION_TYPE_LABELS[
                                                            transaction.type
                                                        ]
                                                    }
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-5 text-sm text-[#90A1B9]">
                                                {dayjs
                                                    .utc(transaction.date)
                                                    .format('DD/MM/YYYY')}
                                            </TableCell>
                                            <TableCell
                                                className={`px-4 py-5 text-right text-sm font-semibold ${
                                                    transaction.type ===
                                                    'EXPENSE'
                                                        ? 'text-danger-text'
                                                        : 'text-success-text'
                                                }`}
                                            >
                                                {formatBRL(
                                                    Number(transaction.amount)
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-5">
                                                <div className="flex items-center justify-end gap-3">
                                                    <AddTransactionButton
                                                        key={transaction.updatedAt.toISOString()}
                                                        variant="edit"
                                                        transaction={{
                                                            id: transaction.id,
                                                            name: transaction.name,
                                                            amount: Number(
                                                                transaction.amount
                                                            ),
                                                            type: transaction.type,
                                                            category:
                                                                transaction.category,
                                                            paymentMethod:
                                                                transaction.paymentMethod,
                                                            date: dayjs
                                                                .utc(
                                                                    transaction.date
                                                                )
                                                                .format(
                                                                    'YYYY-MM-DD'
                                                                ),
                                                        }}
                                                    />
                                                    <DeleteTransactionButton
                                                        id={transaction.id}
                                                        name={transaction.name}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
