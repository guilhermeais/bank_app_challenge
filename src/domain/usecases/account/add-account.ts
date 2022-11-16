import { Account } from "@/domain/entities/account"

export interface AddAccount {
  add: (params: AddAccount.Params) => Promise<AddAccount.Result>
}

export namespace AddAccount {
  export type Params = {
    username: string
    password: string
  }

  export type Result = Account
}
