import { DomainError } from "./domain-errors";

export class TransactionError extends DomainError {
  constructor(reason: string) {
    super()
    this.name = `${super.name}::TransactionError`
    this.message = `Transaction error: ${reason}`
  }
}