import { Transaction } from "@prisma/client";
import { prisma } from "../_lib/prisma";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/** Transações mais recentes primeiro (1º da lista = mais recente), apenas do usuário logado. */
export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    redirect("/sign-in");
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 3,
  });
  return transactions;
};
