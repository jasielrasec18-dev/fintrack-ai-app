import { prisma } from "../../../_lib/prisma";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface EditTransactionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTransactionPage({
  params,
}: EditTransactionPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
  });

  if (!transaction) notFound();

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Editar transação</h1>
      <p className="text-slate-400 text-sm mb-6">
        Formulário de edição em construção. Transação: {transaction.name}
      </p>
      <Link
        href="/transactions"
        className="text-violet-400 hover:text-violet-300 text-sm font-medium"
      >
        ← Voltar para transações
      </Link>
    </div>
  );
}
