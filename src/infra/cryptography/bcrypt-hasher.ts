import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { compare, hash } from "bcryptjs";

export class BcryptHasher implements HashGenerator, HashComparer {
	private readonly HASH_SALT_LENGTH = 8;
	async compare(plainValue: string, hashedValue: string): Promise<boolean> {
		return compare(plainValue, hashedValue);
	}
	async hash(plain: string): Promise<string> {
		return hash(plain, this.HASH_SALT_LENGTH);
	}
}
