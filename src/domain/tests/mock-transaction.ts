import { faker } from "@faker-js/faker";
import { MakeTransactionByUsername } from "../usecases/transactions";

export function mockMakeTransactionByUsernameParams(): MakeTransactionByUsername.Params {
  return {
    fromUserId: faker.datatype.uuid(),
    toUsername: faker.internet.userName(),
    value: faker.datatype.number()
  }
}