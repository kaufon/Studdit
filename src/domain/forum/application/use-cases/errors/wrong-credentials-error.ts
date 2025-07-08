
import { UseCaseError } from "@/core/errors/use-case-error";

export class WrongCredentialsError extends Error implements UseCaseError {
	constructor(identifier?: string) {
		super("Wrong credentials provided.");
	}
}
