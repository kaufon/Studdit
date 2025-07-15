import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Attachment as PrismaAnswerAttachment } from "@prisma/client";

export class PrismaAnswerAttachmentMapper {
	static toDomain(prismaAnswer: PrismaAnswerAttachment): AnswerAttachment {
		if (prismaAnswer.answerId === null) {
			throw new Error("Answer ID cannot be null");
		}
		return AnswerAttachment.create(
			{
				attachmentId: new UniqueEntityId(prismaAnswer.id),
				answerId: new UniqueEntityId(prismaAnswer.answerId),
			},
			new UniqueEntityId(prismaAnswer.id),
		);
	}
}
