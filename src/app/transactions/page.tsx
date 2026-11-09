import Image from 'next/image'

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

import EditIcon from '@/src/assets/edit-icon.png'
import DeleteIcon from '@/src/assets/delete-icon.png'

const TYPE_BADGE_STYLES: Record<TransactionType, string> = {
    DEPOSIT: 'bg-[#00BC7D]/20 text-success-text',
    EXPENSE: 'bg-[#FB2C36]/20 text-danger-text',
    INVESTMENT: 'bg-[#2B7FFF]/20 text-info-text',
}

const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })

const formatDate = (date: Date) =>
    date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })

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
                <Header userName={session.user.name} date={new Date()} />

                <main className="p-4 md:p-8">
                    <section className="space-y-1">
                        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-white">
                            Transacoes
                        </h1>
                        <p className="text-sm text-[#90A1B9]">
                            Gerencie suas entradas, despesas e investimentos
                        </p>
                    </section>

                    <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(30,41,59,0.8)] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.2),0px_20px_25px_-5px_rgba(0,0,0,0.2)]">
                        <Table>
                            <TableHeader className="bg-white/6">
                                <TableRow className="border-b border-white/10 hover:bg-transparent">
                                    <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-[#CAD5E2]">
                                        Nome
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                        Categoria
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted">
                                        Metodo
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
                                        Acoes
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
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
                                                    transaction.paymentMethod
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
                                            {formatDate(transaction.date)}
                                        </TableCell>
                                        <TableCell
                                            className={`px-4 py-5 text-right text-sm font-semibold ${
                                                transaction.type === 'EXPENSE'
                                                    ? 'text-danger-text'
                                                    : 'text-success-text'
                                            }`}
                                        >
                                            {formatCurrency(
                                                Number(transaction.amount)
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-5">
                                            <div className="flex justify-end gap-4">
                                                <Image
                                                    src={EditIcon}
                                                    alt="Editar transação"
                                                    className='cursor-pointer'
                                                />
                                                <Image
                                                    src={DeleteIcon}
                                                    alt="Deletar transação"
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>
                </main>
            </div>
        </div>
    )
}