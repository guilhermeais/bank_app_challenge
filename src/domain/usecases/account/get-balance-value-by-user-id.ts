export interface GetBalanceValueByUserId {
  get: (params: GetBalanceValueByUserId.Params) => Promise<GetBalanceValueByUserId.Result>
}

export namespace GetBalanceValueByUserId {
  export type Params = {
    userId: string
  }

  export type Result = {
    balance: number
  }
}

