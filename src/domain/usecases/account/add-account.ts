import { Account } from "@/domain/entities/account"

export interface AddAccount {
  add: (params: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccount {
  export type Params = {
    balance: number
  }

  export type Result = Account
}
