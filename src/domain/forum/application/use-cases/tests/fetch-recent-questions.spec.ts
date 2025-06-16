import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objets/slug";
import { ListRecentQuestionsUseCase } from "../list-recent-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: ListRecentQuestionsUseCase;
describe("List recent questions", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository);
	});

	it("list questions", async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 20) }),
		);

		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 10) }),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2022, 0, 30) }),
		);
		const { value } = await sut.execute({
			page: 1,
		});
		expect(value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2022, 0, 30) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
			expect.objectContaining({ createdAt: new Date(2022, 0, 10) }),
		]);
	});
	it("test pagination on questions", async () => {
		for (let i = 0; i < 22; i++) {
			await inMemoryQuestionsRepository.create(makeQuestion());
		}
		const { value } = await sut.execute({
			page: 2,
		});
		expect(value?.questions).toHaveLength(2);
	});
});
