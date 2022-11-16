import { GetUserByUsername } from "@/domain/usecases/user"

export interface GetUserByUsernameRepository {
  getByUsername: (username: GetUserByUsernameRepository.Params) => Promise<GetUserByUsernameRepository.Result>
}

export namespace GetUserByUsernameRepository {
  export type Params = string

  export type Result = GetUserByUsername.Result
}

