import { type Either, right } from "@/core/either";
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";

interface AnswerQuestionUseCaseRequest {
	title: string;
	authorId: string;
	content: string;
	atacchmentsIds: string[];
}
type AnswerQuestionUseCaseResponse = Either<null, { question: Question }>;
export class CreateQuestionUseCase {
	constructor(private answerRepository: QuestionsRepository) {}
	async execute({
		title,
		authorId,
		content,
		atacchmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const question = Question.create({
			content,
			title,
			autorId: new UniqueEntityId(authorId),
		});
		const questionAttachments = atacchmentsIds.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			});
		});
		question.attachments = new QuestionAttachmentList(questionAttachments);
		await this.answerRepository.create(question);
		return right({
			question,
		});
	}
}
