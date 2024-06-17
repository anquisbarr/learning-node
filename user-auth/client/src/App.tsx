import { useForm } from "../hooks/useForm";
import "./App.css";

const API_URL = "http://localhost:3000";

const loginInitialState = {
	email: "",
	password: "",
};

const registerInitialState = {
	username: "",
	email: "",
	password: "",
};

function App() {
	const {
		formData: loginFormData,
		onInputChange: onLoginInputChange,
		onResetForm: onLoginResetForm,
	} = useForm(loginInitialState);
	const {
		formData: registerFormData,
		onInputChange: onRegisterInputChange,
		onResetForm: onRegisterResetForm,
	} = useForm(registerInitialState);

	const { email, password } = loginFormData;
	const {
		username,
		email: registerEmail,
		password: registerPassword,
	} = registerFormData;

	const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await fetch(`${API_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				onLoginResetForm();
			})
			.catch((err) => {
				const message = err.message || err;
				console.error(message);
			});
	};

	const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await fetch(`${API_URL}/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email: registerEmail,
				password: registerPassword,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				onRegisterResetForm();
			})
			.catch((err) => {
				const message = err.message || err;
				console.error(message);
			});
	};

	const handleDataSubmit = async (
		e: React.InputHTMLAttributes<HTMLButtonElement>,
	) => {
		await fetch(`${API_URL}/protected`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				const message = err.message || err;
				console.error(message);
			});
	};

	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "space-between",
					justifyContent: "space-between",
					height: "100vh",
					width: "100%",
				}}
			>
				<form
					onSubmit={handleLoginSubmit}
					className="login-form"
					style={{
						width: "100%",
						margin: "auto",
						padding: "20px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<h2>Login</h2>
					<label htmlFor="email">Email</label>
					<input
						type="text"
						id="email"
						name="email"
						value={email}
						onChange={onLoginInputChange}
						autoComplete="email"
					/>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={onLoginInputChange}
						autoComplete="current-password"
					/>
					<button type="submit">Login</button>
				</form>
				<form
					onSubmit={handleRegisterSubmit}
					className="register-form"
					style={{
						width: "100%",
						margin: "auto",
						padding: "20px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<h2>Register</h2>
					<label htmlFor="email">Email</label>
					<input
						type="text"
						id="email"
						name="email"
						value={registerEmail}
						onChange={onRegisterInputChange}
						autoComplete="email"
					/>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="usernam"
						name="username"
						value={username}
						onChange={onRegisterInputChange}
						autoComplete="username"
					/>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						value={registerPassword}
						onChange={onRegisterInputChange}
						autoComplete="current-password"
					/>
					<button type="submit">Register</button>
				</form>
				<button type="submit" onClick={handleDataSubmit}>
					Get data
				</button>
			</div>
		</>
	);
}

export default App;
