import { CommentOnAnswerUseCase } from "../comment-on-answer";
import { InMemoryAnswerCommentRepository } from "test/repositorioes/in-memory-answer-comment-repository";
import { InMemoryAnswersRepository } from "test/repositorioes/in-answers-questions-repository";
import { makeAnswer } from "test/factories/make-answer";

describe("comment on question", () => {
	let inMememoryAnswerCommentRepository: InMemoryAnswerCommentRepository;
	let inMemoryAnswerRepository: InMemoryAnswersRepository;
	let sut: CommentOnAnswerUseCase;
	beforeEach(() => {
		inMemoryAnswerRepository = new InMemoryAnswersRepository();
		inMememoryAnswerCommentRepository = new InMemoryAnswerCommentRepository();
		sut = new CommentOnAnswerUseCase(
			inMemoryAnswerRepository,
			inMememoryAnswerCommentRepository,
		);
	});

	it("it should be able to comment on question", async () => {
		const answer = makeAnswer();
		await inMemoryAnswerRepository.create(answer);
		await sut.execute({
			answerId: answer.id.toString(),
			authorId: answer.authorId.toString(),
			content: "new comment",
		});
		expect(inMememoryAnswerCommentRepository.items[0].content).toEqual(
			"new comment",
		);
	});
});
