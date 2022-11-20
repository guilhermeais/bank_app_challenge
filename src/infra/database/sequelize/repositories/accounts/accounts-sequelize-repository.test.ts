import { faker } from '@faker-js/faker'
import { afterAll, beforeAll, describe, expect, test, beforeEach } from 'vitest'
import { migrate } from '../../helpers/migrate'
import { truncate } from '../../helpers/truncate'
import AccountModel from '../../models/accounts-model'
import UserModel from '../../models/users-model'
import { AccountsSequelizeRepository } from './accounts-sequelize-repository'

describe('AccountsSequelizeRepository', () => {
  beforeAll(async () => {
    await migrate()
  })

  beforeEach(async () => {
    await truncate()
    await migrate()
  })

  afterAll(async () => {
    await truncate()
  })

  async function makeAccount() {
    const account = await AccountModel.create({
      balance: faker.datatype.number({
        precision: 0.01,
      }),
      currency: faker.finance.currencyCode(),
    })

    return account.toJSON()
  }


  async function makeUser(accountId?:string) {
    const user = await UserModel.create({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      accountId: accountId
    })

    return user.toJSON()
  }

  async function makeAddAccountToUserParams() {
    const user = await makeUser()
    return {
      userId: user.id,
      balance: faker.datatype.number({
        precision: 0.01,
      }),
      currency: faker.finance.currencyCode(),
    }
  }
  function makeSut() {
    const sut = new AccountsSequelizeRepository()

    return {
      sut,
    }
  }
  describe('addAccountToUser()', () => {
    test('should add an account to user', async () => {
      const { sut } = makeSut()
      const params = await makeAddAccountToUserParams()
      await sut.addAccountToUser(params)
      const user = (
        await UserModel.findOne({
          where: {
            id: params.userId,
          },
          include: {
            all: true,
          },
        })
      ).toJSON() as any

      expect(user.accountId).not.toBeUndefined()

      const account = (await AccountModel.findOne({
        where: {
          id: user.accountId,
        }
      })).toJSON()

      expect(user.account).toEqual(account)
    })

    test('should return the user with the account created', async () => {
      const { sut } = makeSut()
      const params = await makeAddAccountToUserParams()
      const user = await sut.addAccountToUser(params)

      expect(user).not.toBeNull()
      expect(user.account).not.toBeUndefined()
      expect(user.account.balance).toEqual(params.balance)
      expect(user.account.currency).toEqual(params.currency)
      expect(user.id).toEqual(params.userId)
    });
  })

  describe('getBalanceByUserId()', () => {
    test('should return the balance of the user', async () => {
      const { sut } = makeSut()
      const account = await makeAccount()
      const user = await makeUser(account.id)
      const result = await sut.getBalanceByUserId(user.id)
      expect(result.balance).toStrictEqual(account.balance)
    })

    test('should return null if users does not exists', async () => {
      const { sut } = makeSut()
      const result = await sut.getBalanceByUserId(faker.datatype.uuid())
      expect(result).toBeNull()
    });
  });
})
