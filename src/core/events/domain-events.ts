import type { AggregateRoot } from "../entities/aggregate-root";
import type { UniqueEntityId } from "../entities/unique-entity-id";
import type { DomainEvent } from "./domain-event";

type DomainEventCallback = (event: any) => void;

export class DomainEvents {
	private static handlersMap: Record<string, DomainEventCallback[]> = {};
	private static markedAggregates: AggregateRoot<unknown>[] = [];

	public static markAggregateForDispatch(
		aggregate: AggregateRoot<unknown>,
	): void {
		const aggregateFound = !!DomainEvents.findMarkedAggregateById(aggregate.id);
		if (!aggregateFound) {
			DomainEvents.markedAggregates.push(aggregate);
		}
	}

	private static dispatchAggregateEvents(
		aggregate: AggregateRoot<unknown>,
	): void {
		for (const event of aggregate.domainEvents) {
			DomainEvents.dispatch(event);
		}
	}

	private static removeAggregateFromMarkedDispatchList(
		aggregate: AggregateRoot<unknown>,
	): void {
		const index = DomainEvents.markedAggregates.findIndex(
			(a) => a.id === aggregate.id,
		);
		if (index !== -1) {
			DomainEvents.markedAggregates.splice(index, 1);
		}
	}

	private static findMarkedAggregateById(
		id: UniqueEntityId,
	): AggregateRoot<unknown> | undefined {
		return DomainEvents.markedAggregates.find((a) => a.id === id);
	}

	public static dispatchEventsForAggregate(id: UniqueEntityId): void {
		const aggregate = DomainEvents.findMarkedAggregateById(id);
		if (aggregate) {
			DomainEvents.dispatchAggregateEvents(aggregate);
			aggregate.clearEvents();
			DomainEvents.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register(
		callback: DomainEventCallback,
		eventClassName: string,
	): void {
		const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap;
		if (!wasEventRegisteredBefore) {
			DomainEvents.handlersMap[eventClassName] = [];
		}
		DomainEvents.handlersMap[eventClassName].push(callback);
	}

	public static clearHandlers(): void {
		DomainEvents.handlersMap = {};
	}

	public static clearMarkedAggregates(): void {
		DomainEvents.markedAggregates = [];
	}

	public static dispatch(event: DomainEvent): void {
		const eventClassName = event.constructor.name;
		const isEventRegistered = eventClassName in DomainEvents.handlersMap;
		if (isEventRegistered) {
			const handlers = DomainEvents.handlersMap[eventClassName];
			for (const handler of handlers) {
				handler(event);
			}
		}
	}
}
