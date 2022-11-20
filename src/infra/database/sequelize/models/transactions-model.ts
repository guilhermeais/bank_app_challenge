import { DataTypes, Model, Optional } from 'sequelize'
import { sequelizeConnection } from '../helpers/connection'
import AccountModel from './accounts-model'
interface TransactionAttributes {
  id: string
  value: number
  debitedAccountId: string
  creditedAccountId: string
  createdAt: Date
}

export interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, 'id'> {}

class TransactionModel
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string
  public value!: number
  public debitedAccountId!: string
  public creditedAccountId!: string
  public createdAt!: Date
}
TransactionModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  debitedAccountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id',
    }
  }, 
  creditedAccountId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'id',
    }
  }
}, {
  sequelize: sequelizeConnection,
  modelName: 'Transaction',
  tableName: 'transactions',
})

TransactionModel.belongsTo(AccountModel, { as: 'debitedAccount', foreignKey: 'debitedAccountId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
 TransactionModel.belongsTo(AccountModel, { as: 'creditedAccount', foreignKey: 'creditedAccountId', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
// AccountModel.hasMany(TransactionModel, { as: 'transactions', foreignKey: 'debitedAccountId' })
// AccountModel.hasMany(TransactionModel, { as: 'transactions', foreignKey: 'creditedAccountId' })
export default TransactionModel
