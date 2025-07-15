import { DatabaseModule } from "@/infra/database/database.module";
import { AppModule } from "../../../app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
describe("create account e2e", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let jwt: JwtService;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get<PrismaService>(PrismaService);
		jwt = moduleRef.get<JwtService>(JwtService);
		studentFactory = moduleRef.get<StudentFactory>(StudentFactory);
		await app.init();
	});
	test("POST /questions", async () => {
		const user = await studentFactory.makePrismaStudent();
		const acessToken = jwt.sign({ sub: user.id.toString() });
		const response = await request(app.getHttpServer())
			.post("/questions")
			.set("Authorization", `Bearer ${acessToken}`)
			.send({
				title: "What is NestJS?",
				content:
					"NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.",
			});
		expect(response.statusCode).toBe(201);
		const questionOnDatabase = await prisma.question.findFirst({
			where: { title: "What is NestJS?" },
		});
		expect(questionOnDatabase).toBeTruthy();
	});
});
