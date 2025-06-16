import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionCommentRepository } from "test/repositorioes/in-memory-questions-comment-repository";
import { CommentOnQuestionUseCase } from "../comment-on-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";

describe("comment on question", () => {
	let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository;
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	let sut: CommentOnQuestionUseCase;
	beforeEach(() => {
		inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentRepository,
		);
	});

	it("it should be able to comment on question", async () => {
		const question = makeQuestion();
		await inMemoryQuestionsRepository.create(question);
		await sut.execute({
			questionId: question.id.toString(),
			authorId: question.autorId.toString(),
			content: "new comment",
		});
		expect(inMemoryQuestionCommentRepository.items[0].content).toEqual(
			"new comment",
		);
	});
});
