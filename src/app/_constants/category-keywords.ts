import type { TransactionCategory, TransactionType } from '@prisma/client'

export interface CategorySuggestion {
    category: TransactionCategory
    type: TransactionType | null
}

// Palavras em minúsculas e sem acento, como o texto fica depois de normalizado.
const RULES: Array<CategorySuggestion & { keywords: string[] }> = [
    {
        category: 'SALARY',
        type: 'DEPOSIT',
        keywords: ['salario', 'holerite', 'pagamento mensal', '13o salario'],
    },
    {
        category: 'TRANSPORTATION',
        type: null,
        keywords: [
            'uber',
            '99',
            '99pop',
            'cabify',
            'taxi',
            'onibus',
            'metro',
            'combustivel',
            'gasolina',
            'etanol',
            'estacionamento',
            'pedagio',
        ],
    },
    {
        category: 'FOOD',
        type: null,
        keywords: [
            'ifood',
            'rappi',
            'mercado',
            'supermercado',
            'padaria',
            'restaurante',
            'lanche',
            'almoco',
            'jantar',
            'pizza',
            'hamburguer',
            'acougue',
            'feira',
        ],
    },
    {
        category: 'ENTERTAINMENT',
        type: null,
        keywords: [
            'netflix',
            'spotify',
            'disney',
            'hbo',
            'prime video',
            'youtube premium',
            'cinema',
            'show',
            'teatro',
            'steam',
            'playstation',
            'xbox',
        ],
    },
    {
        category: 'HOUSING',
        type: null,
        keywords: ['aluguel', 'condominio', 'iptu', 'financiamento imobiliario'],
    },
    {
        category: 'HEALTH',
        type: null,
        keywords: [
            'farmacia',
            'drogaria',
            'remedio',
            'medico',
            'consulta',
            'dentista',
            'exame',
            'plano de saude',
            'academia',
        ],
    },
    {
        category: 'UTILITY',
        type: null,
        keywords: [
            'luz',
            'energia',
            'agua',
            'gas',
            'internet',
            'telefone',
            'celular',
        ],
    },
    {
        category: 'EDUCATION',
        type: null,
        keywords: [
            'curso',
            'faculdade',
            'escola',
            'mensalidade escolar',
            'livro',
            'udemy',
            'alura',
        ],
    },
]

function normalize(text: string) {
    return text
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
}

const hasKeyword = (text: string, keyword: string) =>
    new RegExp(`(^|[^a-z0-9])${keyword}($|[^a-z0-9])`).test(text)

export function matchCategory(name: string): CategorySuggestion | null {
    const text = normalize(name)
    const rule = RULES.find(({ keywords }) =>
        keywords.some((keyword) => hasKeyword(text, keyword))
    )

    return rule ? { category: rule.category, type: rule.type } : null
}
