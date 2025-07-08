import { type Either, left, right } from "@/core/either";
import { StudentsRepository } from "../repositories/students-repository";
import { Student } from "../../enterprise/entities/student";
import { HashGenerator } from "../cryptography/hash-generator";
import { UseCaseError } from "@/core/errors/use-case-error";
import { StudentWithSameEmailError } from "./errors/student-with-same-email-error";

interface RegisterStudentUseCaseRequest {
	name: string;
	email: string;
	password: string;
}
type RegisterStudentUseCaseResponse = Either<
	UseCaseError,
	{ student: Student }
>;
export class RegisterStudentUseCase {
	constructor(
		private studentRepository: StudentsRepository,
		private hashGenerator: HashGenerator,
	) {}
	async execute({
		name,
		email,
		password,
	}: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
		const userWithSameEmail = await this.studentRepository.findByEmail(email);
		if (userWithSameEmail) {
			return left(new StudentWithSameEmailError());
		}
		const hashedPassword = await this.hashGenerator.hash(password);
		const student = Student.create({
			name: name,
			email: email,
			password: hashedPassword,
		});
		await this.studentRepository.create(student);
		return right({
			student: student,
		});
	}
}
