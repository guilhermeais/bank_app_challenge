import { faker } from '@faker-js/faker'
import { Account } from '../entities/account'

export function mockAccount(): Account {
  return {
    id: faker.datatype.uuid(),
    balance: faker.datatype.number({ precision: 0.01 }),
  }
}
