import { Account } from "./account";

export type User = {
  id: string;
  username: string;
  password: string;
  account: Account
}