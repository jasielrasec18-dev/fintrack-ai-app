import { describe, expect, it } from 'vitest'
import {
    calcBalance,
    calcBudgetProgress,
    calcCategoryPercentages,
    calcPercentChange,
    getBudgetStatus,
    getExpensesByCategory,
    getLastMonths,
    getMonthRange,
    getPreviousMonth,
    sumByType,
    toMonthKey,
    type TransactionTotal,
} from '../finance'

describe('getPreviousMonth', () => {
    it('volta para dezembro do ano anterior em janeiro', () => {
        expect(getPreviousMonth(2027, '01')).toEqual({
            year: 2026,
            month: '12',
        })
    })

    it('volta um mês dentro do ano', () => {
        expect(getPreviousMonth(2026, '11')).toEqual({
            year: 2026,
            month: '10',
        })
    })
})

describe('getMonthRange', () => {
    it('termina em janeiro do ano seguinte quando o mês é dezembro', () => {
        const { start, end } = getMonthRange(2026, '12')

        expect(start.toISOString()).toBe('2026-12-01T00:00:00.000Z')
        expect(end.toISOString()).toBe('2027-01-01T00:00:00.000Z')
    })
})

describe('getLastMonths', () => {
    it('lista os meses em ordem e atravessa a virada do ano', () => {
        expect(getLastMonths(2027, '02', 3)).toEqual([
            { year: 2026, month: '12' },
            { year: 2027, month: '01' },
            { year: 2027, month: '02' },
        ])
    })
})

describe('toMonthKey', () => {
    it('usa o mês em UTC', () => {
        expect(toMonthKey(new Date('2026-11-01T00:00:00.000Z'))).toBe('2026-11')
    })
})

describe('calcBalance', () => {
    it('desconta gastos e investimentos das entradas', () => {
        expect(calcBalance(5000, 1800, 500)).toBe(2700)
    })
})

describe('calcPercentChange', () => {
    it('retorna 0 sem valor no mês anterior', () => {
        expect(calcPercentChange(500, 0)).toBe(0)
    })

    it('calcula a variação a partir de um valor positivo', () => {
        expect(calcPercentChange(150, 100)).toBe(50)
        expect(calcPercentChange(50, 100)).toBe(-50)
    })

    it('mantém o sinal correto a partir de um valor negativo', () => {
        expect(calcPercentChange(-50, -100)).toBe(50)
        expect(calcPercentChange(-150, -100)).toBe(-50)
    })
})

describe('calcCategoryPercentages', () => {
    it('gera porcentagens que somam cerca de 100', () => {
        const result = calcCategoryPercentages([
            { category: 'FOOD', totalAmount: 333 },
            { category: 'HOUSING', totalAmount: 333 },
            { category: 'HEALTH', totalAmount: 334 },
        ])
        const sum = result.reduce((acc, item) => acc + item.percentageOfTotal, 0)

        expect(Math.abs(sum - 100)).toBeLessThanOrEqual(1)
    })

    it('não gera NaN quando não há despesas', () => {
        expect(
            calcCategoryPercentages([{ category: 'FOOD', totalAmount: 0 }])
        ).toEqual([{ category: 'FOOD', totalAmount: 0, percentageOfTotal: 0 }])
        expect(calcCategoryPercentages([])).toEqual([])
    })
})

describe('agregações', () => {
    const totals: TransactionTotal[] = [
        { monthKey: '2026-11', type: 'EXPENSE', category: 'FOOD', amount: 100 },
        { monthKey: '2026-11', type: 'EXPENSE', category: 'FOOD', amount: 50 },
        { monthKey: '2026-11', type: 'DEPOSIT', category: 'SALARY', amount: 900 },
        { monthKey: '2026-10', type: 'EXPENSE', category: 'FOOD', amount: 999 },
    ]

    it('soma por tipo apenas no mês informado', () => {
        expect(sumByType(totals, '2026-11', 'EXPENSE')).toBe(150)
    })

    it('agrupa as despesas por categoria apenas no mês informado', () => {
        expect(getExpensesByCategory(totals, '2026-11')).toEqual([
            { category: 'FOOD', totalAmount: 150 },
        ])
    })
})

describe('orçamentos', () => {
    it('classifica o status pelos limites de 80% e 100%', () => {
        expect(getBudgetStatus(79)).toBe('ok')
        expect(getBudgetStatus(80)).toBe('warning')
        expect(getBudgetStatus(100)).toBe('warning')
        expect(getBudgetStatus(101)).toBe('over')
    })

    it('calcula o progresso e considera 0 sem gastos na categoria', () => {
        const result = calcBudgetProgress(
            [
                { category: 'FOOD', amount: 700 },
                { category: 'HEALTH', amount: 100 },
            ],
            [{ category: 'FOOD', totalAmount: 820 }]
        )

        expect(result).toEqual([
            {
                category: 'FOOD',
                limit: 700,
                spent: 820,
                percentage: 117,
                status: 'over',
            },
            {
                category: 'HEALTH',
                limit: 100,
                spent: 0,
                percentage: 0,
                status: 'ok',
            },
        ])
    })
})
