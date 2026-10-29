import { Transaction } from "@prisma/client";
import { prisma } from "../_lib/prisma";

/** Transações mais recentes primeiro (1º da lista = mais recente). */
export const getRecentTransactions = async (): Promise<Transaction[]> => {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    take: 3,
  });
  return transactions;
};
