import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { DeleteQuestionUseCase } from "../delete-question";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

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

	it("should be able to edit question", async () => {
		const newQuestion = makeQuestion(
			{
				autorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
		);
		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("attachment-1"),
			}),
		);
		inMemoryQuestionsRepository.create(newQuestion);
		await sut.execute({
			id: newQuestion.id.toString(),
			authorId: newQuestion.autorId.toString(),
		});
		expect(inMemoryQuestionsRepository.items.length).toEqual(0);
		expect(inMemoryQuestionAttachmentsRepository.items.length).toEqual(0);
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
			authorId: new UniqueEntityId("author-2").toString(),
		});
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
