import { DomainError } from "./domain-errors";

export class AuthenticationError extends DomainError {
  constructor(reason: string, statusCode = 401) {
    super();
    this.name = `${super.name}::AuthenticationError`;
    this.message = `Authentication Error: ${reason}`;
    this.statusCode = statusCode;
  }
}