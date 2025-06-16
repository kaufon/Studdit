import { type Either, left, right } from "@/core/either";
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import type { QuestionsCommentRepository } from "../repositories/question-comment-repository";
import type { QuestionsRepository } from "../repositories/questions-repository";
import type { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import type { Question } from "../../enterprise/entities/question";

interface CommentOnQuestionUseCaseProps {
	authorId: string;
	content: string;
	questionId: string;
}
type CommentOnQuestionUseCaseResponse = Either<
	UseCaseError,
	{ question: Question }
>;
export class CommentOnQuestionUseCase {
	constructor(
		private questionRepository: QuestionsRepository,
		private questionCommentRepository: QuestionsCommentRepository,
	) {}
	async execute({
		questionId,
		authorId,
		content,
	}: CommentOnQuestionUseCaseProps): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionRepository.findById(questionId);
		if (!question) {
			return left(new ResourceNotFoundError());
		}
		const questionComment = QuestionComment.create({
			content,
			questionId: new UniqueEntityId(questionId),
			authorId: new UniqueEntityId(authorId),
		});
		await this.questionCommentRepository.create(questionComment);
		return right({
			question,
		});
	}
}
