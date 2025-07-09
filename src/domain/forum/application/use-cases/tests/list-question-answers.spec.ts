import { ListQuestionAnswersUseCase } from "../list-question-answers";
import { InMemoryAnswersRepository } from "test/repositorioes/in-answers-questions-repository";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: ListQuestionAnswersUseCase;
describe("List  questions answers", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new ListQuestionAnswersUseCase(inMemoryAnswersRepository);
	});

	it("list answers", async () => {
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		const { value } = await sut.execute({
			questionId: "question-1",
			page: 1,
		});
		expect(value?.answers).toHaveLength(3);
	});
	it("test pagination on questions", async () => {
		for (let i = 0; i < 22; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({
					questionId: new UniqueEntityId("question-1"),
				}),
			);
		}
		const { value } = await sut.execute({
			questionId: "question-1",
			page: 2,
		});
		expect(value?.answers).toHaveLength(2);
	});
});
