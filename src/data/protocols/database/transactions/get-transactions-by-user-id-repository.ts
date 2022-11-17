import { GetTransactionsByUserId } from "@/domain/usecases/transactions"

export interface GetTransactionsByUserIdRepository {
  getByUserId: (params: GetTransactionsByUserIdRepository.Params) => Promise<GetTransactionsByUserIdRepository.Result>
}

export namespace GetTransactionsByUserIdRepository {
  export type Params = GetTransactionsByUserId.Params
  export type Result = GetTransactionsByUserId.Result
}
