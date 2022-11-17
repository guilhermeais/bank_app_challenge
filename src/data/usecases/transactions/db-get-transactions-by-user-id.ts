import { GetTransactionsByUserIdRepository } from "@/data/protocols/database/transactions/get-transactions-by-user-id-repository";
import { GetTransactionsByUserId } from "@/domain/usecases/transactions";

export class DbGetTransactionsByUserId implements GetTransactionsByUserId {
  constructor(
    private readonly getTransactionsByUserIdRepository: GetTransactionsByUserIdRepository
  ) {}

  async get(params: GetTransactionsByUserId.Params): Promise<GetTransactionsByUserId.Result> {
    return await this.getTransactionsByUserIdRepository.getByUserId(params)
  }
}