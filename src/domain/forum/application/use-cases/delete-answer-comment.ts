import { type Either, left, right } from "@/core/either";
import type { AnswerCommentRepository } from "../repositories/answer-comment-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import type { UseCaseError } from "@/core/errors/use-case-error";

interface DeleteAnswerCommentUseCaseProps {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<UseCaseError, {}>;
export class DeleteAnswerCommentUseCase {
	constructor(private answeCommentRepository: AnswerCommentRepository) {}
	async execute({
		answerCommentId,
		authorId,
	}: DeleteAnswerCommentUseCaseProps): Promise<DeleteAnswerCommentUseCaseResponse> {
		const question =
			await this.answeCommentRepository.findById(answerCommentId);
		if (!question) {
			return left(new ResourceNotFoundError());
		}
		if (question.authorId.toString() !== authorId) {
			return left(new NotAllowedError());
		}
		await this.answeCommentRepository.delete(question);

		return right({});
	}
}
