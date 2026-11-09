import Link from 'next/link'
import {
    type Prisma,
    type Transaction,
    TransactionCategory,
    TransactionType,
} from '@prisma/client'
import { z } from 'zod'
import { AppShell } from '@/src/app/_components/app-shell'
import { TransactionActions } from '@/src/app/_components/transaction-actions'
import { TransactionFilters } from '@/src/app/_components/transaction-filters'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/src/app/_components/ui/table'
import dayjs from '@/src/lib/dayjs'
import { formatBRL } from '@/src/lib/format'
import { prisma } from '@/src/lib/prisma'
import { requireSession } from '@/src/lib/session'
import {
    TRANSACTION_CATEGORY_LABELS,
    TRANSACTION_PAYMENT_METHOD_LABELS,
    TRANSACTION_TYPE_LABELS,
} from '../_constants/transaction'

const PAGE_SIZE = 10

const TYPE_BADGE_STYLES: Record<TransactionType, string> = {
    DEPOSIT: 'bg-[#00BC7D]/20 text-success-text',
    EXPENSE: 'bg-[#FB2C36]/20 text-danger-text',
    INVESTMENT: 'bg-[#2B7FFF]/20 text-info-text',
}

const dateParam = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((value) => !Number.isNaN(Date.parse(value)))
    .optional()
    .catch(undefined)

const filtersSchema = z.object({
    q: z.string().trim().max(100).optional().catch(undefined),
    type: z.enum(TransactionType).optional().catch(undefined),
    category: z.enum(TransactionCategory).optional().catch(undefined),
    from: dateParam,
    to: dateParam,
    page: z.coerce.number().int().min(1).catch(1),
})

const headClass =
    'h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05em] text-text-muted'

interface TransactionsPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

const TypeBadge = ({ type }: { type: TransactionType }) => (
    <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_BADGE_STYLES[type]}`}
    >
        {TRANSACTION_TYPE_LABELS[type]}
    </span>
)

const Amount = ({ transaction }: { transaction: Transaction }) => (
    <span
        className={`font-semibold ${
            transaction.type === 'EXPENSE'
                ? 'text-danger-text'
                : 'text-success-text'
        }`}
    >
        {formatBRL(Number(transaction.amount))}
    </span>
)

export default async function TransactionsPage({
    searchParams,
}: TransactionsPageProps) {
    const session = await requireSession()
    const params = await searchParams
    const filters = filtersSchema.parse(params)
    const { q, type, category, from, to } = filters

    const where: Prisma.TransactionWhereInput = {
        userId: session.user.id,
        ...(q && { name: { contains: q, mode: 'insensitive' } }),
        ...(type && { type }),
        ...(category && { category }),
        ...((from || to) && {
            date: {
                ...(from && { gte: new Date(from) }),
                ...(to && { lte: new Date(to) }),
            },
        }),
    }

    const total = await prisma.transaction.count({ where })
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const page = Math.min(filters.page, totalPages)

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
    })

    const hasFilters = Boolean(q || type || category || from || to)
    const emptyMessage = hasFilters
        ? 'Nenhuma transação encontrada com esses filtros.'
        : 'Nenhuma transação cadastrada.'

    const pageHref = (target: number) => {
        const query = new URLSearchParams()
        for (const [key, value] of Object.entries(params)) {
            if (typeof value === 'string' && key !== 'page') {
                query.set(key, value)
            }
        }
        query.set('page', String(target))
        return `/transactions?${query.toString()}`
    }

    const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
    const lastItem = Math.min(page * PAGE_SIZE, total)
    const pageLinkClass =
        'rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5'
    const pageDisabledClass =
        'rounded-xl border border-white/5 px-4 py-2 text-sm font-medium text-text-subtle'

    return (
        <AppShell user={session.user}>
            <section className="space-y-1">
                <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-white">
                    Transações
                </h1>
                <p className="text-sm text-[#90A1B9]">
                    Gerencie suas entradas, despesas e investimentos
                </p>
            </section>

            <section className="mt-6">
                <TransactionFilters />
            </section>

            {/* Celular: lista de cards */}
            <section className="mt-6 space-y-3 md:hidden">
                {transactions.length === 0 && (
                    <p className="rounded-2xl border border-white/10 bg-[#1E293B]/80 px-4 py-10 text-center text-sm text-text-muted">
                        {emptyMessage}
                    </p>
                )}
                {transactions.map((transaction) => (
                    <article
                        key={transaction.id}
                        className="space-y-3 rounded-2xl border border-white/10 bg-[#1E293B]/80 p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <p className="min-w-0 font-medium text-white">
                                {transaction.name}
                            </p>
                            <p className="shrink-0 text-sm">
                                <Amount transaction={transaction} />
                            </p>
                        </div>
                        <p className="text-xs text-text-muted">
                            {dayjs.utc(transaction.date).format('DD/MM/YYYY')} •{' '}
                            {TRANSACTION_CATEGORY_LABELS[transaction.category]} •{' '}
                            {
                                TRANSACTION_PAYMENT_METHOD_LABELS[
                                    transaction.paymentMethod
                                ]
                            }
                        </p>
                        <div className="flex items-center justify-between">
                            <TypeBadge type={transaction.type} />
                            <TransactionActions transaction={transaction} />
                        </div>
                    </article>
                ))}
            </section>

            {/* A partir de md: tabela */}
            <section className="mt-6 hidden overflow-hidden rounded-3xl border border-white/10 bg-[rgba(30,41,59,0.8)] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.2),0px_20px_25px_-5px_rgba(0,0,0,0.2)] md:block">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-b border-white/10 hover:bg-transparent">
                                <TableHead className={headClass}>Nome</TableHead>
                                <TableHead className={headClass}>
                                    Categoria
                                </TableHead>
                                <TableHead className={headClass}>
                                    Método
                                </TableHead>
                                <TableHead className={headClass}>Tipo</TableHead>
                                <TableHead className={headClass}>Data</TableHead>
                                <TableHead className={`${headClass} text-right`}>
                                    Valor
                                </TableHead>
                                <TableHead className={`${headClass} text-right`}>
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
                                        {emptyMessage}
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
                                                transaction.paymentMethod
                                            ]
                                        }
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                        <TypeBadge type={transaction.type} />
                                    </TableCell>
                                    <TableCell className="px-4 py-5 text-sm text-[#90A1B9]">
                                        {dayjs
                                            .utc(transaction.date)
                                            .format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell className="px-4 py-5 text-right text-sm">
                                        <Amount transaction={transaction} />
                                    </TableCell>
                                    <TableCell className="px-4 py-5">
                                        <TransactionActions
                                            transaction={transaction}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>

            <nav
                aria-label="Paginação"
                className="mt-6 flex flex-wrap items-center justify-between gap-3"
            >
                <p className="text-sm text-text-muted">
                    Mostrando {firstItem}–{lastItem} de {total}
                </p>
                <div className="flex gap-3">
                    {page > 1 ? (
                        <Link href={pageHref(page - 1)} className={pageLinkClass}>
                            Anterior
                        </Link>
                    ) : (
                        <span className={pageDisabledClass}>Anterior</span>
                    )}
                    {page < totalPages ? (
                        <Link href={pageHref(page + 1)} className={pageLinkClass}>
                            Próxima
                        </Link>
                    ) : (
                        <span className={pageDisabledClass}>Próxima</span>
                    )}
                </div>
            </nav>
        </AppShell>
    )
}
