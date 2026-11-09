'use client'

import { useState, useTransition } from 'react'
import type { TransactionCategory } from '@prisma/client'
import { toast } from 'sonner'
import { saveBudgets } from '../_actions/save-budgets'
import {
    CATEGORY_ICON,
    TRANSACTION_CATEGORY_LABELS,
} from '../_constants/transaction'
import { Input } from './ui/input'

interface BudgetFormProps {
    categories: TransactionCategory[]
    initial: Partial<Record<TransactionCategory, number>>
}

export const BudgetForm = ({ categories, initial }: BudgetFormProps) => {
    const [values, setValues] = useState<Record<string, string>>(() =>
        Object.fromEntries(
            categories.map((category) => [
                category,
                initial[category]?.toString() ?? '',
            ])
        )
    )
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()

        const budgets = categories.map((category) => {
            const amount = Number(values[category])
            return { category, amount: amount > 0 ? amount : null }
        })

        startTransition(async () => {
            try {
                await saveBudgets(budgets)
                toast.success('Orçamentos salvos')
            } catch {
                toast.error('Não foi possível salvar. Tente novamente.')
            }
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-card-border bg-card p-6 md:p-8"
        >
            <ul className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
                {categories.map((category) => {
                    const { emoji, bg } = CATEGORY_ICON[category]
                    const label = TRANSACTION_CATEGORY_LABELS[category]

                    return (
                        <li key={category} className="flex items-center gap-3">
                            <span
                                className={`${bg} flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg`}
                                aria-hidden
                            >
                                {emoji}
                            </span>
                            <label
                                htmlFor={`budget-${category}`}
                                className="min-w-0 flex-1 truncate text-sm font-semibold text-white"
                            >
                                {label}
                            </label>
                            <Input
                                id={`budget-${category}`}
                                type="number"
                                min="0"
                                step="0.01"
                                inputMode="decimal"
                                placeholder="Sem limite"
                                value={values[category]}
                                onChange={(event) =>
                                    setValues((current) => ({
                                        ...current,
                                        [category]: event.target.value,
                                    }))
                                }
                                className="h-10 w-36 rounded-xl border border-white/10 bg-[#334155]/50 px-3.5 text-sm text-white placeholder:text-text-subtle"
                            />
                        </li>
                    )
                })}
            </ul>

            <div className="mt-8 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="h-12 cursor-pointer rounded-xl bg-primary px-6 font-bold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-[#7E22CE] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? 'Salvando...' : 'Salvar orçamentos'}
                </button>
            </div>
        </form>
    )
}
