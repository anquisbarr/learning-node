import { type InferInsertModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
	id: integer("id")
		.primaryKey()
		.unique()
		.notNull()
		.$default(
			() => sql`
			(SELECT MAX(id) + 1 FROM users)
		`,
		),
	username: text("username").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
});

export type User = InferInsertModel<typeof users>;

export const insertUser = createInsertSchema(users, {
	id: (schema) => schema.id,
	username: (schema) => schema.username.min(3).max(32),
	email: (schema) => schema.email.email(),
	password: (schema) => schema.password.min(6).max(32),
});

export const loginUserSchema = createSelectSchema(users, {
	id: (schema) => schema.id.optional(),
	username: (schema) => schema.username.optional(),
	email: (schema) => schema.email.email(),
	password: (schema) => schema.password.min(6).max(32),
});
