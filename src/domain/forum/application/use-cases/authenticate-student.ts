import { type Either, left, right } from "@/core/either";
import { StudentsRepository } from "../repositories/students-repository";
import { UseCaseError } from "@/core/errors/use-case-error";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

interface AuthenticateStudentUseCaseRequest {
	email: string;
	password: string;
}
type AuthenticateStudentUseCaseResponse = Either<
	UseCaseError,
	{ acessToken: string }
>;
export class AuthenticateStudentUseCase {
	constructor(
		private studentRepository: StudentsRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}
	async execute({
		email,
		password,
	}: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
		const student = await this.studentRepository.findByEmail(email);
		if (!student) {
			return left(new WrongCredentialsError());
		}
		const isPasswordValid = await this.hashComparer.compare(
			password,
			student.password,
		);
		if (!isPasswordValid) {
			return left(new WrongCredentialsError());
		}
		const acessToken = await this.encrypter.encrypt({
			sub: student.id.toString(),
		});
		return right({
			acessToken: acessToken,
		});
	}
}
