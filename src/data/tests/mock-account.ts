import { UserMockBuilder } from '@/domain/tests/mock-user'
import { AddAccountToUserRepository } from '../protocols/database/account/add-account-to-user-repository'

export class AddAccountToUserRepositorySpy
  implements AddAccountToUserRepository
{
  params: AddAccountToUserRepository.Params
  result = new UserMockBuilder().withoutPassword().build()

  async add(
    params: AddAccountToUserRepository.Params
  ): Promise<AddAccountToUserRepository.Result> {
    this.params = params
    return Promise.resolve(this.result)
  }
}
