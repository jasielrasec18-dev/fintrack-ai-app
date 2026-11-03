import {
  TransactionCategory,
  TransactionPaymentMethod,
  Transaction,
  TransactionType,
} from "@prisma/client";
import { prisma } from "../_lib/prisma";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { TransactionRowActions } from "@/src/app/transactions/_components/transaction-row-actions";

export const TRANSACTION_CATEGORY_LABELS: Record<TransactionCategory, string> = {
  HOUSING: "Moradia",
  TRANSPORTATION: "Transporte",
  FOOD: "Alimentação",
  ENTERTAINMENT: "Lazer",
  HEALTH: "Saúde",
  UTILITY: "Contas",
  SALARY: "Salário",
  EDUCATION: "Educação",
  OTHER: "Outros",
} as const;

export const TRANSACTION_PAYMENT_METHOD_LABELS = {
  BANK_TRANSFER: "Transferência bancária",
  BANK_SLIP: "Boleto bancário",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  OTHER: "Outros",
  PIX: "Pix",
} as const;

export const TRANSACTION_TYPE_LABELS = {
  DEPOSIT: "Entrada",
  EXPENSE: "Despesa",
  INVESTMENT: "Investimento",
} as const;

export const TRANSACTION_TYPE_OPTIONS = [
  { value: TransactionType.EXPENSE, label: "Despesa" },
  { value: TransactionType.DEPOSIT, label: "Depósito" },
  { value: TransactionType.INVESTMENT, label: "Investimento" },
] as const;

const Transactions = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const transactions: Transaction[] = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Transações
        </h1>
        <p className="text-sm text-slate-400">
          Gerencie suas entradas, despesas e investimentos
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-card-dark/50 p-12 text-center">
          <p className="text-slate-400">Nenhuma transação encontrada.</p>
          <p className="text-sm text-slate-500 mt-1">
            Adicione sua primeira transação no dashboard.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-card-dark/80 shadow-xl shadow-black/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/[0.06] hover:bg-white/[0.06]">
                <TableHead className="text-slate-300">Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[90px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium text-white">
                    {transaction.name}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {TRANSACTION_CATEGORY_LABELS[transaction.category]}
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {
                      TRANSACTION_PAYMENT_METHOD_LABELS[
                        transaction.paymentMethod
                      ]
                    }
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.type === "EXPENSE"
                          ? "bg-red-500/20 text-red-400"
                          : transaction.type === "DEPOSIT"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {TRANSACTION_TYPE_LABELS[transaction.type]}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400 tabular-nums">
                    {new Date(transaction.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold tabular-nums ${
                      transaction.type === "EXPENSE"
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {Number(transaction.amount).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <TransactionRowActions id={transaction.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
