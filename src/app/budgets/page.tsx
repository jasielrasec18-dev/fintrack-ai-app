import { TransactionCategory } from '@prisma/client'
import { AppShell } from '@/src/app/_components/app-shell'
import { BudgetForm } from '@/src/app/_components/budget-form'
import { getBudgets } from '@/src/app/_data/get-budgets'
import { requireSession } from '@/src/lib/session'

// Salário é entrada de dinheiro, então não faz sentido limitar.
const BUDGET_CATEGORIES = Object.values(TransactionCategory).filter(
    (category) => category !== TransactionCategory.SALARY
)

export default async function BudgetsPage() {
    const session = await requireSession()
    const budgets = await getBudgets(session.user.id)

    return (
        <AppShell user={session.user}>
            <div className="mx-auto w-full max-w-[1120px]">
                <section className="mb-6 space-y-1">
                    <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025em] text-white">
                        Orçamentos
                    </h1>
                    <p className="text-sm text-[#90A1B9]">
                        Defina um limite mensal para cada categoria de gasto
                    </p>
                </section>

                <BudgetForm
                    categories={BUDGET_CATEGORIES}
                    initial={Object.fromEntries(
                        budgets.map(({ category, amount }) => [category, amount])
                    )}
                />
            </div>
        </AppShell>
    )
}
