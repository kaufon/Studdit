import { Either, left, right } from "@/core/either";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface DeleteQuestionUseCaseRequest {
	id: string;
	authorId: string;
}
type DeleteQuestionUseCaseResponse = Either<UseCaseError, {}>;
export class DeleteQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}
	async execute({
		id,
		authorId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(id);
		if (!question) {
			return left(new ResourceNotFoundError());
		}
		if (question.autorId.toString() !== authorId) {
			return left(new NotAllowedError());
		}
		await this.questionsRepository.delete(question);
		return right({});
	}
}
