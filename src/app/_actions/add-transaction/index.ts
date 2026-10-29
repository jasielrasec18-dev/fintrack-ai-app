'use server'

import { Prisma } from "@prisma/client"
import { prisma } from "../../_lib/prisma"
import { addTransactionSchema } from './schema'

/** Dados do formulário. Nesta etapa ainda não há autenticação (sem userId). */
type AddTransactionParams = Omit<Prisma.TransactionCreateInput, 'user' | 'userId'>

export const addTransaction = async (params: AddTransactionParams) => {
  addTransactionSchema.parse(params)

  await prisma.transaction.create({
    data: { ...params },
  })
}
