'use client'

import { useState } from 'react'

import Image from 'next/image'
import PlusIcon from '@/src/assets/plus-icon.png'
import ConfirmIcon from '@/src/assets/confirm-icon.png'

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

import { useForm, Controller, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    TRANSACTION_CATEGORY_OPTIONS,
    TRANSACTION_PAYMENT_METHOD_OPTIONS,
    TRANSACTION_TYPE_OPTIONS,
} from '../_constants/transaction'

import {
    createTransactionFormSchema,
    type CreateTransactionFormData,
} from '../_schemas/transaction'
import { addTransaction } from '../_actions/add-transaction'
import { useRouter } from 'next/navigation'

export const AddTransactionButton = () => {
    const [open, setIsOpen] = useState<boolean>(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateTransactionFormData>({
        resolver: zodResolver(
            createTransactionFormSchema
        ) as unknown as Resolver<CreateTransactionFormData>,
        defaultValues: {
            name: '',
            amount: undefined,
            type: undefined,
            category: undefined,
            paymentMethod: undefined,
            date: undefined,
        },
        mode: 'onBlur',
    })

    const onSubmit = async (data: CreateTransactionFormData) => {
        try {
            console.log(data)
            await addTransaction(data)
            reset()
            setIsOpen(false)
            router.refresh()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <section>
            <Dialog open={open} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="rounded-sm bg-[#9333EA] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 
                                transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <Image src={PlusIcon} alt="Plus Icon" />
                        <p>Adicionar</p>
                    </button>
                </DialogTrigger>

                <DialogContent className="bg-[#1E293B]">
                    <DialogHeader className="p-2">
                        <DialogTitle>Nova transação</DialogTitle>
                    </DialogHeader>

                    <form
                        className="flex flex-col gap-4 pt-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-2">
                            <Label>Título</Label>
                            <Input
                                id="name"
                                placeholder="Ex: Almoço, Freela..."
                                {...register('name')}
                            />

                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Valor (R$)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="0,00"
                                {...register('amount', { valueAsNumber: true })}
                            />
                            {errors.amount && (
                                <p className="text-xs text-red-500">
                                    {errors.amount.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo</Label>

                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                    >
                                        <SelectTrigger className="w-full">
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
                                <p className="text-xs text-red-500">
                                    {errors.type.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Categoria</Label>

                            <Controller
                                control={control}
                                name="category"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                    >
                                        <SelectTrigger className="w-full">
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
                                <p className="text-xs text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Método de pagamento</Label>

                            <Controller
                                control={control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione o método de pagamento" />
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
                                <p className="text-xs text-red-500">
                                    {errors.paymentMethod.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Data</Label>
                            <Input
                                type="date"
                                id="date"
                                placeholder="__/__/____"
                                {...register('date')}
                            />

                            {errors.date && (
                                <p className="text-xs text-red-500">
                                    {errors.date.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="gap-4 border-none">
                            <button className="border border-[#CAD5E2] rounded-lg w-1/3 py-2.5 cursor-pointer">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-[#8E51FF] w-2/3 flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                                disabled={isSubmitting}
                            >
                                <Image src={ConfirmIcon} alt="Confirm Icon" />
                                <p className="font-semibold text-sm">
                                    {isSubmitting
                                        ? 'Salvando...'
                                        : 'Salvar transação'}
                                </p>
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    )
}