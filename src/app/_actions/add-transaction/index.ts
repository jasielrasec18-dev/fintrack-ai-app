'use server'

import { Prisma } from "@prisma/client"
import { prisma } from "../../_lib/prisma"
import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"
import { addTransactionSchema } from './schema'
import { redirect } from "next/navigation"

/** Dados do formulário (sem userId); o userId é definido no servidor pela sessão. */
type AddTransactionParams = Omit<Prisma.TransactionCreateInput, 'user' | 'userId'>

export const addTransaction = async (params: AddTransactionParams) => {
  addTransactionSchema.parse(params)

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user?.id
  if (!userId) {
    redirect("/sign-in")
  }

  await prisma.transaction.create({
    data: {
      ...params,
      user: { connect: { id: userId } },
    },
  })
}
