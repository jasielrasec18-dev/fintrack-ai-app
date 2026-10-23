import Image from "next/image";
import AccountsIcon from "@/src/assets/accounts.png";

interface BalanceCardProps {
  balance: number;
  depositsTotal: number;
  expensesTotal: number;
}

export default function BalanceCard({
  balance,
  depositsTotal,
  expensesTotal,
}: BalanceCardProps) {
  return (
    <div className="lg:col-span-2 bg-primary p-8 rounded-3xl text-white min-h-60">
      <div className="flex justify-between">
        <div>
          <p className="text-sm">Saldo total</p>

          <h3 className="text-5xl font-bold">
            {balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
        </div>

        <div className="bg-white/20 p-3 rounded-2xl">
          <Image src={AccountsIcon} alt="" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20">
        <div>
          <p className="text-xs opacity-80">Receitas</p>

          <p className="text-xl font-semibold">
            {depositsTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <div>
          <p className="text-xs opacity-80">Despesas</p>

          <p className="text-xl font-semibold">
            {expensesTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
