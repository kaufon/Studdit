import { Student } from "../../enterprise/entities/student";

export abstract class StudentsRepository {
	abstract findByEmail(id: string): Promise<Student | null>;
	abstract create(answer: Student): Promise<void>;
}
