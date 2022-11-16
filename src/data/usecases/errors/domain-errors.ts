export class DomainError extends Error {
  constructor() {
    super()
    this.name = 'DomainError'
  }
}