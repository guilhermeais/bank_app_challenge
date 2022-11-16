import { Transaction } from "@/domain/entities/transactions"

export interface GetTransactionsByUserId {
  get: (params: GetTransactionsByUserId.Params) => Promise<GetTransactionsByUserId.Result>
}

export namespace GetTransactionsByUserId {
  export type Params = {
    userId: string
    date?: Date
    only?: 'in' | 'out'
  }

  export type Result = Transaction[]
}