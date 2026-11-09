'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import DeleteIcon from '@/src/assets/delete-icon.png'
import { deleteTransaction } from '../_actions/delete-transaction'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog'

interface DeleteTransactionButtonProps {
    id: string
    name: string
}

export const DeleteTransactionButton = ({
    id,
    name,
}: DeleteTransactionButtonProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        setError(null)
        startTransition(async () => {
            try {
                await deleteTransaction(id)
                setOpen(false)
                toast.success('Transação excluída')
            } catch {
                const message =
                    'Não foi possível excluir a transação. Tente novamente.'
                setError(message)
                toast.error(message)
            }
        })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen)
                setError(null)
            }}
        >
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label={`Excluir transação ${name}`}
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-white/10 md:h-7 md:w-7"
                >
                    <Image src={DeleteIcon} alt="" />
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-[min(400px,calc(100%-2rem))] rounded-2xl border border-white/10 bg-[#1E293B] sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-white">
                        Excluir transação?
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#CBD5E1]">
                        “{name}” será removida permanentemente.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <p role="alert" className="text-sm text-red-400">
                        {error}
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="h-10 flex-1 cursor-pointer rounded-xl border border-white/15 text-sm font-medium text-white hover:bg-white/5"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="h-10 flex-1 cursor-pointer rounded-xl bg-danger text-sm font-semibold text-white hover:bg-[#E11D48] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
