import { type Either, right } from "@/core/either";
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id";
import { Answer } from "../../enterprise/entities/answer";
import type { AnswerRepository } from "../repositories/answers-repository";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";

interface AnswerQuestionUseCaseRequest {
	questionId: string;
	instructorId: string;
	content: string;
  attchmentsIds: string[];
}
type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
	constructor(private answerRepository: AnswerRepository) {}
	async execute({
		questionId,
		instructorId,
		content,
    attchmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			questionId: new UniqueEntityId(questionId),
			authorId: new UniqueEntityId(instructorId),
		});
		const answerAttachments = attchmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			});
		});
    answer.attachments = new AnswerAttachmentList(answerAttachments);

		await this.answerRepository.create(answer);
		return right({ answer });
	}
}
