const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
})

export function formatBRL(value: number) {
    return currencyFormatter.format(value)
}

/** Lê o texto digitado como centavos: "1234" vira 12,34. */
export function parseCurrencyInput(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 12)
    return digits ? Number(digits) / 100 : undefined
}
