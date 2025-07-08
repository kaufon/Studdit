import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
	async compare(plainValue: string, hashedValue: string): Promise<boolean> {
		return plainValue.concat("-hashed") === hashedValue;
	}
	async hash(plain: string): Promise<string> {
		return plain.concat("-hashed");
	}
}
