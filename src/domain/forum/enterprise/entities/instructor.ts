import { Entity } from "@/core/entities/entity";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface instructorProps {
	name: string;
}

export class Instructor extends Entity<instructorProps> {
	get name(): string {
		return this.props.name;
	}

	static create(props: instructorProps, id?: UniqueEntityId) {
		const instructor = new Instructor(props, id);
		return instructor;
	}
}
