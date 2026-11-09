'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import DeleteIcon from '@/src/assets/delete-icon.png'
import { deleteTransaction } from '../_actions/delete-transaction'

interface DeleteTransactionButtonProps {
    id: string
    name: string
}

export const DeleteTransactionButton = ({
    id,
    name,
}: DeleteTransactionButtonProps) => {
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!window.confirm(`Excluir a transação "${name}"?`)) return

        startTransition(async () => {
            try {
                await deleteTransaction(id)
            } catch {
                window.alert(
                    'Não foi possível excluir a transação. Tente novamente.'
                )
            }
        })
    }

    return (
        <button
            type="button"
            aria-label={`Excluir transação ${name}`}
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer rounded-md p-1 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <Image src={DeleteIcon} alt="" />
        </button>
    )
}
