import { AddAccountToUserRepositorySpy } from "@/data/tests/mock-account";
import { faker } from "@faker-js/faker";
import { describe, expect, test, vitest } from "vitest";
import { DbAddAccountToUser } from "./db-add-account-to-user";

describe('DbAddAccountToUser usecase', () => {
  function makeSut() {
    const addAccountToUserRepository = new AddAccountToUserRepositorySpy()
    const sut = new DbAddAccountToUser(addAccountToUserRepository)
    return { sut, addAccountToUserRepository }
  }

    test('should call addAccountToUserRepository with correct params', async () => {
      const { sut, addAccountToUserRepository } = makeSut()
      const params = {
        balance: faker.datatype.number({precision: 0.01}),
        currency: faker.finance.currencyCode(),
        userId: faker.datatype.uuid()
      }

      await sut.add(params)

      expect(addAccountToUserRepository.params).toEqual(params)
    });

    test('should return addAccountToUserRepository result', async () => {
      const { sut, addAccountToUserRepository } = makeSut()
      const result = await sut.add({
        balance: faker.datatype.number({precision: 0.01}),
        currency: faker.finance.currencyCode(),
        userId: faker.datatype.uuid()
      })

      expect(result).toEqual(addAccountToUserRepository.result)
    });

    test('should throw if addAccountToUserRepository throws', async () => {
      const { sut, addAccountToUserRepository } = makeSut()
      vitest.spyOn(addAccountToUserRepository, addAccountToUserRepository.addAccountToUser.name as any).mockRejectedValueOnce(new Error())

      const promise = sut.add({
        balance: faker.datatype.number({precision: 0.01}),
        currency: faker.finance.currencyCode(),
        userId: faker.datatype.uuid()
      })

      await expect(promise).rejects.toThrow()
    });
});