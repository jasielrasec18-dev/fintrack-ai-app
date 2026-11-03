"use server";

import { prisma } from "../../_lib/prisma";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteTransaction(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  await prisma.transaction.deleteMany({
    where: { id, userId },
  });
  return { success: true };
}
