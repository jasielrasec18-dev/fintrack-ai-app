import {
    TransactionCategory as Category,
    TransactionPaymentMethod as Method,
    TransactionType as Type,
} from '@prisma/client'
import { auth } from './auth'
import dayjs from './dayjs'
import { DEMO_EMAIL, DEMO_PASSWORD } from './demo-config'
import { prisma } from './prisma'

interface DemoEntry {
    name: string
    type: Type
    category: Category
    paymentMethod: Method
    amount: number
    day: number
    /** Meses (0 = atual) em que o lançamento aparece. Sem valor, aparece em todos. */
    onlyIn?: number[]
    /** Lançamentos fixos não variam de valor entre os meses. */
    fixed?: boolean
}

const ENTRIES: DemoEntry[] = [
    { name: 'Salário', type: Type.DEPOSIT, category: Category.SALARY, paymentMethod: Method.BANK_TRANSFER, amount: 6200, day: 5, fixed: true },
    { name: 'Freela de design', type: Type.DEPOSIT, category: Category.OTHER, paymentMethod: Method.PIX, amount: 950, day: 18, onlyIn: [1] },
    { name: 'Aluguel', type: Type.EXPENSE, category: Category.HOUSING, paymentMethod: Method.PIX, amount: 1850, day: 6, fixed: true },
    { name: 'Condomínio', type: Type.EXPENSE, category: Category.HOUSING, paymentMethod: Method.BANK_SLIP, amount: 480, day: 8, fixed: true },
    { name: 'Mercado', type: Type.EXPENSE, category: Category.FOOD, paymentMethod: Method.CREDIT_CARD, amount: 612.4, day: 7 },
    { name: 'iFood', type: Type.EXPENSE, category: Category.FOOD, paymentMethod: Method.CREDIT_CARD, amount: 148.9, day: 9 },
    { name: 'Uber', type: Type.EXPENSE, category: Category.TRANSPORTATION, paymentMethod: Method.CREDIT_CARD, amount: 86.5, day: 4 },
    { name: 'Combustível', type: Type.EXPENSE, category: Category.TRANSPORTATION, paymentMethod: Method.DEBIT_CARD, amount: 240, day: 14 },
    { name: 'Netflix', type: Type.EXPENSE, category: Category.ENTERTAINMENT, paymentMethod: Method.CREDIT_CARD, amount: 44.9, day: 3, fixed: true },
    { name: 'Spotify', type: Type.EXPENSE, category: Category.ENTERTAINMENT, paymentMethod: Method.CREDIT_CARD, amount: 23.9, day: 3, fixed: true },
    { name: 'Farmácia', type: Type.EXPENSE, category: Category.HEALTH, paymentMethod: Method.DEBIT_CARD, amount: 92.3, day: 11 },
    { name: 'Conta de luz', type: Type.EXPENSE, category: Category.UTILITY, paymentMethod: Method.BANK_SLIP, amount: 178.6, day: 10 },
    { name: 'Internet', type: Type.EXPENSE, category: Category.UTILITY, paymentMethod: Method.BANK_SLIP, amount: 109.9, day: 10, fixed: true },
    { name: 'Curso de inglês', type: Type.EXPENSE, category: Category.EDUCATION, paymentMethod: Method.CREDIT_CARD, amount: 189, day: 2, fixed: true },
    { name: 'Aporte mensal', type: Type.INVESTMENT, category: Category.OTHER, paymentMethod: Method.BANK_TRANSFER, amount: 700, day: 6, fixed: true },
]

/** Variação dos gastos não fixos em cada mês (0 = atual). */
const MONTH_VARIATION = [1, 0.93, 1.08]

function buildTransactions(userId: string) {
    const today = dayjs.utc()

    return MONTH_VARIATION.flatMap((variation, monthsAgo) => {
        const month = today.startOf('month').subtract(monthsAgo, 'month')

        return ENTRIES.filter(
            (entry) => !entry.onlyIn || entry.onlyIn.includes(monthsAgo)
        ).map(({ onlyIn: _onlyIn, fixed, day, amount, ...entry }) => ({
            ...entry,
            userId,
            amount: fixed ? amount : Math.round(amount * variation * 100) / 100,
            // No mês atual, nenhum lançamento fica no futuro.
            date: month
                .date(monthsAgo === 0 ? Math.min(day, today.date()) : day)
                .toDate(),
        }))
    })
}

async function getDemoUserId(email: string, password: string) {
    const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    })
    if (existing) return existing.id

    // A API do Better Auth gera o hash da senha no formato correto.
    const { user } = await auth.api.signUpEmail({
        body: { name: 'Visitante', email, password },
    })
    return user.id
}

export async function resetDemo() {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) {
        throw new Error(
            'Defina NEXT_PUBLIC_DEMO_EMAIL e NEXT_PUBLIC_DEMO_PASSWORD.'
        )
    }

    const userId = await getDemoUserId(DEMO_EMAIL, DEMO_PASSWORD)
    const transactions = buildTransactions(userId)

    await prisma.$transaction([
        prisma.transaction.deleteMany({ where: { userId } }),
        prisma.transaction.createMany({ data: transactions }),
    ])

    return { transactions: transactions.length }
}
