import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Attachment as PrismaQuestionAttachment } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
	static toDomain(prismaQuestion: PrismaQuestionAttachment): QuestionAttachment {
    if(prismaQuestion.questionId === null){
      throw new Error("Question ID cannot be null");
    }
		return QuestionAttachment.create(
			{
				attachmentId: new UniqueEntityId(prismaQuestion.id),
				questionId: new UniqueEntityId(prismaQuestion.questionId),
			},
			new UniqueEntityId(prismaQuestion.id),
		);
	}
}
