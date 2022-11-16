import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { GetUserByUsernameRepository } from '@/data/protocols/database/user/get-user-by-username-repository'
import { Authentication } from '@/domain/usecases/user'
import { AuthenticationError } from '../errors/authentication-error'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly getUserByUsernameRepository: GetUserByUsernameRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}
  async authenticate(
    authentication: Authentication.Params
  ): Promise<Authentication.Result> {
    const user = await this.getUserByUsernameRepository.getByUsername(
      authentication.username
    )
    if (!user) {
      throw new AuthenticationError('user not found', 404)
    }

    const isValidPassword = await this.hashComparer.compare(
      authentication.password, 
      user.password,
    )
    if (!isValidPassword) {
      throw new AuthenticationError('invalid password', 401)
    }

    const accessToken = await this.encrypter.encrypt(user.id)
    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        account: user.account,
      },
    }
  }
}
