import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Student,
	StudentProps,
} from "@/domain/forum/enterprise/entities/student";

export function makeStudent(
	override: Partial<StudentProps> = {},
	id?: UniqueEntityId,
) {
	const question = Student.create(
		{
			name: faker.person.firstName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id,
	);
	return question;
}
