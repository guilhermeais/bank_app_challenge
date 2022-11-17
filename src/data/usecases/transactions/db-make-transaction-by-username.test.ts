import {
  GetUserByIdRepositorySpy,
  GetUserByUsernameRepositorySpy,
  MakeTransactionRepositorySpy,
} from '@/data/tests/mock-user'
import { mockMakeTransactionByUsernameParams } from '@/domain/tests/mock-transaction'
import { describe, expect, test } from 'vitest'
import { TransactionError } from '../errors/transaction-error'
import { DbMakeTransactionByUsername } from './db-make-transaction-by-username'

describe('DbMakeTransactionByUsername usecase', () => {
  function makeSut() {
    const getUserByUsernameRepositorySpy = new GetUserByUsernameRepositorySpy()
    const getUserByIdRepositorySpy = new GetUserByIdRepositorySpy()
    getUserByIdRepositorySpy.result.account.balance = 100
    const makeTransactionRepositorySpy = new MakeTransactionRepositorySpy()
    const sut = new DbMakeTransactionByUsername(
      getUserByUsernameRepositorySpy,
      getUserByIdRepositorySpy,
      makeTransactionRepositorySpy
    )

    return {
      sut,
      getUserByUsernameRepositorySpy,
      getUserByIdRepositorySpy,
      makeTransactionRepositorySpy,
    }
  }

  test('should throw TransactionError if the value is minor or equal to 0', async () => {
    const { sut } = makeSut()
    const transactionParamsWithZero = {
      ...mockMakeTransactionByUsernameParams(),
      value: 0,
    }
    const transactionParamsWithNegative = {
      ...mockMakeTransactionByUsernameParams(),
      value: -100,
    }

    await expect(sut.make(transactionParamsWithZero)).rejects.toThrow(
      new TransactionError('Transaction value must be greater than 0.')
    )
    await expect(sut.make(transactionParamsWithNegative)).rejects.toThrow(
      new TransactionError('Transaction value must be greater than 0.')
    )
  })

  test('should  call getUserByUsernameRepository with correct params', async () => {
    const { sut, getUserByUsernameRepositorySpy } = makeSut()
    const transactionParams = mockMakeTransactionByUsernameParams()
    transactionParams.value = 100
    await sut.make(transactionParams)

    expect(getUserByUsernameRepositorySpy.username).toBe(
      transactionParams.toUsername
    )
  });

  test('should throw TransactionError if the toUser does not exists', async () => {
    const { sut, getUserByUsernameRepositorySpy } = makeSut()
    getUserByUsernameRepositorySpy.result = null
    const transactionParams = mockMakeTransactionByUsernameParams()
    transactionParams.value = 100

    await expect(sut.make(transactionParams)).rejects.toThrow(
      new TransactionError('the user you are trying to send money to does not exist')
    )
  });

  test('should throw TransactionError if the toUser is the same of the fromUser', async () => {
    const { sut, getUserByUsernameRepositorySpy, getUserByIdRepositorySpy } = makeSut()
    const transactionParams = mockMakeTransactionByUsernameParams()
    transactionParams.value = 100
    getUserByUsernameRepositorySpy.result.id = transactionParams.fromUserId

    await expect(sut.make(transactionParams)).rejects.toThrow(
      new TransactionError('you cannot send money to yourself')
    )
  });

  test('should call getUserByIdRepository with correct id', async () => {
    const { sut, getUserByIdRepositorySpy } = makeSut()
    const transactionParams = mockMakeTransactionByUsernameParams()
    transactionParams.value = 100

    await sut.make(transactionParams)

    expect(getUserByIdRepositorySpy.id).toBe(transactionParams.fromUserId)
  });

  test('should throw TransactionError if the user that will send the money doest not have enough money ', async () => {
    const { sut, getUserByIdRepositorySpy } = makeSut()
    const transactionParams = mockMakeTransactionByUsernameParams()
    transactionParams.value = 100
    getUserByIdRepositorySpy.result.account.balance = 50

    await expect(sut.make(transactionParams)).rejects.toThrow(
      new TransactionError('you do not have enough money to make this transaction')
    )
  });

  test('should call makeTransactionRepository with correct params', async () => {
    const { sut, makeTransactionRepositorySpy, getUserByIdRepositorySpy, getUserByUsernameRepositorySpy } = makeSut()
    const transactionParams = mockMakeTransactionByUsernameParams()
    transactionParams.value = 100

    await sut.make(transactionParams)

    expect(makeTransactionRepositorySpy.params).toEqual({
      creditedUserId: getUserByUsernameRepositorySpy.result.id,
      debitedUserId: getUserByIdRepositorySpy.result.id,
      value: transactionParams.value,
    })
  });

  test('should return makeTransactionRepository result', async () => {
    const { sut, makeTransactionRepositorySpy } = makeSut()
    const transactionParams = mockMakeTransactionByUsernameParams()
    transactionParams.value = 100

    const result = await sut.make(transactionParams)

    expect(result).toEqual(makeTransactionRepositorySpy.result)
  });
})
