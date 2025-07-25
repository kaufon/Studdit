import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	public client: PrismaClient;
	constructor() {
		super({
			log: ["warn", "query", "error"],
		});
	}
	onModuleDestroy() {
		return this.$disconnect();
	}
	onModuleInit() {
		return this.$connect();
	}
}
