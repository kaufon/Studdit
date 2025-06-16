import { Either, right } from "@/core/either";
import type { AnswerComment } from "../../enterprise/entities/answer-comment";
import type { AnswerCommentRepository } from "../repositories/answer-comment-repository";

interface ListQuestionAnswersUseCaseRequest {
	page: number;
	answerId: string;
}
type ListQuestionAnswersUseCaseResponse = Either<
	null,
	{
		answerComments: AnswerComment[];
	}
>;
export class ListAnswerCommentsUseCase {
	constructor(private questionCommentsRepository: AnswerCommentRepository) {}
	async execute({
		page,
		answerId,
	}: ListQuestionAnswersUseCaseRequest): Promise<ListQuestionAnswersUseCaseResponse> {
		const answerComments =
			await this.questionCommentsRepository.findManyByAnswerId(answerId, {
				page,
			});
		return right({
			answerComments,
		});
	}
}
