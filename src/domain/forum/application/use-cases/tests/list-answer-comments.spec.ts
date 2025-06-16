import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ListAnswerCommentsUseCase } from "../list-answer-comments";
import { InMemoryAnswerCommentRepository } from "test/repositorioes/in-memory-answer-comment-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";

let inMemoryCommentRepository: InMemoryAnswerCommentRepository;
let sut: ListAnswerCommentsUseCase;
describe("List  questions answers", () => {
	beforeEach(() => {
		inMemoryCommentRepository = new InMemoryAnswerCommentRepository();
		sut = new ListAnswerCommentsUseCase(inMemoryCommentRepository);
	});

	it("list answers", async () => {
		await inMemoryCommentRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryCommentRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryCommentRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId("question-1"),
			}),
		);
		const { value } = await sut.execute({
			answerId: "question-1",
			page: 1,
		});
		expect(value?.answerComments).toHaveLength(3);
	});
	it("test pagination on questions", async () => {
		for (let i = 0; i < 22; i++) {
			await inMemoryCommentRepository.create(
				makeAnswerComment({
					answerId: new UniqueEntityId("question-1"),
				}),
			);
		}
		const { value } = await sut.execute({
			answerId: "question-1",
			page: 2,
		});
		expect(value?.answerComments).toHaveLength(2);
	});
});
