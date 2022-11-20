import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'
import { migrate } from '../../helpers/migrate'
import { truncate } from '../../helpers/truncate'
import { UsersSequelizeRepository } from './users-sequelize-repository'
import UsersModel from '../../models/users-model'
import { UserMockBuilder } from '@/domain/tests/mock-user'
import { faker } from '@faker-js/faker'
import AccountModel from '../../models/accounts-model'

describe('UsersSequelizeRepository', () => {
  async function makeAccount() {
    const account = await AccountModel.create({
      balance: faker.datatype.number({
        precision: 0.01,
      }),
      currency: faker.finance.currencyCode(),
    })

    return account.toJSON()
  }

  async function makeUser() {
    const account = await makeAccount()
    const user = await UsersModel.create({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      accountId: account.id,
    })

    return { ...user.toJSON(), account }
  }

  function makeSut() {
    const sut = new UsersSequelizeRepository()

    return {
      sut,
    }
  }

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

  describe('add()', () => {
    test('should add the user at the database', async () => {
      const { sut } = makeSut()
      const account = await makeAccount()
      console.log(account)

      const userData = {
        ...new UserMockBuilder().withoutAccount().build(),
        accountId: account.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await sut.add(userData)
      const userExists = await UsersModel.findOne({
        where: { username: userData.username },
      })
      expect(userExists.toJSON()).toEqual(userData)
    })

    test('should return the added user', async () => {
      const { sut } = makeSut()
      const account = await makeAccount()
      const userData = {
        ...new UserMockBuilder().withoutAccount().build(),
        accountId: account.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const user = await sut.add(userData)
      expect(user).toEqual(userData)
    })
  })

  describe('getById()', () => {
    test('should return the user with the given id', async () => {
      const { sut } = makeSut()
      const user = await makeUser()
      const userFound = await sut.getById(user.id)
      expect(userFound).toEqual(user)
    })

    test('should return null if the user does not not exists', async () => {
      const { sut } = makeSut()
      const userFound = await sut.getById(faker.datatype.uuid())
      expect(userFound).toBeNull()
    })
  })

  describe('getByUsername()', () => {
    test('should return the user with the given username', async () => {
      const { sut } = makeSut()
      const user = await makeUser()
      const userFound = await sut.getByUsername(user.username)
      expect(userFound).toEqual(user)
    })

    test('should return null if the user does not exists', async () => {
      const { sut } = makeSut()
      const userFound = await sut.getByUsername(faker.internet.userName())
      expect(userFound).toBeNull()
    });
  })
})
