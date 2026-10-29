"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  TransactionCategory,
  TransactionPaymentMethod,
  TransactionType,
} from "@prisma/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, type Resolver, Controller } from "react-hook-form";
import { z } from "zod";
import { addTransaction } from "@/src/app/_actions/add-transaction";
import {
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/src/app/_constants/transactions";
import Success from "@/src/assets/success.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { IMaskInput } from "react-imask";

const createTransactionFormSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
  amount: z.coerce
    .number({ message: "O valor é obrigatório." })
    .refine((n) => !Number.isNaN(n), { message: "O valor é obrigatório." })
    .positive({ message: "O valor deve ser positivo." }),
  type: z.enum(TransactionType, { message: "O tipo é obrigatório." }),
  category: z.enum(TransactionCategory, {
    message: "A categoria é obrigatória.",
  }),
  paymentMethod: z.enum(TransactionPaymentMethod, {
    message: "O método de pagamento é obrigatório.",
  }),
  date: z
    .string()
    .min(1, "Data obrigatória")
    .refine((value) => {
      const [d, m, y] = value.split("/")
      return !isNaN(Date.parse(`${y}-${m}-${d}`))
    }, "Data inválida")
    .transform((value) => {
      const [d, m, y] = value.split("/")
      return new Date(`${y}-${m}-${d}T12:00:00`)
    }),
});

type CreateTransactionFormData = z.infer<typeof createTransactionFormSchema>;

export function AddTransactionButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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
      name: "",
      amount: undefined,
      type: undefined,
      category: undefined,
      paymentMethod: undefined,
      date: "",
    } as unknown as CreateTransactionFormData,
  });

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      await addTransaction(data);
      reset();
      setOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section>
      {isPending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#18181b] px-8 py-6 shadow-2xl border border-white/10">
            <Loader2 className="h-10 w-10 animate-spin text-violet-500" aria-hidden />
            <p className="text-sm font-medium text-slate-300">
              Carregando novos dados…
            </p>
          </div>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500"
          >
            Adicionar transação
          </button>
        </DialogTrigger>
        <DialogContent className="gap-0 p-0 sm:max-w-[420px]">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Nova transação</DialogTitle>
          </DialogHeader>

          <form
            className="flex flex-col gap-4 px-6 pb-6 pt-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Título</Label>
              <Input
                id="name"
                placeholder="Ex: Almoço, Freela..."
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-xs text-red-400">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_TYPE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-xs text-red-400">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-xs text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Método de pagamento</Label>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.paymentMethod && (
                <p className="text-xs text-red-400">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Controller
                name="date"
                control={control}
                render={({ field: { value, onChange, onBlur, ref, ...rest } }) => (
                  <IMaskInput
                    {...rest}
                    inputRef={ref}
                    mask="00/00/0000"
                    placeholder="__/__/____"
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500"
                  />
                )}
              />
              {errors.date && (
                <p className="text-xs text-red-400">{errors.date.message}</p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-colors hover:bg-violet-500 disabled:opacity-50"
              >
                <Image src={Success} alt="" width={18} height={18} />
                {isSubmitting ? "Salvando…" : "Salvar"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
