import { InMemoryAnswersRepository } from "test/repositorioes/in-answers-questions-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { EditAnswerUseCase } from "../edit-answer";
import { NotAllowedError } from "../errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositorioes/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;
describe("Get question by slug", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		sut = new EditAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerAttachmentsRepository,
		);
	});
	it("should be able to edit question", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
		);
		inMemoryAnswersRepository.create(newAnswer);
		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId("1"),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId("2"),
			}),
		);
		await sut.execute({
			id: newAnswer.id.toString(),
			authorId: newAnswer.authorId.toString(),
			content: "new content",
			attachmentsIds: ["1", "3"],
		});

		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
				expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
			],
		);
		expect(inMemoryAnswersRepository.items[0].content).toEqual("new content");
	});
	it("It should now allow to delete if not author", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId("question-1"),
		);
		inMemoryAnswersRepository.create(newAnswer);
		const result = await sut.execute({
			id: newAnswer.id.toString(),
			authorId: new UniqueEntityId("author-2").toString(),
			content: "new content",
			attachmentsIds: [],
		});
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
