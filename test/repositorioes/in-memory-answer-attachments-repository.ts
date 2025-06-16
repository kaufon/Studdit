import type { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository
	implements AnswerAttachmentsRepository
{
	public items: AnswerAttachment[] = [];
	async findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]> {
		const questionAttachments = this.items.filter(
			(items) => items.answerId.toString() === questionId,
		);
		return questionAttachments;
	}
	async deleteManyByAnswerId(questionId: string): Promise<void> {
		const questionAttachment = this.items.filter(
			(item) => item.answerId.toString() !== questionId,
		);
		this.items = questionAttachment;
	}
}
