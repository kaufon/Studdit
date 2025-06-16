import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {  AnswerAttachment, type AnswerAttachmentProps } from "@/domain/forum/enterprise/entities/answer-attachment";

export function makeAnswerAttachment(
	override: Partial<AnswerAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const question = AnswerAttachment.create(
		{
      answerId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
		},
		id,
	);
	return question;
}
