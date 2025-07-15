import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment"; 
import { Prisma, Comment as PrismaQuestionComment } from "@prisma/client";

export class PrismaQuestionCommentMapper {
	static toDomain(prismaQuestion: PrismaQuestionComment): QuestionComment {
    if(prismaQuestion.questionId === null){
      throw new Error("Question ID cannot be null");
    }
		return QuestionComment.create(
			{
				content: prismaQuestion.content,
				authorId: new UniqueEntityId(prismaQuestion.authorId),
				questionId: new UniqueEntityId(prismaQuestion.questionId),
				createdAt: prismaQuestion.createdAt,
				updatedAt: prismaQuestion.updatedAt,
			},
			new UniqueEntityId(prismaQuestion.id),
		);
	}

	static toPrisma(question: QuestionComment): Prisma.CommentUncheckedCreateInput {
		return {
			id: question.id.toString(),
			authorId: question.authorId.toString(),
			questionId: question.questionId.toString(),
			content: question.content,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}
