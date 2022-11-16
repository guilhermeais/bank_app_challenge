import { AddUserRepositorySpy } from '@/data/tests/mock-user'
import { GetUserByUsernameSpy, mockUser, PasswordMockBuilder } from '@/domain/tests/mock-user'
import { faker } from '@faker-js/faker'
import { describe, expect, test, vitest } from 'vitest'
import { InvalidPasswordError } from '../errors/invalid-password-error'
import { InvalidUsernameError } from '../errors/invalid-username-error'
import { DbAddUser } from './db-add-account'

describe('DbAddUser usecase', () => {
  function makeSut() {
    const getUserByUsernameSpy = new GetUserByUsernameSpy()
    const addUserRepositorySpy = new AddUserRepositorySpy()
    const sut = new DbAddUser(getUserByUsernameSpy, addUserRepositorySpy)
    getUserByUsernameSpy.result = null
    return {
      sut,
      getUserByUsernameSpy,
      addUserRepositorySpy
    }
  }

  test('should throw InvalidUsernameError if username length is minor than 3', async () => {
    const { sut } = makeSut()
    const promise = sut.add({
      username: 'ab',
      password: faker.internet.password(),
    })

    await expect(promise).rejects.toThrow(
      new InvalidUsernameError('username must be at least 3 characters long')
    )
  })

  test('should throw InvalidUsernameError if getUseByUsername returns an user', async () => {
    const { sut, getUserByUsernameSpy } = makeSut()
    getUserByUsernameSpy.result = mockUser()
    const promise = sut.add({
      username: getUserByUsernameSpy.result.username,
      password: faker.internet.password(),
    })

    await expect(promise).rejects.toThrow(
      new InvalidUsernameError('username already exists')
    )
  });

  test('should throw if getUserByUsername throws', async () => {
    const { sut, getUserByUsernameSpy } = makeSut()
    vitest.spyOn(getUserByUsernameSpy, 'getByUsername').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add({
      username: faker.internet.userName(),
      password: faker.internet.password(),
    })

    await expect(promise).rejects.toThrow()
  });

  test('should throw if password length is minor than 8', async () => {
    const { sut } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const passwordWithInvalidLength = passwordMock.withInvalidLength().build()
    const promise = sut.add({
      username: faker.internet.userName(),
      password: passwordWithInvalidLength
    })

    await expect(promise).rejects.toThrow(
      new InvalidPasswordError('password must be at least 8 characters long')
    )
  });

  test('should throw if password does not contain a number', async () => {
    const { sut } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const passwordWithoutNumber = passwordMock.withoutNumber().build()
    const promise = sut.add({
      username: faker.internet.userName(),
      password: passwordWithoutNumber
    })

    await expect(promise).rejects.toThrow(
      new InvalidPasswordError('password must contain at least one number')
    )
  });

  test('should throw if password does not contain a uppercase letter', async () => {
    const { sut } = makeSut()
    const passwordMock = new PasswordMockBuilder()
    const passwordWithoutUppercaseLetter = passwordMock.withoutUpperCase().build()
    const promise = sut.add({
      username: faker.internet.userName(),
      password: passwordWithoutUppercaseLetter
    })

    await expect(promise).rejects.toThrow(
      new InvalidPasswordError('password must contain at least one uppercase letter')
    )
  });

  test('should call addUserRepository with correct params', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }
    await sut.add(params)

    expect(addUserRepositorySpy.params).toEqual(params)
  });

  test('should throw if addUserRepository throws', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    vitest.spyOn(addUserRepositorySpy, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.add({
      username: faker.internet.userName(),
      password: faker.internet.password(),
    })

    await expect(promise).rejects.toThrow()
  });

  test('should return addUserRepository result', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    const result = await sut.add({
      username: faker.internet.userName(),
      password: faker.internet.password(),
    })

    expect(result).toEqual(addUserRepositorySpy.result)
  });
})
