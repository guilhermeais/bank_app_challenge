import { User } from "../entities/user";
import { GetUserByUsername } from "../usecases/user";
import { faker } from '@faker-js/faker';
import { mockAccount } from "./mock-account";
import { AddAccountToUser } from "../usecases/account";

export function mockUser(): User {
  return {
    id: faker.datatype.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    account: mockAccount()
  }
}

export class UserMockBuilder {
  private user: User = mockUser();

  withoutId(): UserMockBuilder {
    delete this.user.id;
    return this;
  }

  withoutPassword (): UserMockBuilder {
    delete this.user.password;
    return this;
  }

  withoutAccount (): UserMockBuilder {
    delete this.user.account;
    return this;
  }

  build(): User {
    return this.user;
  }
}
export class GetUserByUsernameSpy implements GetUserByUsername {
  username: string;
  result: GetUserByUsername.Result = new UserMockBuilder().withoutPassword().build()

  async getByUsername(username: string): Promise<GetUserByUsername.Result> {
    this.username = username;
    return this.result;
  }
}

export class PasswordMockBuilder {
  private password: string = 'AAbaaf#a123456D'

  withInvalidLength(): PasswordMockBuilder {
    this.password = this.password.slice(0, 7)
    return this
  }

  withoutNumber(): PasswordMockBuilder {
    const passwordWithoutNumber = this.password.replace(/\d/g, '')
    this.password = passwordWithoutNumber
    return this
  }

  withoutUpperCase(): PasswordMockBuilder {
    const passwordWithoutUpperCase = this.password.replace(/[A-Z]/g, '')
    this.password = passwordWithoutUpperCase
    return this
  }

  build(): string {
    return this.password
  } 
}

export class AddAccountToUserSpy implements AddAccountToUser {
  params: AddAccountToUser.Params;
  result: AddAccountToUser.Result = new UserMockBuilder().withoutPassword().build();

  async add(params: AddAccountToUser.Params): Promise<AddAccountToUser.Result> {
    this.params = params;
    return this.result;
  }
}