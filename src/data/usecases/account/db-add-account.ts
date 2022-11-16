import { AddUserRepository } from '@/data/protocols/database/user/add-user-repository'
import { AddUser, GetUserByUsername } from '@/domain/usecases/user'
import { InvalidPasswordError } from '../errors/invalid-password-error'
import { InvalidUsernameError } from '../errors/invalid-username-error'

export class DbAddUser implements AddUser {
  constructor(private readonly getUserByUsername: GetUserByUsername, private readonly addUserRepository: AddUserRepository) {}
  async add(params: AddUser.Params): Promise<AddUser.Result> {
    const { username, password } = params
    if (username.length < 3) {
      throw new InvalidUsernameError(
        'username must be at least 3 characters long'
      )
    }

    const userExists = await this.getUserByUsername.getByUsername(username)
    if (userExists) {
      throw new InvalidUsernameError('username already exists')
    }

    if(password.length < 8) {
      throw new InvalidPasswordError(
        'password must be at least 8 characters long'
      )
    }

    const hasNumberRegex = /\d/
    const hasUpperCaseRegex = /[A-Z]/

    if(!hasNumberRegex.test(password)) {
      throw new InvalidPasswordError(
        'password must contain at least one number'
      )
    }

    if(!hasUpperCaseRegex.test(password)) {
      throw new InvalidPasswordError(
        'password must contain at least one uppercase letter'
      )
    }

    return this.addUserRepository.add({
      username,
      password
    })
  }
}
