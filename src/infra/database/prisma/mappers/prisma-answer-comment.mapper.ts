import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Prisma, Comment as PrismaAnswerComment } from "@prisma/client";

export class PrismaAnswerCommentMapper {
	static toDomain(prismaAnswer: PrismaAnswerComment): AnswerComment {
    if(prismaAnswer.answerId === null){
      throw new Error("Answer ID cannot be null");
    }
		return AnswerComment.create(
			{
				content: prismaAnswer.content,
				authorId: new UniqueEntityId(prismaAnswer.authorId),
				answerId: new UniqueEntityId(prismaAnswer.answerId),
				createdAt: prismaAnswer.createdAt,
				updatedAt: prismaAnswer.updatedAt,
			},
			new UniqueEntityId(prismaAnswer.id),
		);
	}

	static toPrisma(answer: AnswerComment): Prisma.CommentUncheckedCreateInput {
		return {
			id: answer.id.toString(),
			authorId: answer.authorId.toString(),
			answerId: answer.answerId.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		};
	}
}
