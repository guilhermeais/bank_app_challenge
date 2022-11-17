import { GetTransactionsByUserIdRepositorySpy } from "@/data/tests/mock-transactions";
import { faker } from "@faker-js/faker";
import { describe, expect, test, vitest } from "vitest";
import { DbGetTransactionsByUserId } from "./db-get-transactions-by-user-id";

describe('DbGetTransactionsByUserId', () => {
  function makeSut() {
    const getTransactionsByUserIdRepositorySpy = new GetTransactionsByUserIdRepositorySpy()
    const sut = new DbGetTransactionsByUserId(
      getTransactionsByUserIdRepositorySpy
    )

    return {
      sut,
      getTransactionsByUserIdRepositorySpy
    }
  }
  test('should call getTransactionsByUserIdRepository with correct params', async () => {
    const { sut, getTransactionsByUserIdRepositorySpy } = makeSut()
    const params = {
      userId: faker.datatype.uuid(),
      date: faker.date.past(),
      only: faker.helpers.arrayElement(['in', 'out'] as const)
    }
    await sut.get(params)
    expect(getTransactionsByUserIdRepositorySpy.params).toEqual(params)
  });

  test('should return getTransactionsByUserIdRepository on success', async () => {
    const { sut, getTransactionsByUserIdRepositorySpy } = makeSut()
    const result = await sut.get({
      userId: faker.datatype.uuid(),
      date: faker.date.past(),
      only: faker.helpers.arrayElement(['in', 'out'] as const)
    })
    expect(result).toEqual(getTransactionsByUserIdRepositorySpy.result)
  });

  test('should throw fi getTransactionsByUserIdRepository throws', async () => {
    const { sut, getTransactionsByUserIdRepositorySpy } = makeSut()
    vitest.spyOn(getTransactionsByUserIdRepositorySpy, 'getByUserId').mockImplementationOnce(() => {
      throw new Error()
    })
    await expect(sut.get({
      userId: faker.datatype.uuid(),
      date: faker.date.past(),
      only: faker.helpers.arrayElement(['in', 'out'] as const)
    })).rejects.toThrow()
  });
});