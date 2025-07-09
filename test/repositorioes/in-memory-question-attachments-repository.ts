import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[] = [];
	async findManyByQuestionId(
		questionId: string,
	): Promise<QuestionAttachment[]> {
		const questionAttachments = this.items.filter(
			(items) => items.questionId.toString() === questionId,
		);
		return questionAttachments;
	}
	async deleteManyByQuestionId(questionId: string): Promise<void> {
		const questionAttachment = this.items.filter(
			(item) => item.questionId.toString() !== questionId,
		);
		this.items = questionAttachment;
	}
}
