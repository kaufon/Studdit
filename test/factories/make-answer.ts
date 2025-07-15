import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Answer,
	type AnswerProps,
} from "@/domain/forum/enterprise/entities/answer";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer.mapper";

export function makeAnswer(
	override: Partial<AnswerProps> = {},
	id?: UniqueEntityId,
) {
	const question = Answer.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
	return question;
}
@Injectable()
export class AnswerFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
		const answer = makeAnswer(data);

		await this.prisma.answer.create({
			data: PrismaAnswerMapper.toPrisma(answer),
		});

		return answer;
	}
}
