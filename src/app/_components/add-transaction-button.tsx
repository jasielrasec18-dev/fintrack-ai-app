'use client'

import { useState } from 'react'

import Image from 'next/image'
import PlusIcon from '@/src/assets/plus-icon.png'
import ConfirmIcon from '@/src/assets/confirm-icon.png'
import EditIcon from '@/src/assets/edit-icon.png'
import type {
    TransactionCategory,
    TransactionPaymentMethod,
    TransactionType,
} from '@prisma/client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/src/app/_components/ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    TRANSACTION_CATEGORY_OPTIONS,
    TRANSACTION_PAYMENT_METHOD_OPTIONS,
    TRANSACTION_TYPE_OPTIONS,
} from '../_constants/transaction'

import {
    createTransactionFormSchema,
    type CreateTransactionFormData,
    type CreateTransactionFormInput,
} from '../_schemas/transaction'
import { addTransaction } from '../_actions/add-transaction'
import { updateTransaction } from '../_actions/update-transaction'
import { useRouter } from 'next/navigation'

const fieldClass =
    'h-10 rounded-xl border border-white/10 bg-[#334155]/50 px-3.5 text-sm placeholder:text-text-subtle'
const labelClass = 'mb-2 text-sm font-medium text-white'

interface AddTransactionButtonProps {
    variant?: 'default' | 'fab' | 'edit'
    transaction?: {
        id: string
        name: string
        amount: number
        type: TransactionType
        category: TransactionCategory
        paymentMethod: TransactionPaymentMethod
        /** Data no formato YYYY-MM-DD */
        date: string
    }
}

export const AddTransactionButton = ({
    variant = 'default',
    transaction,
}: AddTransactionButtonProps) => {
    const [open, setIsOpen] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateTransactionFormInput, unknown, CreateTransactionFormData>(
        {
            resolver: zodResolver(createTransactionFormSchema),
            defaultValues: {
                name: transaction?.name ?? '',
                amount: transaction?.amount,
                type: transaction?.type,
                category: transaction?.category,
                paymentMethod: transaction?.paymentMethod,
                date: transaction?.date,
            },
            mode: 'onBlur',
        }
    )

    const handleOpenChange = (nextOpen: boolean) => {
        setIsOpen(nextOpen)
        if (!nextOpen) {
            reset()
            setServerError(null)
        }
    }

    const onSubmit = async (data: CreateTransactionFormData) => {
        setServerError(null)
        try {
            if (transaction) {
                await updateTransaction(transaction.id, data)
            } else {
                const { error } = await addTransaction(data)
                if (error) {
                    setServerError(error)
                    return
                }
            }
            handleOpenChange(false)
            router.refresh()
        } catch {
            setServerError(
                'Não foi possível salvar a transação. Tente novamente.'
            )
        }
    }

    return (
        <section>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    {variant === 'edit' ? (
                        <button
                            type="button"
                            aria-label={`Editar transação ${transaction?.name ?? ''}`}
                            className="cursor-pointer rounded-md p-1 transition-colors hover:bg-white/10"
                        >
                            <Image src={EditIcon} alt="" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            aria-label={
                                variant === 'fab'
                                    ? 'Adicionar transação'
                                    : undefined
                            }
                            className={
                                variant === 'fab'
                                    ? 'fixed right-6 bottom-6 z-20 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-colors hover:bg-[#7E22CE] lg:hidden'
                                    : 'flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 font-bold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-[#7E22CE]'
                            }
                        >
                            <Image src={PlusIcon} alt="" />
                            {variant === 'default' && <span>Adicionar</span>}
                        </button>
                    )}
                </DialogTrigger>

                <DialogContent className="max-h-[90vh] max-w-[400px] gap-0 overflow-y-auto rounded-2xl border border-white/10 bg-[#1E293B] p-0 sm:max-w-[400px]">
                    <DialogHeader className="border-b border-white/10 px-6 py-5">
                        <DialogTitle className="text-lg font-semibold text-white">
                            {transaction
                                ? 'Editar transação'
                                : 'Nova transação'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-5 px-6 py-5">
                            <div>
                                <Label htmlFor="name" className={labelClass}>
                                    Título
                                </Label>
                                <Input
                                    id="name"
                                    className={fieldClass}
                                    placeholder="Ex: Almoço, Freela..."
                                    {...register('name')}
                                />

                                {errors.name && (
                                    <p className="mt-1.5 text-xs text-red-400">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="amount" className={labelClass}>
                                    Valor (R$)
                                </Label>
                                <Input
                                    id="amount"
                                    className={fieldClass}
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    placeholder="0,00"
                                    {...register('amount', {
                                        valueAsNumber: true,
                                    })}
                                />
                                {errors.amount && (
                                    <p className="mt-1.5 text-xs text-red-400">
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="type" className={labelClass}>
                                    Tipo
                                </Label>

                                <Controller
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ''}
                                        >
                                            <SelectTrigger
                                                id="type"
                                                className={`w-full data-[size=default]:h-10 ${fieldClass}`}
                                            >
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>

                                            <SelectContent position="popper">
                                                {TRANSACTION_TYPE_OPTIONS.map(
                                                    (opt) => (
                                                        <SelectItem
                                                            key={opt.value}
                                                            value={opt.value}
                                                        >
                                                            {opt.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.type && (
                                    <p className="mt-1.5 text-xs text-red-400">
                                        {errors.type.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label
                                    htmlFor="category"
                                    className={labelClass}
                                >
                                    Categoria
                                </Label>

                                <Controller
                                    control={control}
                                    name="category"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ''}
                                        >
                                            <SelectTrigger
                                                id="category"
                                                className={`w-full data-[size=default]:h-10 ${fieldClass}`}
                                            >
                                                <SelectValue placeholder="Selecione a categoria" />
                                            </SelectTrigger>

                                            <SelectContent position="popper">
                                                {TRANSACTION_CATEGORY_OPTIONS.map(
                                                    (opt) => (
                                                        <SelectItem
                                                            key={opt.value}
                                                            value={opt.value}
                                                        >
                                                            {opt.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.category && (
                                    <p className="mt-1.5 text-xs text-red-400">
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label
                                    htmlFor="paymentMethod"
                                    className={labelClass}
                                >
                                    Método de pagamento
                                </Label>

                                <Controller
                                    control={control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value ?? ''}
                                        >
                                            <SelectTrigger
                                                id="paymentMethod"
                                                className={`w-full data-[size=default]:h-10 ${fieldClass}`}
                                            >
                                                <SelectValue placeholder="Selecione o método" />
                                            </SelectTrigger>

                                            <SelectContent position="popper">
                                                {TRANSACTION_PAYMENT_METHOD_OPTIONS.map(
                                                    (opt) => (
                                                        <SelectItem
                                                            key={opt.value}
                                                            value={opt.value}
                                                        >
                                                            {opt.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {errors.paymentMethod && (
                                    <p className="mt-1.5 text-xs text-red-400">
                                        {errors.paymentMethod.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="date" className={labelClass}>
                                    Data
                                </Label>
                                <Input
                                    type="date"
                                    id="date"
                                    className={`${fieldClass} scheme-dark`}
                                    placeholder="__/__/____"
                                    {...register('date')}
                                />

                                {errors.date && (
                                    <p className="mt-1.5 text-xs text-red-400">
                                        {errors.date.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {serverError && (
                            <p
                                role="alert"
                                className="px-6 pb-4 text-sm text-red-400"
                            >
                                {serverError}
                            </p>
                        )}

                        <DialogFooter className="mx-0 mb-0 flex-row gap-3 rounded-none border-none bg-transparent p-0 px-6 pb-6 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => handleOpenChange(false)}
                                className="h-10 flex-1 cursor-pointer rounded-xl border border-white/15 text-sm font-medium text-white hover:bg-white/5"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex h-10 flex-[2] cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-soft text-sm font-semibold text-white shadow-lg shadow-primary-soft/30 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={isSubmitting}
                            >
                                <Image src={ConfirmIcon} alt="" />
                                <span>
                                    {isSubmitting
                                        ? 'Salvando...'
                                        : 'Salvar transação'}
                                </span>
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    )
}
