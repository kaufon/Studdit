import {
	type ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from "@nestjs/common";
import type { ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}
	transform(value: unknown, metadata: ArgumentMetadata) {
		try {
			this.schema.parse(value);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException({
					erros: fromZodError(error),
					message: "Validation failed",
					statusCode: 400,
				});
			}
			throw new BadRequestException("Validation failed");
		}
		return value;
	}
}
