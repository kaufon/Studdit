import { type Either, left, right } from "@/core/either";
import type { AnswerRepository } from "../repositories/answers-repository";
import type { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

interface EditAnswerUseCaseRequest {
	id: string;
	authorId: string;
	content: string;
	attachmentsIds: string[];
}
type EditAnswerUseCaseResponse = Either<UseCaseError, {}>;
export class EditAnswerUseCase {
	constructor(
		private answersRepository: AnswerRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}
	async execute({
		id,
		authorId,
		content,
		attachmentsIds,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(id);
		if (!answer) {
			return left(new ResourceNotFoundError());
		}
		if (answer.authorId.toString() !== authorId) {
			return left(new NotAllowedError());
		}
		const currentAnswerAttachments =
			await this.answerAttachmentsRepository.findManyByAnswerId(
				answer.id.toString(),
			);
		const answerAttachmentList = new AnswerAttachmentList(
			currentAnswerAttachments,
		);
		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			});
		});
		answerAttachmentList.update(answerAttachments);

		answer.content = content;
		answer.attachments = answerAttachmentList;
		await this.answersRepository.save(answer);
		return right({});
	}
}
