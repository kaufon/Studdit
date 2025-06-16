import { InMemoryAnswersRepository } from "test/repositorioes/in-answers-questions-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryQuestionsRepository } from "test/repositorioes/in-memory-questions-repository";
import { SendNotificationUseCase } from "../../use-cases/send-notification";
import { InMemoryQuestionAttachmentsRepository } from "test/repositorioes/in-memory-question-attachments-repository";
import { InMemoryNotificationsRepository } from "test/repositorioes/in-memory-notifications-repository";
import { makeQuestion } from "test/factories/make-question";
import { waitFor } from "test/utils/wait-for";
import { OnQuestionBestAnswerChosen } from "../on-question-best-answer-chosen";
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
		new OnQuestionBestAnswerChosen(
			inMemoryAnswerRepository,
			sendNotificationUseCase,
		);
	});
	it("should be able to send a notification when an tpoc has best answer is created", async () => {
		const question = makeQuestion();
		const answer = makeAnswer({
			questionId: question.id,
		});
		inMemoryQuestionRepository.create(question);
		inMemoryAnswerRepository.create(answer);
		question.bestAnswerId = answer.id;
		await inMemoryQuestionRepository.save(question);
		await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled());
	});
});
