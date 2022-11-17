import { Account } from '@/domain/entities/account'

export interface UpdateAccountRepository {
  update: (
    accountData: UpdateAccountRepository.Params
  ) => Promise<UpdateAccountRepository.Result>
}

export namespace UpdateAccountRepository {
  export type Params = {
    id: string
    balance?: number
    currency?: string
  }
  export type Result = Account
}
