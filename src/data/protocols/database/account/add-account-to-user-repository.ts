import { AddAccountToUser } from "@/domain/usecases/account"

export interface AddAccountToUserRepository {
  add: (accountData: AddAccountToUserRepository.Params) => Promise<AddAccountToUserRepository.Result>
}

export namespace AddAccountToUserRepository {
  export type Params = AddAccountToUser.Params
  export type Result = AddAccountToUser.Result
}
