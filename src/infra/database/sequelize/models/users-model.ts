import { DataTypes, ForeignKey, HasOne, Model, Optional } from 'sequelize'
import { sequelizeConnection } from '../helpers/connection'
import AccountModel from './accounts-model'
interface UserAttributes {
  id: string
  username: string
  password: string
  accountId: string
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string
  public username: string
  public password: string
  public accountId!: ForeignKey<AccountModel['id']>
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public account: HasOne<AccountModel>
}
UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountId: {
      type: DataTypes.UUID,
      references: {
        model: 'accounts',
        key: 'id',
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'User',
    tableName: 'users',
  }
)

export default UserModel
