import { User } from "@/domain/entities/user"

export interface GetUserById {
  getById: (id: GetUserById.Params) => Promise<GetUserById.Result>
}

export namespace GetUserById {
  export type Params = string

  export type Result = User
}

