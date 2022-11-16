import { EncrypterSpy, HashComparerSpy } from '@/data/tests/mock-criptograpy'
import { GetUserByUsernameRepositorySpy } from '@/data/tests/mock-user'
import { faker } from '@faker-js/faker'
import { describe, expect, test, vitest } from 'vitest'
import { AuthenticationError } from '../errors/authentication-error'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication usecase', () => {
  function makeSut() {
    const getUserByUsernameRepositorySpy = new GetUserByUsernameRepositorySpy()
    const hashComparerSpy = new HashComparerSpy()
    const encrypterSpy = new EncrypterSpy()
    const sut = new DbAuthentication(
      getUserByUsernameRepositorySpy,
      hashComparerSpy,
      encrypterSpy
    )

    return {
      sut,
      getUserByUsernameRepositorySpy,
      hashComparerSpy,
      encrypterSpy,
    }
  }
  test('should call getUserByUsernameRepository with correct params', async () => {
    const { sut, getUserByUsernameRepositorySpy } = makeSut()
    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }
    await sut.authenticate(params)

    expect(getUserByUsernameRepositorySpy.username).toBe(params.username)
  })

  test('should throw if getUserByUserName throws', async () => {
    const { sut, getUserByUsernameRepositorySpy } = makeSut()
    vitest
      .spyOn(getUserByUsernameRepositorySpy, 'getByUsername')
      .mockRejectedValueOnce(new Error())

    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    await expect(sut.authenticate(params)).rejects.toThrow()
  });

  test('should throw AuthenticationError if user doest not exists', async () => {
    const { sut, getUserByUsernameRepositorySpy } = makeSut()
    getUserByUsernameRepositorySpy.result = null

    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    await expect(sut.authenticate(params)).rejects.toThrowError(
      new AuthenticationError('user not found', 404)
    )
  });

  test('should call hashComparer with correct params', async () => {
    const { sut, hashComparerSpy, getUserByUsernameRepositorySpy } = makeSut()
    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }
    await sut.authenticate(params)

    expect(hashComparerSpy.plaintext).toBe(params.password)
    expect(hashComparerSpy.digest).toBe(getUserByUsernameRepositorySpy.result.password)
  });

  test('should throw if hashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    vitest
      .spyOn(hashComparerSpy, 'compare')
      .mockRejectedValueOnce(new Error())

    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    await expect(sut.authenticate(params)).rejects.toThrow()
  })

  test('should throw AuthenticationError if password is not valid', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValid = false

    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    await expect(sut.authenticate(params)).rejects.toThrowError(
      new AuthenticationError('invalid password', 401)
    )
  });

  test('should call encrypter with correct params', async () => {
    const { sut, encrypterSpy, getUserByUsernameRepositorySpy } = makeSut()
    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }
    await sut.authenticate(params)

    expect(encrypterSpy.plaintext).toBe(getUserByUsernameRepositorySpy.result.id)
  })

  test('should throw if encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    vitest
      .spyOn(encrypterSpy, 'encrypt')
      .mockRejectedValueOnce(new Error())

    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }

    await expect(sut.authenticate(params)).rejects.toThrow()
  })

  test('should return a valid accessToken and the authenticated user', async () => {
    const { sut, encrypterSpy, getUserByUsernameRepositorySpy } = makeSut()
    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
    }
    const result = await sut.authenticate(params)

    expect(result).toEqual({
      accessToken: encrypterSpy.ciphertext,
      user: {
        id: getUserByUsernameRepositorySpy.result.id,
        username: getUserByUsernameRepositorySpy.result.username,
        account: getUserByUsernameRepositorySpy.result.account,
      },
    })
  });
})
