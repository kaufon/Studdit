import { Either, left, right } from "@/core/either";
import type { Question } from "../../enterprise/entities/question";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}
type GetQuestionBySlugUseCaseResponse = Either<
	UseCaseError,
	{
		question: Question;
	}
>;
export class GetQuestionBySlugUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}
	async execute({
		slug,
	}: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionsRepository.findBySlug(slug);
		if (!question) {
			return left(new ResourceNotFoundError());
		}
		return right({
			question,
		});
	}
}
