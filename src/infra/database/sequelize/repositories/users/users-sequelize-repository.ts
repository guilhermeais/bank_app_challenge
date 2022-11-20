import { AddUserRepository } from "@/data/protocols/database/user/add-user-repository";
import { GetUserByIdRepository } from "@/data/protocols/database/user/get-user-by-id-repository";
import { AddUser } from "@/domain/usecases/user";
import UsersModel from '../../models/users-model'
export class UsersSequelizeRepository implements AddUserRepository, GetUserByIdRepository {
  async add (userData: AddUser.Params): Promise<AddUser.Result>{
    const user = await UsersModel.create(userData)

    return user.toJSON()
  };

  async getById (id: GetUserByIdRepository.Params): Promise<GetUserByIdRepository.Result> {
    const user = await UsersModel.findOne({
      where: { id },
      include: {
        all: true
      }
    })

    return user?.toJSON() as any || null
  }
}