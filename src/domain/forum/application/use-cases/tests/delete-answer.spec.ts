import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objets/slug";
import { DeleteQuestionUseCase } from "../delete-question";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;
describe("Get question by slug", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
	});
	it("Get question", async () => {
		const newQuestion = makeQuestion(
			{
				autorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
		);
		inMemoryQuestionsRepository.create(newQuestion);
		await sut.execute({
			id: newQuestion.id.toString(),
			authorId: newQuestion.autorId.toString(),
		});
		expect(inMemoryQuestionsRepository.items.length).toEqual(0);
	});
	it("It should now allow to delete if not author", async () => {
		const newQuestion = makeQuestion(
			{
				autorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
		);
		inMemoryQuestionsRepository.create(newQuestion);
		const result = await sut.execute({
			id: newQuestion.id.toString(),
			authorId: "121312312",
		});
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
