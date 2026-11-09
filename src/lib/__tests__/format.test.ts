import { describe, expect, it } from 'vitest'
import { formatBRL, parseCurrencyInput } from '../format'

// O Intl separa "R$" do valor com um espaço não separável.
const NBSP = ' '

describe('formatBRL', () => {
    it('formata valores positivos em reais', () => {
        expect(formatBRL(1234.5)).toBe(`R$${NBSP}1.234,50`)
    })

    it('formata valores negativos', () => {
        expect(formatBRL(-42)).toBe(`-R$${NBSP}42,00`)
    })
})

describe('parseCurrencyInput', () => {
    it('lê os dígitos como centavos', () => {
        expect(parseCurrencyInput('1234')).toBe(12.34)
    })

    it('ignora o que não é dígito', () => {
        expect(parseCurrencyInput(`R$${NBSP}12,345`)).toBe(123.45)
    })

    it('retorna undefined sem dígitos', () => {
        expect(parseCurrencyInput('R$')).toBeUndefined()
    })
})
