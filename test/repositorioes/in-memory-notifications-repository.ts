import type { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import type { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository
	implements NotificationsRepository
{
	public items: Notification[] = [];
	async create(notification: Notification): Promise<void> {
		this.items.push(notification);
		return Promise.resolve();
	}
	async findById(notificationId: string): Promise<Notification | null> {
		const notification = this.items.find(
			(item) => item.id.toString() === notificationId,
		);
		return Promise.resolve(notification ?? null);
	}
	async save(notification: Notification): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id === notification.id,
		);
		this.items[itemIndex] = notification;
	}
}
