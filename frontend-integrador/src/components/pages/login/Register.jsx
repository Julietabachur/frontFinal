import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const nameRegex = /^[a-zA-Z][a-zA-Z_-]{2,22}$/;
const clientNameRegex = /^[a-zA-Z0-9._-]{5,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const GETME_URL = import.meta.env.VITE_GETME_URL;
const REGISTER_URL = import.meta.env.VITE_AUTH_URL + "/register";

const Register = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onBlur" });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const checkClientNameAndEmail = async (value, field) => {
    try {
      const response = await axios.get(
        `${REGISTER_URL}/${field}?${field}=${value}`
      );
      if (!response.data) {
        setError(field, { type: "manual", message: `${field} ya está en uso.` });
      } else {
        clearErrors(field);
      }
    } catch (error) {
      console.error(`Error al verificar ${field}:`, error);
    }
  };

  const getUsername = async (token) => {
    try {
      const response = await axios.get(GETME_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response) {
        navigate("/");
      } else {
        localStorage.removeItem("riskkojwt");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getUsername(token);
    }
    reset(); // Resetea el formulario al montar el componente
  }, [token, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(REGISTER_URL, data);
      if (response.status === 200) {
        localStorage.setItem("riskkojwt", JSON.stringify(response.data.token));
        alert("Registro exitoso. Serás redirigido a la página de inicio.");
        navigate(`/verifyReg?mailToken=${response.data.verifyToken}`);
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  // Obtenemos la contraseña ingresada para la validación
  const password = watch("password");

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
      <Box w={"97vw"} maxW="500px" p={8} borderRadius="md" boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)">
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" boxShadow="md">
          <FormControl isInvalid={errors.firstName} mb={4}>
            <Input
              placeholder="Nombre"
              autoComplete="off" // Desactiva la autocompletación
              borderColor={errors.firstName ? "red.500" :"#e1bc6a"}
                focusBorderColor="#e1bc6a"  // Cambiar el color del borde al enfocar
              {...register("firstName", {
                required: "Nombre es requerido",
                pattern: {
                  value: nameRegex,
                  message: "El nombre no es válido",
                },
              })}
            />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.lastName} mb={4}>
            <Input
              placeholder="Apellido"
              autoComplete="off" // Desactiva la autocompletación
              borderColor={errors.lastName ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a" // Cambiar el color del borde al enfocar
              {...register("lastName", {
                required: "Apellido es requerido",
                pattern: {
                  value: nameRegex,
                  message: "El apellido no es válido",
                },
              })}
            />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.clientName} mb={4}>
            <Input
              placeholder="Nombre de usuario"
              autoComplete="new-username" // Usa un valor alternativo
              borderColor={errors.clientName ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a" // Cambiar el color del borde al enfocar
              {...register("clientName", {
                required: "Nombre de usuario es requerido",
                pattern: {
                  value: clientNameRegex,
                  message: "Nombre de usuario no válido",
                },
                validate: (value) => checkClientNameAndEmail(value, "clientName"),
              })}
            />
            {errors.clientName?.type === "manual" && (
              <FormErrorMessage>{errors.clientName.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={errors.email} mb={4}>
            <Input
              placeholder="Email"
              autoComplete="off" // Desactiva la autocompletación
              borderColor={errors.email ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a" // Cambiar el color del borde al enfocar
              {...register("email", {
                required: "Email es requerido",
                pattern: {
                  value: emailRegex,
                  message: "Email no válido",
                },
                validate: (value) => checkClientNameAndEmail(value, "email"),
              })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password} mb={4}>
            <InputGroup>
              <Input
                placeholder="Contraseña"
                autoComplete="new-password" // Usa un valor alternativo
                type={showPassword ? "text" : "password"}
                borderColor={errors.password ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a" // Cambiar el color del borde al enfocar
                {...register("password", {
                  required: "Contraseña es requerida",
                  pattern: {
                    value: passwordRegex,
                    message: "Contraseña no válida",
                  },
                })}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={togglePasswordVisibility}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.confirmPassword} mb={4}>
            <InputGroup>
              <Input
                placeholder="Confirmar contraseña"
                type={showConfirmPassword ? "text" : "password"}
                borderColor={errors.confirmPassword ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a" // Cambiar el color del borde al enfocar
                {...register("confirmPassword", {
                  required: "Confirmar contraseña es requerido",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden", // Compara con el valor de la contraseña
                })}
              />
              <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
                {/* <IconButton
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={toggleConfirmPasswordVisibility}
                  variant="ghost"
                  aria-label="Toggle confirm password visibility"
                />*/}
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.confirmPassword?.message}
            </FormErrorMessage>
          </FormControl>

          <Button type="submit"  backgroundColor={"#e1bc6a"} w="full" color="white" _hover={{ backgroundColor: "#d3a45a" }}>
            Registrarse
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
