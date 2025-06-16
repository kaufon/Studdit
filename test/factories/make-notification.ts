import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
	Notification,
	type NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";

export function makeNotification(
	override: Partial<NotificationProps> = {},
	id?: UniqueEntityId,
) {
	const question = Notification.create(
		{
			title: faker.lorem.sentence(5),
			recipientId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);
	return question;
}
