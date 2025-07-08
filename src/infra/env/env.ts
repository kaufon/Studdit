import { z } from "zod";

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	JWT_PUBLIC_KEY: z.string().min(1),
	JWT_PRIVATE_KEY: z.string().min(1),
	PORT: z.coerce.number().default(3333),
});

export type Env = z.infer<typeof envSchema>;
