import { describe, expect, it } from 'vitest'
import { matchCategory } from '@/src/app/_constants/category-keywords'

describe('matchCategory', () => {
    it.each([
        ['Uber para o trabalho', 'TRANSPORTATION'],
        ['Corrida 99', 'TRANSPORTATION'],
        ['iFood jantar', 'FOOD'],
        ['Supermercado Extra', 'FOOD'],
        ['Netflix', 'ENTERTAINMENT'],
        ['Aluguel de novembro', 'HOUSING'],
        ['Farmácia São João', 'HEALTH'],
        ['Conta de luz', 'UTILITY'],
        ['Curso de inglês', 'EDUCATION'],
    ])('classifica "%s" como %s', (name, category) => {
        expect(matchCategory(name)?.category).toBe(category)
    })

    it('ignora acentos e maiúsculas', () => {
        expect(matchCategory('CONDOMÍNIO')?.category).toBe('HOUSING')
        expect(matchCategory('condominio')?.category).toBe('HOUSING')
    })

    it('marca salário como entrada', () => {
        expect(matchCategory('Salário da empresa')).toEqual({
            category: 'SALARY',
            type: 'DEPOSIT',
        })
    })

    it('não confunde parte de uma palavra com a palavra-chave', () => {
        expect(matchCategory('Luzes de natal')).toBeNull()
        expect(matchCategory('Pagamento 1990')).toBeNull()
    })

    it('retorna null quando não reconhece o título', () => {
        expect(matchCategory('Presente da Ana')).toBeNull()
    })
})
