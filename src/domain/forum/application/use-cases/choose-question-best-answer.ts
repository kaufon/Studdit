import { Either, left, right } from "@/core/either";
import type { Question } from "../../enterprise/entities/question";
import type { AnswerRepository } from "../repositories/answers-repository";
import type { QuestionsRepository } from "../repositories/questions-repository";
import type { UseCaseError } from "@/core/errors/use-case-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}
type ChooseQuestionBestAnswerUseCaseResponse = Either<
	UseCaseError,
	{
		question: Question;
	}
>;
export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private answerRepository: AnswerRepository,
		private questionsRepository: QuestionsRepository,
	) {}
	async execute({
		authorId,
		answerId,
	}: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answerRepository.findById(answerId);
		if (!answer) {
			return left(new ResourceNotFoundError());
		}
		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);
		if (!question) {
			return left(new ResourceNotFoundError());
		}
		if (authorId !== question.autorId.toString()) {
			return left(new NotAllowedError());
		}
		question.bestAnswerId = answer.id;
		await this.questionsRepository.save(question);
		return right({
			question,
		});
	}
}
