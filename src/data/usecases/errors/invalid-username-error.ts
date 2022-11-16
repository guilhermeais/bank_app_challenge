import { DomainError } from "./domain-errors";

export class InvalidUsernameError extends DomainError {
  constructor(reason: string) {
    super();
    this.name = `${super.name}::InvalidUsernameError`;
    this.message = `Invalid username: ${reason}`;
  }
}