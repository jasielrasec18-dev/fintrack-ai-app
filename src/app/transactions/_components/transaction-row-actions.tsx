"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { deleteTransaction } from "../../_actions/delete-transaction";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

interface TransactionRowActionsProps {
  id: string;
}

export function TransactionRowActions({ id }: TransactionRowActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await deleteTransaction(id);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/transactions/${id}/edit`}
        className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/80 hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        aria-label="Editar transação"
      >
        <Pencil className="size-4" strokeWidth={2} />
      </Link>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50"
            aria-label="Excluir transação"
          >
            <Trash2 className="size-4" strokeWidth={2} />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              Cancelar
            </AlertDialogCancel>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isPending}
              className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold bg-red-600 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-[#0B0E14] disabled:opacity-50"
            >
              {isPending ? "Excluindo…" : "Excluir"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
