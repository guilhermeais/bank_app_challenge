import { Transaction } from "@/domain/entities/transactions";
import { mockAccount } from "@/domain/tests/mock-account";
import { faker } from "@faker-js/faker";
import { GetTransactionsByUserIdRepository } from "../protocols/database/transactions/get-transactions-by-user-id-repository";
import { MakeTransactionRepository } from "../protocols/database/transactions/make-transaction-repository";

export class GetTransactionsByUserIdRepositorySpy implements GetTransactionsByUserIdRepository {
  params: GetTransactionsByUserIdRepository.Params;
  result: GetTransactionsByUserIdRepository.Result = [mockTransaction(), mockTransaction()];

  async getByUserId(params: GetTransactionsByUserIdRepository.Params): Promise<GetTransactionsByUserIdRepository.Result> {
    this.params = params;
    return this.result;
  }
}

export function mockTransaction(): Transaction   {
  return {
    id: faker.datatype.uuid(),
    createdAt: faker.date.past(),
    creditedAccount: mockAccount(),
    debitedAccount: mockAccount(),
    value: faker.datatype.number({ precision: 0.01 })
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