
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer"; 
import { Prisma, Answer as PrismaAnswer } from "@prisma/client";

export class PrismaAnswerMapper {
	static toDomain(prismaAnswer: PrismaAnswer): Answer {
		return Answer.create(
			{
				content: prismaAnswer.content,
				authorId: new UniqueEntityId(prismaAnswer.authorId),
        questionId: new UniqueEntityId(prismaAnswer.questionId),
				createdAt: prismaAnswer.createdAt,
				updatedAt: prismaAnswer.updatedAt,
			},
			new UniqueEntityId(prismaAnswer.id),
		);
	}

	static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
		return {
			id: answer.id.toString(),
			authorId: answer.authorId.toString(),
		  questionId: answer.questionId?.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		};
	}
}
