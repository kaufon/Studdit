import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { EditQuestionUseCase } from "../edit-question";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;
describe("Get question by slug", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		);
	});
	it("should be able to edit question", async () => {
		const newQuestion = makeQuestion(
			{
				autorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
		);
		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId("2"),
			}),
		);
		await sut.execute({
			id: newQuestion.id.toString(),
			authorId: newQuestion.autorId.toString(),
			title: "new title",
			content: "new content",
			attachmentsIds: ["1", "3"],
		});
		expect(inMemoryQuestionsRepository.items[0].title).toEqual("new title");
		expect(inMemoryQuestionsRepository.items[0].content).toEqual("new content");
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
		]);
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
			title: "new title",
			content: "new content",
			attachmentsIds: ["1", "3"],
		});
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
