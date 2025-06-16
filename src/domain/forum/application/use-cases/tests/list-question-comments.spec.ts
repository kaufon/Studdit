import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ListQuestionCommentsUseCase } from "../list-question-comments";
import { InMemoryQuestionCommentRepository } from "test/repositorioes/in-memory-questions-comment-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryCommentRepository: InMemoryQuestionCommentRepository;
let sut: ListQuestionCommentsUseCase;
describe("List  questions answers", () => {
	beforeEach(() => {
		inMemoryCommentRepository = new InMemoryQuestionCommentRepository();
		sut = new ListQuestionCommentsUseCase(inMemoryCommentRepository);
	});

	it("list answers", async () => {
		await inMemoryCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		await inMemoryCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId("question-1"),
			}),
		);
		const { value } = await sut.execute({
			questionId: "question-1",
			page: 1,
		});
		expect(value?.questionComments).toHaveLength(3);
	});
	it("test pagination on questions", async () => {
		for (let i = 0; i < 22; i++) {
			await inMemoryCommentRepository.create(
				makeQuestionComment({
					questionId: new UniqueEntityId("question-1"),
				}),
			);
		}
		const { value } = await sut.execute({
			questionId: "question-1",
			page: 2,
		});
		expect(value?.questionComments).toHaveLength(2);
	});
});
