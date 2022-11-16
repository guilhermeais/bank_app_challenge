import { mockAccount } from "@/domain/tests/mock-account";
import { AddAccountRepository } from "../protocols/database/account/add-account-repository";

export class AddAccountRepositorySpy implements AddAccountRepository {
  params: AddAccountRepository.Params;
  result = mockAccount();

  async add(params: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.params = params;
    return Promise.resolve(this.result);
  }
}