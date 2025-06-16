import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
interface AttachmentProps {
	title: string;
	link: string;
  parentId: string
}
export class Attachment extends Entity<AttachmentProps> {
	get title(): string {
		return this.props.title;
	}

	get link(): string {
		return this.props.link;
	}

	set title(title: string) {
		this.props.title = title;
	}
	set link(link: string) {
		this.props.link = link;
	}
	static create(props: AttachmentProps, id?: UniqueEntityId) {
		const attachment = new Attachment(props, id);
		return attachment;
	}
}
