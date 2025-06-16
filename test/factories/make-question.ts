import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Question,
	type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objets/slug";

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityId,
) {
	const question = Question.create(
		{
			title: faker.lorem.sentence(5),
			autorId: new UniqueEntityId(),
			content: faker.lorem.text(),
			slug: Slug.create("slug-test"),
			...override,
		},
		id,
	);
	return question;
}
