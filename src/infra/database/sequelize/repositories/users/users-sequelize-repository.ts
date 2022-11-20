import { AddUserRepository } from "@/data/protocols/database/user/add-user-repository";
import { AddUser } from "@/domain/usecases/user";
import UsersModel from '../../models/users-model'
export class UsersSequelizeRepository implements AddUserRepository {
  async add (userData: AddUser.Params): Promise<AddUser.Result>{
    const user = await UsersModel.create(userData)

    return user.toJSON()
  };
}