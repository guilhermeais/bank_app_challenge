import { MakeTransactionByUsername } from "@/domain/usecases/transactions"

export interface MakeTransactionRepository {
  makeTransaction: (params: MakeTransactionRepository.Params) => Promise<MakeTransactionRepository.Result>
}

export namespace MakeTransactionRepository {
  export type Params = {
    debitedUserId: string
    creditedUserId: string
    value: number
  }
  export type Result = MakeTransactionByUsername.Result
}
