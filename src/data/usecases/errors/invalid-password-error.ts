import { DomainError } from "./domain-errors";

export class InvalidPasswordError extends DomainError {
  constructor(reason: string) {
    super();
    this.name = `${super.name}::InvalidPasswordError`;
    this.message = `Invalid password: ${reason}`;
  }
}