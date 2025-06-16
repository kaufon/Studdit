import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { InMemoryQuestionCommentRepository } from "test/repositorioes/in-memory-questions-comment-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { DeleteQuestionCommentUseCase } from "../delete-question-comment";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";

describe("delete comment on question", () => {
	let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: DeleteQuestionCommentUseCase;
	beforeEach(() => {
		inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository);
	});

	it("it should be able to delete", async () => {
		const question = makeQuestionComment();
		await inMemoryQuestionCommentRepository.create(question);
		expect(inMemoryQuestionCommentRepository.items[0].content).toBeTruthy();
		await sut.execute({
			questionCommentId: question.id.toString(),
			authorId: question.authorId.toString(),
		});
		expect(inMemoryQuestionCommentRepository.items).toHaveLength(0);
	});
});
