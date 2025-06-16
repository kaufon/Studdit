import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { QuestionAttachment, type QuestionAttachmentProps } from "@/domain/forum/enterprise/entities/question-attachment";

export function makeQuestionAttachment(
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const question = QuestionAttachment.create(
		{
      questionId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
		},
		id,
	);
	return question;
}
