import { UseCaseError } from "@/core/errors/use-case-error";

export class StudentWithSameEmailError extends Error implements UseCaseError {
	constructor(identifier?: string) {
		super("Student with same email already exists");
	}
}
