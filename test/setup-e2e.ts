import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

function generateUniqueDatabaseUrl(schemaId: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is not set in the environment variables.");
	}

	const url = new URL(process.env.DATABASE_URL);
	url.searchParams.set("schema", schemaId);

	return url.toString();
}

const schemaId = randomUUID();
beforeAll(async () => {
	const databaseUrl = generateUniqueDatabaseUrl(schemaId);
	process.env.DATABASE_URL = databaseUrl;
	execSync("npx prisma migrate deploy");
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
	await prisma.$disconnect();
});
