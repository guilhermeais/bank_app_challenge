import { HasherSpy } from '@/data/tests/mock-criptograpy'
import {
  AddUserRepositorySpy,
  GetUserByUsernameRepositorySpy,
} from '@/data/tests/mock-user'
import { AddAccountToUserSpy, mockUser, PasswordMockBuilder } from '@/domain/tests/mock-user'
import { faker } from '@faker-js/faker'
import { describe, expect, test, vitest } from 'vitest'
import { InvalidPasswordError } from '../errors/invalid-password-error'
import { InvalidUsernameError } from '../errors/invalid-username-error'
import { DbAddUser } from './db-add-user'

describe('DbAddUser usecase', () => {
  function makeSut() {
    const getUserByUsernameRepositorySpy = new GetUserByUsernameRepositorySpy()
    const addUserRepositorySpy = new AddUserRepositorySpy()
    const addAccountToUserSpy = new AddAccountToUserSpy()
    const hasherSpy = new HasherSpy()
    const sut = new DbAddUser(
      getUserByUsernameRepositorySpy,
      hasherSpy,
      addUserRepositorySpy,
      addAccountToUserSpy
    )
    getUserByUsernameRepositorySpy.result = null
    return {
      sut,
      getUserByUsernameRepositorySpy,
      hasherSpy,
      addUserRepositorySpy,
      addAccountToUserSpy
    }
  }

  test('should throw InvalidUsernameError if username length is minor than 3', async () => {
    const { sut } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    const promise = sut.add({
      username: 'ab',
      password,
    })

    await expect(promise).rejects.toThrow(
      new InvalidUsernameError('username must be at least 3 characters long')
    )
  })

  test('should throw InvalidUsernameError if getUserByUsernameRepository returns an user', async () => {
    const { sut, getUserByUsernameRepositorySpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    getUserByUsernameRepositorySpy.result = mockUser()
    const promise = sut.add({
      username: getUserByUsernameRepositorySpy.result.username,
      password,
    })

    await expect(promise).rejects.toThrow(
      new InvalidUsernameError('username already exists')
    )
  })

  test('should throw if getUserByUsername throws', async () => {
    const { sut, getUserByUsernameRepositorySpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    vitest
      .spyOn(getUserByUsernameRepositorySpy, 'getByUsername')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.add({
      username: faker.internet.userName(),
      password,
    })

    await expect(promise).rejects.toThrow()
  })

  test('should throw if password length is minor than 8', async () => {
    const { sut } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const passwordWithInvalidLength = passwordMock.withInvalidLength().build()
    const promise = sut.add({
      username: faker.internet.userName(),
      password: passwordWithInvalidLength,
    })

    await expect(promise).rejects.toThrow(
      new InvalidPasswordError('password must be at least 8 characters long')
    )
  })

  test('should throw if password does not contain a number', async () => {
    const { sut } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const passwordWithoutNumber = passwordMock.withoutNumber().build()
    const promise = sut.add({
      username: faker.internet.userName(),
      password: passwordWithoutNumber,
    })

    await expect(promise).rejects.toThrow(
      new InvalidPasswordError('password must contain at least one number')
    )
  })

  test('should throw if password does not contain a uppercase letter', async () => {
    const { sut } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const passwordWithoutUppercaseLetter = passwordMock
      .withoutUpperCase()
      .build()
    const promise = sut.add({
      username: faker.internet.userName(),
      password: passwordWithoutUppercaseLetter,
    })

    await expect(promise).rejects.toThrow(
      new InvalidPasswordError(
        'password must contain at least one uppercase letter'
      )
    )
  })

  test('should call hasher with correct params', async () => {
    const { sut, hasherSpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    await sut.add({
      username: faker.internet.userName(),
      password,
    })

    expect(hasherSpy.plaintext).toBe(password)
  });

  test('should throw if hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    vitest
      .spyOn(hasherSpy, 'hash')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const promise = sut.add({
      username: faker.internet.userName(),
      password,
    })

    await expect(promise).rejects.toThrow()
  });

  test('should call addUserRepository with correct params', async () => {
    const { sut, addUserRepositorySpy, hasherSpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    const params = {
      username: faker.internet.userName(),
      password,
    }
    await sut.add(params)

    const expectedParams = {
      username: params.username,
      password: hasherSpy.digest,
    }

    expect(addUserRepositorySpy.params).toEqual(expectedParams)
  })

  test('should throw if addUserRepository throws', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    vitest.spyOn(addUserRepositorySpy, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add({
      username: faker.internet.userName(),
      password,
    })

    await expect(promise).rejects.toThrow()
  })

 test('should call addAccountToUser with correct params', async () => {
    const { sut, addAccountToUserSpy, addUserRepositorySpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    const params = {
      username: faker.internet.userName(),
      password,
    }
    await sut.add(params)

    const expectedParams = {
      userId: addUserRepositorySpy.result.id,
      balance: 100,
      currency: 'BRL'
    }

    expect(addAccountToUserSpy.params).toEqual(expectedParams)
 });

 test('should return addAccountToUser result', async () => {
    const { sut, addAccountToUserSpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    const params = {
      username: faker.internet.userName(),
      password,
    }
    const result = await sut.add(params)

    expect(result).toEqual(addAccountToUserSpy.result)
 });

 test('should throw if addAccountToUser throws', async () => {
    const { sut, addAccountToUserSpy } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const password = passwordMock.build()
    vitest.spyOn(addAccountToUserSpy, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add({
      username: faker.internet.userName(),
      password,
    })

    await expect(promise).rejects.toThrow()
 });
})
