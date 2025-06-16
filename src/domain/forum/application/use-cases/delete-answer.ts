import { Either, left, right } from "@/core/either";
import type { AnswerRepository } from "../repositories/answers-repository";
import { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface DeleteAnswerUseCaseRequest {
	id: string;
	authorId: string;
}
type DeleteAnswerUseCaseResponse = Either<UseCaseError,{}>;
export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswerRepository) {}
	async execute({
		id,
		authorId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(id);
		if (!answer) {
			return left(new ResourceNotFoundError());
		}
		if (answer.authorId.toString() !== authorId) {
			return left(new NotAllowedError());
		}
		await this.answersRepository.delete(answer);
		return right({});
	}
}
