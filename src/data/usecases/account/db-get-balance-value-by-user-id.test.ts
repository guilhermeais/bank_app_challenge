import { GetBalanceValueByUserIdRepositorySpy } from "@/data/tests/mock-account";
import { faker } from "@faker-js/faker";
import { describe, expect, test, vitest } from "vitest";
import { DbGetBalanceValueByUserId } from "./db-get-balance-value-by-user-id";

describe('DbGetBalanceValueByUserId usecase', () => {
  function makeSut() {
    const getBalanceValueByUserIdRepositorySpy = new GetBalanceValueByUserIdRepositorySpy()
    const sut = new DbGetBalanceValueByUserId(
      getBalanceValueByUserIdRepositorySpy
    )

    return {
      sut,
      getBalanceValueByUserIdRepositorySpy
    }
  }

  test('should call getBalanceValueByUserIdRepository with correct userId', async () => {
    const { sut, getBalanceValueByUserIdRepositorySpy } = makeSut()
    const userId = faker.datatype.uuid()
    await sut.get({ userId })
    expect(getBalanceValueByUserIdRepositorySpy.userId).toBe(userId)
  });

  test('should throw fi getBalanceValueByUserIdRepositorySpy throws', async () => {
    const { sut, getBalanceValueByUserIdRepositorySpy } = makeSut()
    vitest.spyOn(getBalanceValueByUserIdRepositorySpy, 'getByUserId').mockImplementationOnce(() => {
      throw new Error()
    })
    const userId = faker.datatype.uuid()
    const promise = sut.get({ userId })
    await expect(promise).rejects.toThrow()
  });

  test('should return getBalanceValueByUserId result', async () => {
    const { sut, getBalanceValueByUserIdRepositorySpy } = makeSut()
    const userId = faker.datatype.uuid()
    const result = await sut.get({ userId })
    expect(result).toEqual(getBalanceValueByUserIdRepositorySpy.result)
  });
});