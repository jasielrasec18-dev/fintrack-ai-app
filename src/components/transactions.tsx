import dayjs from "dayjs";
import { TransactionIcon } from "./transaction-icon";
import { AddTransactionButton } from "./add-transaction-button";

type TransactionType = "DEPOSIT" | "EXPENSE" | "INVESTMENT";

interface TransactionRow {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  type: TransactionType;
}

const transactions: TransactionRow[] = [
  { id: "1", name: "Salário", category: "Renda", date: "2026-06-05", amount: 8200, type: "DEPOSIT" },
  { id: "2", name: "Mercado", category: "Alimentação", date: "2026-06-08", amount: 450, type: "EXPENSE" },
  { id: "3", name: "Tesouro Direto", category: "Investimento", date: "2026-06-10", amount: 1000, type: "INVESTMENT" },
];

export default function Transactions() {
  return (
    <div>
      <div className="flex justify-between">
        <p className="text-xl font-bold">Transações recentes</p>
        <AddTransactionButton />
      </div>

      <div className="bg-[#161b26] rounded-3xl border border-[#1d293d] overflow-hidden">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-5 flex gap-4 border-b last:border-none border-[#1d293d] hover:bg-slate-800/50 transition-colors"
          >
            <TransactionIcon type={transaction.type} />

            <div className="flex-1">
              <p>{transaction.name}</p>
              <p className="text-sm text-muted-foreground">
                {dayjs(transaction.date).format("DD [de] MMMM")} •{" "}
                {transaction.category}
              </p>
            </div>

            <span
              className={
                transaction.type === "EXPENSE"
                  ? "text-rose-500"
                  : "text-emerald-500"
              }
            >
              {transaction.type === "EXPENSE" ? "-" : "+"}
              {transaction.amount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
