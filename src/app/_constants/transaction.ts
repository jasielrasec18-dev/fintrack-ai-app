import {
    TransactionType,
    TransactionCategory,
    TransactionPaymentMethod,
} from '@prisma/client'

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
    [TransactionType.DEPOSIT]: 'Depósito',
    [TransactionType.EXPENSE]: 'Despesa',
    [TransactionType.INVESTMENT]: 'Investimento',
}

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> =
    {
        EDUCATION: 'Educação',
        ENTERTAINMENT: 'Entretenimento',
        FOOD: 'Alimentação',
        HEALTH: 'Saúde',
        HOUSING: 'Moradia',
        OTHER: 'Outros',
        SALARY: 'Salário',
        TRANSPORTATION: 'Transporte',
        UTILITY: 'Utilidades',
    }

export const TRANSACTION_PAYMENT_METHOD_LABELS: Record<
    TransactionPaymentMethod,
    string
> = {
    BANK_TRANSFER: 'Transferência bancária',
    BANK_SLIP: 'Boleto bancário',
    CASH: 'Dinheiro',
    CREDIT_CARD: 'Cartão de crédito',
    DEBIT_CARD: 'Cartão de débito',
    PIX: 'Pix',
    OTHER: 'Outros',
}

export const TRANSACTION_TYPE_OPTIONS = [
    {
        value: TransactionType.EXPENSE,
        label: TRANSACTION_TYPE_LABELS[TransactionType.EXPENSE],
    },
    {
        value: TransactionType.DEPOSIT,
        label: TRANSACTION_TYPE_LABELS[TransactionType.DEPOSIT],
    },
    {
        value: TransactionType.INVESTMENT,
        label: TRANSACTION_TYPE_LABELS[TransactionType.INVESTMENT],
    },
]

export const TRANSACTION_CATEGORY_OPTIONS = [
    {
        value: TransactionCategory.HOUSING,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.HOUSING],
    },
    {
        value: TransactionCategory.TRANSPORTATION,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.TRANSPORTATION],
    },
    {
        value: TransactionCategory.FOOD,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.FOOD],
    },
    {
        value: TransactionCategory.ENTERTAINMENT,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.ENTERTAINMENT],
    },
    {
        value: TransactionCategory.HEALTH,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.HEALTH],
    },
    {
        value: TransactionCategory.UTILITY,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.UTILITY],
    },
    {
        value: TransactionCategory.SALARY,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.SALARY],
    },
    {
        value: TransactionCategory.EDUCATION,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.EDUCATION],
    },
    {
        value: TransactionCategory.OTHER,
        label: TRANSACTION_CATEGORY_LABELS[TransactionCategory.OTHER],
    },
]

export const TRANSACTION_PAYMENT_METHOD_OPTIONS = [
    {
        value: TransactionPaymentMethod.BANK_TRANSFER,
        label: TRANSACTION_PAYMENT_METHOD_LABELS[
            TransactionPaymentMethod.BANK_TRANSFER
        ],
    },
    {
        value: TransactionPaymentMethod.BANK_SLIP,
        label: TRANSACTION_PAYMENT_METHOD_LABELS[
            TransactionPaymentMethod.BANK_SLIP
        ],
    },
    {
        value: TransactionPaymentMethod.CASH,
        label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.CASH],
    },
    {
        value: TransactionPaymentMethod.CREDIT_CARD,
        label: TRANSACTION_PAYMENT_METHOD_LABELS[
            TransactionPaymentMethod.CREDIT_CARD
        ],
    },
    {
        value: TransactionPaymentMethod.DEBIT_CARD,
        label: TRANSACTION_PAYMENT_METHOD_LABELS[
            TransactionPaymentMethod.DEBIT_CARD
        ],
    },
    {
        value: TransactionPaymentMethod.PIX,
        label: TRANSACTION_PAYMENT_METHOD_LABELS[TransactionPaymentMethod.PIX],
    },
    {
        value: TransactionPaymentMethod.OTHER,
        label: TRANSACTION_PAYMENT_METHOD_LABELS[
            TransactionPaymentMethod.OTHER
        ],
    },
]