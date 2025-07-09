import { type Either, left, right } from "@/core/either";
import type { Notification } from "../../enterprise/entities/notification";
import type { NotificationsRepository } from "../repositories/notifications-repository";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import type { UseCaseError } from "@/core/errors/use-case-error";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";

interface ReadNotificationUseCaseRequest {
	recipientId: string;
	notificationId: string;
}
type ReadNotificationUseCaseResponse = Either<
	UseCaseError,
	{ notification: Notification }
>;
export class ReadNotificationUseCase {
	constructor(private notificationRepository: NotificationsRepository) {}
	async execute({
		recipientId,
		notificationId,
	}: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
		const notification =
			await this.notificationRepository.findById(notificationId);
		if (!notification) {
			return left(new ResourceNotFoundError());
		}
		if (notification.recipientId.toString() !== recipientId) {
			return left(new NotAllowedError());
		}
		notification.markAsRead();
		return right({
			notification,
		});
	}
}
