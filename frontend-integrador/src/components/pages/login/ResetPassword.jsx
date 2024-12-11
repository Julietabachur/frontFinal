import React, { useState, useEffect } from "react";
import { Flex, Box, Text, FormControl, InputGroup, Input, Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

const EmailPass = () => {
  const [media, setMedia] = useState(window.innerWidth < 768);
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate(); // Inicializamos useNavigate
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const handleResize = () => {
      setMedia(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (formData) => {
    const data = {
      email: formData?.email,
      password: formData?.password,
    };
    console.log("Datos enviados al backend:", data); // Mostrar datos enviados en la consola

    try {
      const response = await axios.patch(`${baseUrl}/api/v1/public/reset`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        alert("¡Contraseña cambiada exitosamente!");
        navigate("/login"); // Redirigimos al login después del éxito
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un problema al cambiar la contraseña. Inténtalo nuevamente.");
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
          Cambia tu contraseña
        </Text>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {/* Campo de correo electrónico */}
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
            {errors.email && <Text color="red.500" mt={2}>{errors.email.message}</Text>}
          </FormControl>

          {/* Campo de contraseña */}
          <FormControl isInvalid={errors.password} mb={4}>
            <InputGroup>
              <Input
                placeholder="Nueva contraseña"
                autoComplete="new-password"
                type="password"
                borderColor={errors.password ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                })}
              />
            </InputGroup>
            {errors.password && <Text color="red.500" mt={2}>{errors.password.message}</Text>}
          </FormControl>

          <Button
            type="submit"
            bg="#e1bc6a"
            color="white"
            _hover={{ bg: "#d1a960" }}
            w="full"
          >
            Cambiar Contraseña
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default EmailPass;
