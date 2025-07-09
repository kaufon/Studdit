import { makeNotification } from "test/factories/make-notification";
import { ReadNotificationUseCase } from "../read-notification";
import { SendNotificationUseCase } from "../send-notification";
import { InMemoryNotificationsRepository } from "test/repositorioes/in-memory-notifications-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;
describe("Create question", () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
	});
	it("create a question", async () => {
		const notification = makeNotification({
			title: "1",
			recipientId: new UniqueEntityId("1"),
		});
		await inMemoryNotificationsRepository.create(notification);
		const result = await sut.execute({
			recipientId: "1",
			notificationId: notification.id.toString(),
		});
		expect(result.isRight()).toBeTruthy();
		expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
			expect.any(Date),
		);
	});
	it("should not be able to read a notification that does not exist", async () => {
		const notification = makeNotification({
			title: "1",
			recipientId: new UniqueEntityId("1"),
		});
		await inMemoryNotificationsRepository.create(notification);
		const result = await sut.execute({
			recipientId: "2",
			notificationId: notification.id.toString(),
		});
		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
