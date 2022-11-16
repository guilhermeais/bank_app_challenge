import { AddAccountRepositorySpy } from "@/data/tests/mock-account";
import { faker } from "@faker-js/faker";
import { describe, expect, test, vitest } from "vitest";
import { DbAddAccount } from "./db-add-account";

describe('DbAddAccount usecase', () => {
  function makeSut() {
    const addAccountRepository = new AddAccountRepositorySpy()
    const sut = new DbAddAccount(addAccountRepository)
    return { sut, addAccountRepository }
  }

    test('should call addAccountRepository with correct params', async () => {
      const { sut, addAccountRepository } = makeSut()
      const params = {
        balance: faker.datatype.number({precision: 0.01})
      }

      await sut.add(params)

      expect(addAccountRepository.params).toEqual(params)
    });

    test('should return addAccountRepository result', async () => {
      const { sut, addAccountRepository } = makeSut()
      const result = await sut.add({
        balance: faker.datatype.number({precision: 0.01})
      })

      expect(result).toEqual(addAccountRepository.result)
    });

    test('should throw if addAccountRepository throws', async () => {
      const { sut, addAccountRepository } = makeSut()
      vitest.spyOn(addAccountRepository, 'add').mockRejectedValueOnce(new Error())

      const promise = sut.add({
        balance: faker.datatype.number({precision: 0.01})
      })

      await expect(promise).rejects.toThrow()
    });
});