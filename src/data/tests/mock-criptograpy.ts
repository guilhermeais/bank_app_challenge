import { faker } from "@faker-js/faker"
import { Encrypter } from "../protocols/criptography/encrypter"
import { HashComparer } from "../protocols/criptography/hash-comparer"
import { Hasher } from "../protocols/criptography/hasher"

export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid()
  plaintext: string
  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.digest)
  }
}

export class HashComparerSpy implements HashComparer {
  digest: string
  plaintext: string
  isValid = true
  async compare (plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest
    return await Promise.resolve(this.isValid)
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.datatype.uuid()
  plaintext: string
  async encrypt (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return await Promise.resolve(this.ciphertext)
  }
}