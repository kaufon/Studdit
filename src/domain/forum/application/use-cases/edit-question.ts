import { type Either, left, right } from "@/core/either";
import type { QuestionsRepository } from "../repositories/questions-repository";
import type { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import type { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface EditQuestionUseCaseRequest {
	id: string;
	authorId: string;
	content: string;
	title: string;
	attachmentsIds: string[];
}
type EditQuestionUseCaseResponse = Either<UseCaseError, {}>;
export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentRepository: QuestionAttachmentsRepository,
	) {}
	async execute({
		id,
		authorId,
		content,
		title,
		attachmentsIds,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(id);
		if (!question) {
			return left(new ResourceNotFoundError());
		}
		if (question.autorId.toString() !== authorId) {
			return left(new NotAllowedError());
		}
		const currentQuestionAttachments =
			await this.questionAttachmentRepository.findManyByQuestionId(
				question.id.toString(),
			);
		const questionAttachmentList = new QuestionAttachmentList(
			currentQuestionAttachments,
		);
		const questionAttachments = attachmentsIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			});
		});
		questionAttachmentList.update(questionAttachments);
		question.title = title;
		question.content = content;
		question.attachments = questionAttachmentList;
		await this.questionsRepository.save(question);
		return right({});
	}
}
