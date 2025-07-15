import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Question,
	type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objets/slug";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question.mapper";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class QuestionFactory {
	constructor(private prisma: PrismaService) {}
  async makePrismaQuestion(
		data: Partial<QuestionProps> = {},
	): Promise<Question> {
		const question = makeQuestion(data);

		await this.prisma.question.create({
			data: PrismaQuestionMapper.toPrisma(question),
		});

		return question;
	}
}
