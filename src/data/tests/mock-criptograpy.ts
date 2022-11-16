import { faker } from "@faker-js/faker"
import { Hasher } from "../protocols/criptography/hasher"

export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid()
  plaintext: string
  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.digest)
  }
}
