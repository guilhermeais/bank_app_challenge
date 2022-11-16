import { mockUser } from "@/domain/tests/mock-user";
import { AddUserRepository } from "../protocols/database/user/add-user-repository";

export class AddUserRepositorySpy implements AddUserRepository {
  params: AddUserRepository.Params;
  result = mockUser();

  async add(params: AddUserRepository.Params): Promise<AddUserRepository.Result> {
    this.params = params;
    return this.result;
  }
}