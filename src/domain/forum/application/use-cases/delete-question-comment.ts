import { Either, left, right } from "@/core/either";
import type { QuestionsCommentRepository } from "../repositories/question-comment-repository";
import { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface DeleteQuestionCommentUseCaseProps {
	authorId: string;
	questionCommentId: string;
}
type DeleteQuestionCommentUseCaseResponse = Either<UseCaseError, {}>;
export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentRepository: QuestionsCommentRepository) {}
	async execute({
		questionCommentId,
		authorId,
	}: DeleteQuestionCommentUseCaseProps): Promise<DeleteQuestionCommentUseCaseResponse> {
		const question =
			await this.questionCommentRepository.findById(questionCommentId);
		if (!question) {
			return left(new ResourceNotFoundError());
		}
		if (question.authorId.toString() !== authorId) {
			return left(new NotAllowedError());
		}
		await this.questionCommentRepository.delete(question);

		return right({});
	}
}
