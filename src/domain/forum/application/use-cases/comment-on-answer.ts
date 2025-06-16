import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import type { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import type { AnswerRepository } from "../repositories/answers-repository";
import { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CommentOnAnswerUseCaseProps {
	authorId: string;
	content: string;
	answerId: string;
}
type CommentOnAnswerUseCaseResponse = Either<
	UseCaseError,
	{ answerComment: AnswerComment }
>;
export class CommentOnAnswerUseCase {
	constructor(
		private answerRepository: AnswerRepository,
		private answerCommentRepository: AnswerCommentRepository,
	) {}
	async execute({
		answerId,
		authorId,
		content,
	}: CommentOnAnswerUseCaseProps): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);
		if (!answer) {
			return left(new ResourceNotFoundError());
		}
		const answerComment = AnswerComment.create({
			content,
			answerId: new UniqueEntityId(answerId),
			authorId: new UniqueEntityId(authorId),
		});
		await this.answerCommentRepository.create(answerComment);
		return right({ answerComment });
	}
}
