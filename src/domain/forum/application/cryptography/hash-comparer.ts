export abstract class HashComparer {
	abstract compare(plainValue: string, hashedValue: string): Promise<boolean>;
}
