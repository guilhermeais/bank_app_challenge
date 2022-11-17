import { MakeTransactionRepository } from '@/data/protocols/database/transactions/make-transaction-repository'
import { GetUserByIdRepository } from '@/data/protocols/database/user/get-user-by-id-repository'
import { GetUserByUsernameRepository } from '@/data/protocols/database/user/get-user-by-username-repository'
import { MakeTransactionByUsername } from '@/domain/usecases/transactions'
import { TransactionError } from '../errors/transaction-error'

export class DbMakeTransactionByUsername implements MakeTransactionByUsername {
  constructor(
    private readonly getUserByUsernameRepository: GetUserByUsernameRepository,
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly makeTransactionRepository: MakeTransactionRepository
  ) {}
  async make(
    transactionData: MakeTransactionByUsername.Params
  ): Promise<MakeTransactionByUsername.Result> {
    if (transactionData.value <= 0) {
      throw new TransactionError('Transaction value must be greater than 0.')
    }

    const toUser = await this.getUserByUsernameRepository.getByUsername(
      transactionData.toUsername
    )
    if (!toUser) {
      throw new TransactionError(
        'the user you are trying to send money to does not exist'
      )
    }

    if (toUser.id === transactionData.fromUserId) {
      throw new TransactionError('you cannot send money to yourself')
    }

    const fromUser = await this.getUserByIdRepository.getById(
      transactionData.fromUserId
    )

    if (fromUser.account.balance < transactionData.value) {
      throw new TransactionError(
        'you do not have enough money to make this transaction'
      )
    }

    const transaction = await this.makeTransactionRepository.makeTransaction({
      creditedUserId: toUser.id,
      debitedUserId: fromUser.id,
      value: transactionData.value,
    })

    return transaction
  }
}
