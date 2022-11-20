import { AddAccountToUserRepository } from '@/data/protocols/database/account/add-account-to-user-repository'
import { AddAccountToUser } from '@/domain/usecases/account'
import AccountModel from '../../models/accounts-model'
import UserModel from '../../models/users-model'

export class AccountsSequelizeRepository implements AddAccountToUserRepository {
  async addAccountToUser(
    accountData: AddAccountToUser.Params
  ): Promise<AddAccountToUser.Result> {
    const account = (
      await AccountModel.create({
        balance: accountData.balance,
        currency: accountData.currency,
      })
    ).toJSON()

    const result = await UserModel.update(
      {
        accountId: account.id,
      },
      {
        where: {
          id: accountData.userId,
        },
      }
    )

    const user = await UserModel.findOne({
      where: {
        id: accountData.userId,
      },
      include: {
        all: true,
      },
    })
    return user?.toJSON() as any | null
  }
}
