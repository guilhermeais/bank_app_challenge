export class DomainError extends Error {
  statusCode: number
  constructor() {
    super()
    this.statusCode = 400
    this.name = 'DomainError'
  }
}