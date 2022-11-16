import { AddUser } from "@/domain/usecases/user"

export interface AddUserRepository {
  add: (surveyData: AddUserRepository.Params) => Promise<AddUserRepository.Result>
}

export namespace AddUserRepository {
  export type Params = AddUser.Params
  export type Result = AddUser.Result
}
