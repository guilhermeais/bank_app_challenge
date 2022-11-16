import { User } from "@/domain/entities/user"

export interface Authentication {
  authenticate: (authentication: Authentication.Params) => Promise<Authentication.Result>
}

export namespace Authentication {
  export type Params = {
    username: string
    password: string
  }

  export type Result = {
    user: Omit<User, 'password'>
    accessToken: string
  }

}
