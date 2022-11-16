import { User } from "@/domain/entities/user"

export interface GetUserByUsername {
  getByUsername: (username: GetUserByUsername.Params) => Promise<GetUserByUsername.Result>
}

export namespace GetUserByUsername {
  export type Params = string

  export type Result = User
}

