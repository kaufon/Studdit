import { InMemoryAnswersRepository } from "test/repositorioes/in-answers-questions-repository";
import { OnAnswerCreated } from "../on-answer-created";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { SendNotificationUseCase } from "../../use-cases/send-notification";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";
import { InMemoryNotificationsRepository } from "test/repositorioes/in-memory-notifications-repository";
import { makeQuestion } from "test/factories/make-question";
import { waitFor } from "test/utils/wait-for";
let inMemoryquestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationExecuteSpy: ReturnType<typeof vi.spyOn>;
describe("On Answer Created", () => {
	beforeEach(async () => {
		inMemoryquestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryquestionAttachmentsRepository,
		);
		inMemoryAnswerRepository = new InMemoryAnswersRepository();
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		);
		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");
		new OnAnswerCreated(inMemoryQuestionRepository, sendNotificationUseCase);
	});
	it("should be able to send a notification when an answer is created", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});
		inMemoryQuestionRepository.create(question);
		inMemoryAnswerRepository.create(answer);
		await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled());
	});
});
