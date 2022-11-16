import { AddAccountRepository } from "@/data/protocols/database/account/add-account-repository";
import { AddAccount } from "@/domain/usecases/account";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
  ) {}
  async add(params: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.addAccountRepository.add(params);
    return account;
  }
}