import { UserMockBuilder } from '@/domain/tests/mock-user'
import { faker } from '@faker-js/faker'
import { AddAccountToUserRepository } from '../protocols/database/account/add-account-to-user-repository'
import { GetBalanceValueByUserIdRepository } from '../protocols/database/account/get-balance-value-by-user-id'

export class AddAccountToUserRepositorySpy
  implements AddAccountToUserRepository
{
  params: AddAccountToUserRepository.Params
  result = new UserMockBuilder().withoutPassword().build()

  async addAccountToUser(
    params: AddAccountToUserRepository.Params
  ): Promise<AddAccountToUserRepository.Result> {
    this.params = params
    return Promise.resolve(this.result)
  }
}

export class GetBalanceValueByUserIdRepositorySpy
  implements GetBalanceValueByUserIdRepository
{
  userId: GetBalanceValueByUserIdRepository.Params
  result = {
    balance: faker.datatype.number({ precision: 0.01 }),
  }

  async getBalanceByUserId(
    userId: GetBalanceValueByUserIdRepository.Params
  ): Promise<GetBalanceValueByUserIdRepository.Result> {
    this.userId = userId
    return Promise.resolve(this.result)
  }
}
