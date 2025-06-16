import { Either, right } from "@/core/either";
import type { QuestionComment } from "../../enterprise/entities/question-comment";
import type { QuestionsCommentRepository } from "../repositories/question-comment-repository";

interface ListQuestionAnswersUseCaseRequest {
	page: number;
	questionId: string;
}
type ListQuestionAnswersUseCaseResponse = Either<null, {
	questionComments: QuestionComment[];
}>
export class ListQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionsCommentRepository) {}
	async execute({
		page,
		questionId,
	}: ListQuestionAnswersUseCaseRequest): Promise<ListQuestionAnswersUseCaseResponse> {
		const questionComments =
			await this.questionCommentsRepository.findManyByQuestionId(questionId, {
				page,
			});
		return right({
			questionComments,
		});
	}
}
