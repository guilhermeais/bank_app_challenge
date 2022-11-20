import { DataTypes, Model, Optional } from 'sequelize'
import { sequelizeConnection } from '../helpers/connection'
import UserModel from './users-model'

interface AccountAttributes {
  id: string
  balance: number
  currency: string
}

export interface AccountCreationAttributes
  extends Optional<AccountAttributes, 'id'> {}

class AccountModel
  extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes
{
  public id!: string
  public balance: number
  public currency!: string
}
 AccountModel.init(
  {
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'Account',
    tableName: 'accounts',
  }
)
AccountModel.belongsTo(UserModel, { as: 'user', foreignKey: 'userId' })
UserModel.hasOne(AccountModel, { as: 'account', foreignKey: 'userId' })

export default AccountModel


