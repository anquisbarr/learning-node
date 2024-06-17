import { useState } from "react";

export const useForm = <T>(initValues: T) => {
	const [formData, setFormData] = useState(initValues);

	const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const onResetForm = () => {
		setFormData(initValues);
	};

	return { ...formData, formData, onInputChange, onResetForm };
};
