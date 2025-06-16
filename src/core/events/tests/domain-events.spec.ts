import { AggregateRoot } from "@/core/entities/aggregate-root";
import type { DomainEvent } from "../domain-event";
import type { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DomainEvents } from "../domain-events";

class CustomAggregateCreated implements DomainEvent {
	public occuredAt: Date;
	public aggregate: CustomAggregate;

	constructor(aggregate: CustomAggregate) {
		this.occuredAt = new Date();
		this.aggregate = aggregate;
	}

	public getAggregateId(): UniqueEntityId {
		return this.aggregate.id;
	}
}

class CustomAggregate extends AggregateRoot<null> {
	static create() {
		const aggregate = new CustomAggregate(null);
		aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
		return aggregate;
	}
}
describe("domain envet", () => {
	it("should be able to dispatch and listen to domain events", () => {
    const callbackSpy = vi.fn()
		DomainEvents.register(callbackSpy, CustomAggregateCreated.name);
		const aggregate = CustomAggregate.create();
    expect(aggregate.domainEvents).toHaveLength(1);
    DomainEvents.dispatchEventsForAggregate(aggregate.id)
    expect(callbackSpy).toHaveBeenCalledTimes(1);
    expect(aggregate.domainEvents).toHaveLength(0);
	});
});
