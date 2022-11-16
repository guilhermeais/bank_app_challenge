import { User } from "@/domain/entities/user"

export interface AddUser {
  add: (params: AddUser.Params) => Promise<AddUser.Result>
}

export namespace AddUser {
  export type Params = {
    username: string
    password: string
  }

  export type Result = Omit<User, 'password'>
}
