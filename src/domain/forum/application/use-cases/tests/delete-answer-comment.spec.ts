import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { DeleteAnswerCommentUseCase } from "../delete-answer-comment";
import { InMemoryAnswerCommentRepository } from "test/repositorioes/in-memory-answer-comment-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";

describe("delete comment on question", () => {
	let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
	let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
	let sut: DeleteAnswerCommentUseCase;
	let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);

		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository);
	});

	it("it should be able to delete", async () => {
		const question = makeAnswerComment();
		await inMemoryAnswerCommentRepository.create(question);
		expect(inMemoryAnswerCommentRepository.items[0].content).toBeTruthy();
		await sut.execute({
			answerCommentId: question.id.toString(),
			authorId: question.authorId.toString(),
		});
		expect(inMemoryAnswerCommentRepository.items).toHaveLength(0);
	});
	it("should not allow to delete", async () => {
		const question = makeAnswerComment({ authorId: new UniqueEntityId("1") });
		await inMemoryAnswerCommentRepository.create(question);
		const result = await sut.execute({
			answerCommentId: question.id.toString(),
			authorId: "2",
		});
		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
