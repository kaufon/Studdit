import { Either, right } from "@/core/either";
import type { Answer } from "../../enterprise/entities/answer";
import type { AnswerRepository } from "../repositories/answers-repository";

interface ListQuestionAnswersUseCaseRequest {
	page: number;
	questionId: string;
}
type ListQuestionAnswersUseCaseResponse = Either<
	null,
	{
		answers: Answer[];
	}
>;
export class ListQuestionAnswersUseCase {
	constructor(private answersRepository: AnswerRepository) {}
	async execute({
		page,
		questionId,
	}: ListQuestionAnswersUseCaseRequest): Promise<ListQuestionAnswersUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			questionId,
			{ page },
		);
		return right({
			answers,
		});
	}
}
