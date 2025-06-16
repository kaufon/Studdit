import { SendNotificationUseCase } from "../send-notification";
import { InMemoryNotificationsRepository } from "test/repositorioes/in-memory-notifications-repository";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendQuestion: SendNotificationUseCase;
describe("Create question", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

		sendQuestion = new SendNotificationUseCase(inMemoryNotificationsRepository);
	});
	it("create a question", async () => {
		const question = await sendQuestion.execute({
			title: "1",
			recipientID: "1",
			content: "Resposta maneira",
		});
		expect(inMemoryNotificationsRepository.items[0]).toBeTruthy();
		expect(inMemoryNotificationsRepository.items[0].title).toEqual("1");
	});
});
