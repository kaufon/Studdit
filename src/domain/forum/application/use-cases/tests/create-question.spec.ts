import { CreateQuestionUseCase } from "../create-question";
import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let createQuestion: CreateQuestionUseCase;
describe("Create question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		createQuestion = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});
	it("create a question", async () => {
		const question = await createQuestion.execute({
			title: "1",
			authorId: "1",
			content: "Resposta maneira",
			atacchmentsIds: ["1", "2"],
		});
		expect(question.value?.question.id).toBeTruthy();
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
		]);
	});
});
