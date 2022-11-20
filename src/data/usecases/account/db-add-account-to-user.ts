import { AddAccountToUserRepository } from "@/data/protocols/database/account/add-account-to-user-repository";
import { AddAccountToUser } from "@/domain/usecases/account";

export class DbAddAccountToUser implements AddAccountToUser {
  constructor(
    private readonly addAccountToUserRepository: AddAccountToUserRepository,
  ) {}
  async add(params: AddAccountToUser.Params): Promise<AddAccountToUser.Result> {
    const account = await this.addAccountToUserRepository.addAccountToUser(params);
    return account;
  }
}