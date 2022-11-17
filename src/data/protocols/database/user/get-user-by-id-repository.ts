import { GetUserByUsername } from "@/domain/usecases/user"

export interface GetUserByIdRepository {
  getById: (id: GetUserByIdRepository.Params) => Promise<GetUserByIdRepository.Result>
}

export namespace GetUserByIdRepository {
  export type Params = string

  export type Result = GetUserByUsername.Result
}