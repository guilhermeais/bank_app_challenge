import { mockUser, UserMockBuilder } from '@/domain/tests/mock-user'
import { AddUserRepository } from '../protocols/database/user/add-user-repository'
import { GetUserByUsernameRepository } from '../protocols/database/user/get-user-by-username-repository'

export class AddUserRepositorySpy implements AddUserRepository {
  params: AddUserRepository.Params
  result = new UserMockBuilder().withoutAccount().withoutPassword().build()

  async add(
    params: AddUserRepository.Params
  ): Promise<AddUserRepository.Result> {
    this.params = params
    return this.result
  }
}

export class GetUserByUsernameRepositorySpy
  implements GetUserByUsernameRepository
{
  username: string
  result: GetUserByUsernameRepository.Result =  new UserMockBuilder().build()

  async getByUsername(
    username: string
  ): Promise<GetUserByUsernameRepository.Result> {
    this.username = username
    return this.result
  }
}
