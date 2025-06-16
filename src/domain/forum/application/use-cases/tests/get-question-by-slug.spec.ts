import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "../get-question-by-slug";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objets/slug";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;
describe("Get question by slug", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});
	it("Get question", async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create("slug-test"),
		});
		inMemoryQuestionsRepository.create(newQuestion);
		const result = await sut.execute({
			slug: "slug-test",
		});
		if (result.isRight()) {
			const question = result.value.question;
			expect(question.id).toBeTruthy();
			expect(question.title).toEqual(newQuestion.title);
			expect(question.content).toEqual(newQuestion.content);
			expect(question.autorId).toEqual(newQuestion.autorId);
			expect(question.slug.value).toEqual("slug-test");
		}
	});
});
