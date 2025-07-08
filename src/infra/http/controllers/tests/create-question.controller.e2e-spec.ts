import { AppModule } from "../../../app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service"; 
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
describe("create account e2e", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get<PrismaService>(PrismaService);
		jwt = moduleRef.get<JwtService>(JwtService);
		await app.init();
	});
	test("POST /questions", async () => {
		const user = await prisma.user.create({
			data: {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "123456",
			},
		});
		const acessToken = jwt.sign({ sub: user.id });
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
