import { Transaction } from '@/domain/entities/transactions'
import { mockAccount } from '@/domain/tests/mock-account'
import { mockUser, UserMockBuilder } from '@/domain/tests/mock-user'
import { faker } from '@faker-js/faker'
import { UpdateAccountRepository } from '../protocols/database/account/update-account-repository'
import { MakeTransactionRepository } from '../protocols/database/transactions/make-transaction-repository'
import { AddUserRepository } from '../protocols/database/user/add-user-repository'
import { GetUserByIdRepository } from '../protocols/database/user/get-user-by-id-repository'
import { GetUserByUsernameRepository } from '../protocols/database/user/get-user-by-username-repository'

export function mockTransaction(): Transaction {
  return {
    id: faker.datatype.uuid(),
    createdAt: faker.date.past(),
    creditedAccount: mockAccount(),
    debitedAccount: mockAccount(),
    value: faker.datatype.number({ precision: 0.01 })
  }
}
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

export class UpdateAccountRepositorySpySpy
  implements UpdateAccountRepository
{
  params: UpdateAccountRepository.Params
  result: UpdateAccountRepository.Result =  mockAccount()

  async update(
    params: UpdateAccountRepository.Params
  ): Promise<UpdateAccountRepository.Result> {
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

export class GetUserByIdRepositorySpy
  implements GetUserByIdRepository
{
  id: string
  result: GetUserByIdRepository.Result =  new UserMockBuilder().build()

  async getById(
    id: string
  ): Promise<GetUserByIdRepository.Result> {
    this.id = id
    return this.result
  }
}

export class MakeTransactionRepositorySpy
  implements MakeTransactionRepository
{
  params: MakeTransactionRepository.Params
  result: MakeTransactionRepository.Result =  mockTransaction()

  async makeTransaction(
    params: MakeTransactionRepository.Params
  ): Promise<MakeTransactionRepository.Result> {
    this.params = params

    return Promise.resolve(this.result)
  }
}

export function mockMakeTransactionParams(): MakeTransactionRepository.Params {
  return {
    creditedUserId: faker.datatype.uuid(),
    debitedUserId: faker.datatype.uuid(),
    value: faker.datatype.number({ precision: 0.01 })
  }
}
export class MakeTransactionParamsMock {
  private readonly params: MakeTransactionRepository.Params = mockMakeTransactionParams()

  withZeroValue(): MakeTransactionParamsMock {
    this.params.value = 0
    return this
  }

  withNegativeValue(): MakeTransactionParamsMock {
    this.params.value = -1
    return this
  }

  build(): MakeTransactionRepository.Params {
    return this.params
  }
}