import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface NotificationProps {
	recipientId: UniqueEntityId;
	title: string;
	content: string;
	readAt?: Date;
	createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
	get recipientId() {
		return this.props.recipientId;
	}

	get title() {
		return this.props.title;
	}

	set title(newTitle: string) {
		this.props.title = newTitle;
	}

	get content() {
		return this.props.content;
	}

	set content(newContent: string) {
		this.props.content = newContent;
	}

	get readAt() {
		return this.props.readAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	markAsRead() {
		this.props.readAt = new Date();
	}

	static create(
		props: Optional<NotificationProps, "createdAt">,
		id?: UniqueEntityId,
	) {
		const notification = new Notification(
			{
				...props,
				createdAt: new Date() ?? props.createdAt,
			},
			id,
		);

		return notification;
	}
}
