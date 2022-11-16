import { Account } from "./account";

export type Transaction = {
  id: string;
  value: number;
  debitedAccount: Account;
  creditedAccount: Account;
  createdAt: Date;
}