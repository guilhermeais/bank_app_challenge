import { GetBalanceValueByUserIdRepository } from '@/data/protocols/database/account/get-balance-value-by-user-id'
import { GetBalanceValueByUserId } from '@/domain/usecases/account'

export class DbGetBalanceValueByUserId implements GetBalanceValueByUserId {
  constructor(
    private readonly getBalanceValueByUserIdRepository: GetBalanceValueByUserIdRepository
  ) {}
  async get(
    params: GetBalanceValueByUserId.Params
  ): Promise<GetBalanceValueByUserId.Result> {
    return await this.getBalanceValueByUserIdRepository.getBalanceByUserId(
      params.userId
    )
  }
}
