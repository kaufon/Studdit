import type { UniqueEntityId } from "../entities/unique-entity-id";

export interface DomainEvent {
	occuredAt: Date;
	getAggregateId(): UniqueEntityId;
}
