import {
	Controller,
	Post,
} from "@nestjs/common";

@Controller("/questions")
export class CreateQuestionController {
	@Post()
	async handle() {
		return "hi";
	}
}
