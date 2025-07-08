import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objets/slug";
import { Prisma, Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionMapper {
	static toDomain(prismaQuestion: PrismaQuestion): Question {
		return Question.create(
			{
				title: prismaQuestion.title,
				content: prismaQuestion.content,
				autorId: new UniqueEntityId(prismaQuestion.authorId),
				bestAnswerId: prismaQuestion.bestAnswerId
					? new UniqueEntityId(prismaQuestion.bestAnswerId)
					: null,
				slug: Slug.create(prismaQuestion.slug),
				createdAt: prismaQuestion.createdAt,
				updatedAt: prismaQuestion.updatedAt,
			},
			new UniqueEntityId(prismaQuestion.id),
		);
	}

	static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
		return {
			id: question.id.toString(),
			authorId: question.autorId.toString(),
			bestAnswerId: question.bestAnswerId?.toString(),
			title: question.title,
			content: question.content,
			slug: question.slug.value,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}
