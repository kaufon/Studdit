import { PaginationParams } from "@/core/repositories/pagination-params";
import type { Question } from "../../enterprise/entities/question";

export interface QuestionsRepository {
	findBySlug(slug: string): Promise<Question | null>;
	findById(id: string): Promise<Question | null>;
	findManyRecent(params: PaginationParams): Promise<Question[]>;
	create(answer: Question): Promise<void>;
	save(answer: Question): Promise<void>;
	delete(question: Question): Promise<void>;
}
