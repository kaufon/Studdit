import { AppModule } from "../../../app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
describe("create account e2e", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get<PrismaService>(PrismaService);
		await app.init();
	});
	test("POST /sessions", async () => {
		await prisma.user.create({
			data: {
				name: "John Doe",
				email: "johndoe@example.com",
				password: await hash("password123", 8),
			},
		});
		const response = await request(app.getHttpServer()).post("/sessions").send({
			email: "johndoe@example.com",
			password: "password123",
		});
		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			acess_token: expect.any(String),
		});
	});
});
