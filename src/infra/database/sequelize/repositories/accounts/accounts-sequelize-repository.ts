import { AddAccountToUserRepository } from '@/data/protocols/database/account/add-account-to-user-repository'
import { GetBalanceValueByUserIdRepository } from '@/data/protocols/database/account/get-balance-value-by-user-id'
import { UpdateAccountRepository } from '@/data/protocols/database/account/update-account-repository'
import { Account } from '@/domain/entities/account'
import { AddAccountToUser } from '@/domain/usecases/account'
import AccountModel from '../../models/accounts-model'
import UserModel from '../../models/users-model'

export class AccountsSequelizeRepository
  implements
    AddAccountToUserRepository,
    GetBalanceValueByUserIdRepository,
    UpdateAccountRepository
{
  async addAccountToUser(
    accountData: AddAccountToUser.Params
  ): Promise<AddAccountToUser.Result> {
    const account = (
      await AccountModel.create({
        balance: accountData.balance,
        currency: accountData.currency,
      })
    ).toJSON()

    await UserModel.update(
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

  async getBalanceByUserId(
    userId: string
  ): Promise<GetBalanceValueByUserIdRepository.Result> {
    const result = (
      await UserModel.findOne({
        where: {
          id: userId,
        },
        include: [
          { model: AccountModel, as: 'account', attributes: ['balance'] },
        ],
      })
    )?.toJSON() as any

    return result
      ? {
          balance: result.account.balance,
        }
      : null
  }

  async update(accountData: UpdateAccountRepository.Params): Promise<Account> {
    await AccountModel.update(
      {
        balance: accountData.balance,
        currency: accountData.currency,
      },
      {
        where: {
          id: accountData.id,
        },
        returning: true,
      }
    )

    const account = await AccountModel.findOne({
      where: {
        id: accountData.id,
      },
    })
    return (account?.toJSON() as Account) || null
  }
}
