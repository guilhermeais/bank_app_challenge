import { mockAccount } from '@/domain/tests/mock-account'
import {  UserMockBuilder } from '@/domain/tests/mock-user'
import { UpdateAccountRepository } from '../protocols/database/account/update-account-repository'
import { AddUserRepository } from '../protocols/database/user/add-user-repository'
import { GetUserByIdRepository } from '../protocols/database/user/get-user-by-id-repository'
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