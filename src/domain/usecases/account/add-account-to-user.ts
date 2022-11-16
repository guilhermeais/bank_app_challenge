import { User } from "@/domain/entities/user"

export interface AddAccountToUser {
  add: (params: AddAccountToUser.Params) => Promise<AddAccountToUser.Result>
}

export namespace AddAccountToUser {
  export type Params = {
    userId: string
    balance: number
    currency: string
  }

  export type Result = Omit<User, 'password'>
}
