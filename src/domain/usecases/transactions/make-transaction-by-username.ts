import { Transaction } from "@/domain/entities/transactions"

export interface MakeTransactionByUsername {
  make: (params: MakeTransactionByUsername.Params) => Promise<MakeTransactionByUsername.Result>
}

export namespace MakeTransactionByUsername {
  export type Params = {
    username: string
    value: number
  }

  export type Result = Transaction
}