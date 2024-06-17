import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { SALT_ROUNDS } from "../config/config";
import { db } from "../db/client";
import { type User, insertUser, loginUserSchema, users } from "../db/schema";
type UserRegisterResponse = [boolean, Error?, Pick<User, "id" | "email">[]?];

export const createUser = async (user: User): Promise<UserRegisterResponse> => {
	const result = insertUser.safeParse(user);
	if (!result.success && result.error.issues.length > 0) {
		return [false, result.error, undefined];
	}

	if (!result.success) {
		return [false, new Error("Unknown error"), undefined];
	}

	const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
	const data = {
		...result.data,
		password: hashedPassword,
	};

	try {
		const u = await db.select().from(users).where(eq(users.email, data.email));
		if (u.length > 0) {
			return [false, new Error("User already exists"), undefined];
		}
		const user = await db.insert(users).values(data).returning({
			id: users.id,
			email: users.email,
		});
		return [true, undefined, user];
	} catch (error) {
		if (error instanceof Error) {
			return [false, error, undefined];
		}
		return [false, new Error("Unknown error"), undefined];
	}
};

type UserGetResponse = [
	boolean,
	Error?,
	Pick<User, "id" | "username" | "email">?,
];
export const getUser = async (id: number): Promise<UserGetResponse> => {
	try {
		const user = await db.select().from(users).where(eq(users.id, id));
		if (user.length === 0) {
			return [false, new Error("User not found"), undefined];
		}

		return [true, undefined, user[0]];
	} catch (error) {
		if (error instanceof Error) {
			return [false, error, undefined];
		}
		return [false, new Error("Unknown error"), undefined];
	}
};

export const loginUser = async (
	user: Pick<User, "email" | "password">,
): Promise<UserGetResponse> => {
	const result = loginUserSchema.safeParse(user);
	if (!result.success && result.error.issues.length > 0) {
		return [false, result.error, undefined];
	}

	if (!result.success) {
		return [false, new Error("Unknown error"), undefined];
	}

	const data = result.data;

	try {
		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, data.email));
		if (user.length === 0) {
			return [false, new Error("User not found"), undefined];
		}

		const isValid = await bcrypt.compare(data.password, user[0].password);

		if (!isValid) {
			return [false, new Error("Invalid password"), undefined];
		}
		const userData = {
			id: user[0].id,
			email: user[0].email,
			username: user[0].username,
		};

		return [true, undefined, userData];
	} catch (error) {
		if (error instanceof Error) {
			return [false, error, undefined];
		}
		return [false, new Error("Unknown error"), undefined];
	}
};
