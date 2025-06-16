import { type Either, right } from "@/core/either";
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id";
import { Notification } from "../../enterprise/entities/notification";
import type { NotificationsRepository } from "../repositories/notifications-repository";

interface SendNotificationUseCaseRequest {
	title: string;
	recipientID: string;
	content: string;
}
type SendNotificationUseCaseResponse = Either<
	null,
	{ notification: Notification }
>;
export class SendNotificationUseCase {
	constructor(private notificationRepository: NotificationsRepository) {}
	async execute({
		title,
		recipientID,
		content,
	}: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
		const question = Notification.create({
			content,
			title,
			recipientId: new UniqueEntityId(recipientID),
		});
		await this.notificationRepository.create(question);
		return right({
			notification: question,
		});
	}
}
