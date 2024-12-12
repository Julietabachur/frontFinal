import React, { useState, useEffect } from "react";
import {
	Flex,
	Box,
	Text,
	FormControl,
	InputGroup,
	Input,
	Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";

const EmailPass = () => {
	const [media, setMedia] = useState(window.innerWidth < 768);
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm();
	const baseUrl = import.meta.env.VITE_SERVER_URL;

	useEffect(() => {
		const handleResize = () => {
			setMedia(window.innerWidth < 768);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const onSubmit = async (formData) => {
		const data = { email: formData?.email };
		console.log("Datos enviados al backend:", data); // <-- Esto mostrará el body en la consola del navegador.

		try {
			const response = await axios.post(
				`${baseUrl}/api/v1/public/email/reset`,
				data,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.status === 200) {
				alert("¡Correo enviado! Por favor revisa tu bandeja de entrada.");
			}
		} catch (error) {
			console.error("Error al enviar el correo:", error);
			alert("Hubo un problema al enviar el correo. Inténtalo nuevamente."); //me está tirando esta alerta
		}
	};

	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			minH="100vh"
			p={4}
			bg="gray.50"
		>
			<Box
				bg="white"
				p={6}
				rounded="md"
				shadow="md"
				maxW="400px"
				w="100%"
				textAlign="center"
			>
				<Text fontSize="2xl" fontWeight="bold" mb={4} color="gray.700">
					Ingresa tu correo electrónico
				</Text>

				<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
					<FormControl isInvalid={errors.email} mb={4}>
						<InputGroup>
							<Input
								placeholder="Correo electrónico"
								autoComplete="email"
								type="email"
								borderColor={errors.email ? "red.500" : "#e1bc6a"}
								focusBorderColor="#e1bc6a"
								{...register("email", {
									required: "El correo electrónico es requerido",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "El formato del correo no es válido",
									},
								})}
							/>
						</InputGroup>
						{errors.email && (
							<Text color="red.500" mt={2}>
								{errors.email.message}
							</Text>
						)}
					</FormControl>

					<Button
						type="submit"
						bg="#e1bc6a"
						color="white"
						_hover={{ bg: "#d1a960" }}
						w="full"
					>
						Enviar
					</Button>
				</form>
			</Box>
		</Flex>
	);
};

export default EmailPass;
