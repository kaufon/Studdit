import { DomainEvents } from "@/core/events/domain-events";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentsRepository implements StudentsRepository {
	public items: Student[] = [];

	async create(answer: Student): Promise<void> {
		this.items.push(answer);
		DomainEvents.dispatchEventsForAggregate(answer.id);
	}
	async findByEmail(email: string): Promise<Student | null> {
		const answer = this.items.find((item) => item.email === email);
		return answer ? answer : null;
	}
}
