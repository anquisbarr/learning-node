import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import { env } from "./config/env";
import { createUser, loginUser } from "./controller/user-controller";

const PORT = Number.parseInt(env.PORT);

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true,
};
app.use(cors(corsOptions));

app.get("/", (_, res) => {
	return res.send("Hello World!");
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const [status, error, user] = await loginUser({
		email,
		password,
	});

	if (status && !error && user) {
		const token = jwt.sign(
			{ id: user.id, username: user.username, email: user.email },
			env.JWT_SECRET,
			{
				expiresIn: "1h",
			},
		);
		return res
			.status(200)
			.cookie("access_token", token, {
				httpOnly: false,
				secure: process.env.NODE_ENV === "production",
				maxAge: 1000 * 60 * 60,
			})
			.send(user);
	}

	if (!status && error) {
		return res.status(400).send(error.message);
	}

	return res.status(500).send("Internal Server Error");
});

app.post("/register", async (req, res) => {
	const { username, email, password } = req.body;
	const [status, error, user] = await createUser({
		username,
		email,
		password,
	});
	if (status && !error) {
		return res.send(user);
	}
	if (!status && error) {
		return res.status(400).send(error.message);
	}
	return res.status(500).send("Internal Server Error");
});

app.post("/logout", (req, res) => {
	return res.send("logout");
});

app.get("/protected", (req, res) => {
	const token = req.cookies.access_token;
	if (!token) {
		return res.status(401).send("Unauthorized");
	}
	try {
		const data = jwt.verify(token, env.JWT_SECRET);
		return res.send(data);
	} catch (err) {
		return res.status(401).send("Unauthorized");
	}
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});
