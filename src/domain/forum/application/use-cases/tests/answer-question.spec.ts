import { InMemoryAnswersRepository } from "test/repositorioes/in-answers-questions-repository";
import { AnswerQuestionUseCase } from "../answer-question";
import type { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("Answer question", () => {
	let inMemoryAnswersRepository: InMemoryAnswersRepository;
	let answerQuestion: AnswerQuestionUseCase;
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		answerQuestion = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	it("should be able to answer a question", async () => {
		const answer = await answerQuestion.execute({
			questionId: "1",
			instructorId: "1",
			content: "Resposta maneira",
			attchmentsIds: ["1", "2"],
		});
		expect(answer).toBeTruthy();
		expect(inMemoryAnswersRepository.items[0].id).toEqual(
			answer.value?.answer.id,
		);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
				expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
			],
		);
	});
});
