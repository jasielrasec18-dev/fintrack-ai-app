import { prisma } from "@/src/app/_lib/prisma";
import { auth } from "@/src/lib/auth";
import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
// import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
// import { auth } from "@clerk/nextjs/server";
import utc from "dayjs/plugin/utc";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

dayjs.extend(utc);

export const getDashboard = async (month: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const userId = session?.user?.id

  if (!userId) {
    redirect("/sign-in")
  }

  const year = 2026;

  const startOfMonth = new Date(`${year}-${month}-01T00:00:00.000Z`);

  const startOfNextMonth = new Date(
    month === "12"
      ? `${year + 1}-01-01T00:00:00.000Z`
      : `${year}-${String(Number(month) + 1).padStart(2, "0")}-01T00:00:00.000Z`,
  );

  const where = {
    userId,
    date: {
      gte: startOfMonth,
      lt: startOfNextMonth,
    },
  };

  const depositsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const investmentsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const expensesTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const balance = depositsTotal - investmentsTotal - expensesTotal;

  const transactionsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )._sum.amount,
  );

  const typesPercentage: any = {
    [TransactionType.DEPOSIT]: Math.round(
      (Number(depositsTotal || 0) / Number(transactionsTotal)) * 100,
    ),
    [TransactionType.EXPENSE]: Math.round(
      (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
    ),
    [TransactionType.INVESTMENT]: Math.round(
      (Number(investmentsTotal || 0) / Number(transactionsTotal)) * 100,
    ),
  };

  const totalExpensePerCategory: any[] = (
    await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category: any) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal: Math.round(
      (Number(category._sum.amount) / Number(expensesTotal)) * 100,
    ),
  }));

  const lastTransactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};
