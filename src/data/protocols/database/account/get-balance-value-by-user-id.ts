import { GetBalanceValueByUserId } from "@/domain/usecases/account"

export interface GetBalanceValueByUserIdRepository {
  getBalanceByUserId: (userId: GetBalanceValueByUserIdRepository.Params) => Promise<GetBalanceValueByUserIdRepository.Result>
}

export namespace GetBalanceValueByUserIdRepository {
  export type Params = string
  export type Result = GetBalanceValueByUserId.Result
}
