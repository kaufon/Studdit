import { InMemoryAnswersRepository } from "test/repositorioes/in-answers-questions-repository";
import type { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { ChooseQuestionBestAnswerUseCase } from "../choose-question-best-answer";
import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";

describe("Answer question", () => {
	let inMemoryAnswersRepository: InMemoryAnswersRepository;
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: ChooseQuestionBestAnswerUseCase;
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new ChooseQuestionBestAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryQuestionsRepository,
		);
	});

	it("should be able to answer a question", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});
		inMemoryQuestionsRepository.create(question);
		inMemoryAnswersRepository.create(answer);
		await sut.execute({
			authorId: question.autorId.toString(),
			answerId: answer.id.toString(),
		});
		expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
			answer.id,
		);
	});
	it("should not allow to pick best answer", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});
		inMemoryQuestionsRepository.create(question);
		inMemoryAnswersRepository.create(answer);
		const result = await sut.execute({
			authorId: "1233",
			answerId: answer.id.toString(),
		});
		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
