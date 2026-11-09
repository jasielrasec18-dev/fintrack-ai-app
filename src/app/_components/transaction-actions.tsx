import type { Transaction } from '@prisma/client'
import dayjs from '@/src/lib/dayjs'
import { DeleteTransactionButton } from './delete-transaction-button'
import { TransactionFormDialog } from './transaction-form-dialog'

export const TransactionActions = ({
    transaction,
}: {
    transaction: Transaction
}) => {
    return (
        <div className="flex items-center justify-end gap-1 md:gap-3">
            <TransactionFormDialog
                key={transaction.updatedAt.toISOString()}
                variant="edit"
                transaction={{
                    id: transaction.id,
                    name: transaction.name,
                    amount: Number(transaction.amount),
                    type: transaction.type,
                    category: transaction.category,
                    paymentMethod: transaction.paymentMethod,
                    date: dayjs.utc(transaction.date).format('YYYY-MM-DD'),
                }}
            />
            <DeleteTransactionButton
                id={transaction.id}
                name={transaction.name}
            />
        </div>
    )
}
