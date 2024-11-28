import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  Stack,
  Flex,
  Alert,
  AlertIcon,
  Text,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useProductContext } from "../home/Global.context";

const authUrl = import.meta.env.VITE_AUTH_URL;
const REGISTER_URL = import.meta.env.VITE_AUTH_URL;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const Login = () => {
  const navigate = useNavigate();
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { isSignIn, setIsSignIn, setSeason } = useProductContext();
  const MIN_DESKTOP_WIDTH = 768;
  const [media, setMedia] = useState(window.innerWidth < MIN_DESKTOP_WIDTH);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Resizing effect
  useEffect(() => {
    const handleResize = () => {
      setMedia(window.innerWidth < MIN_DESKTOP_WIDTH);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const passwordRecover = () => {
    alert('Aca va la la pegada al endpoint que manda el mail') 
  }

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${authUrl}/login`, data);
      if (response.status === 200) {
        setIsSignIn(false);
        localStorage.setItem("riskkojwt", JSON.stringify(response.data.token));
        setSeason('Primavera')
        navigate("/"
          /*
          response.data.isVerified === "true"
            ? "/"
            : `/verifyReg?mailToken=${response.data.verifyToken}`*/
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setInvalidCredentials(true);
        setShowAlert(true);
      } else {
        console.error("Error en el inicio de sesión:", error);
      }
    }
  };

  const validateEmail = async (value) => {
    const result = await checkClientNameAndEmail(value, "email", "email");
    return result || true; // Devuelve el mensaje si hay error, o true si no hay error
  };

  const checkClientNameAndEmail = async (value, field, path) => {
    try {
      const response = await axios.get(`${REGISTER_URL}/${path}?${path}=${value}`);
      if (response.data) {
        return `${value} no tiene una cuenta creada.`; // Devuelve un mensaje si existe
      }
      return null; // Devuelve null si todo está bien
    } catch (error) {
      console.error(`Error al verificar ${field}:`, error);
      return `Error al verificar ${field}.`; // Mensaje de error en caso de fallo
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
      {isSignIn && (
        <Box top={300}>
          <Alert status="warning">
            <AlertIcon />
            Debes estar registrado para poder realizar una reserva
          </Alert>
        </Box>
      )}
      <Box
        pos="relative"
        top={10}
        w={{ base: "90vw", md: "500px" }}
        h={{ base: "auto", md: "100vh" }}
        p={{ base: 4, md: 8 }}
      >
        <Text fontSize={{ base: "2xl", md: "4xl" }} align="center" py={3}>
          Iniciar sesión
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4} align="center" justify="center">
            <FormControl isInvalid={errors.email}>
              <Input
                placeholder="Email"
                autoComplete="new-email"
                borderColor={errors.email ? "red.500" : "#e1bc6a"}
                focusBorderColor="#e1bc6a"
                w="100%" // Ancho completo del input para alinearse con el botón
                {...register("email", {
                  required: "El email es requerido",
                  pattern: { value: emailRegex, message: "Email no válido" },
                  validate: validateEmail,
                })}
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <InputGroup w="100%"> {/* Ancho completo del grupo de input */}
                <Input
                  placeholder="Contraseña"
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  borderColor={errors.password ? "red.500" : "#e1bc6a"}
                  focusBorderColor="#e1bc6a"
                  w="100%" // Ancho completo del input
                  {...register("password", {
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 8,
                      message:
                        "La contraseña debe tener entre 8 y 24 caracteres e incluir al menos: una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%*).",
                    },
                  })}
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                    _focus={{ boxShadow: "none" }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button
              w="100%" // Ancho completo del botón
              bg="#e1bc6a"
              color="white"
              _hover={{ backgroundColor: "#d3a45a" }}
              type="submit"
            >
              Iniciar Sesión
              </Button>
            {showAlert && invalidCredentials && (
              <Alert status="error" w="100%" mt={4}>
                <AlertIcon />
                Credenciales incorrectas. Por favor, verifica tu correo y contraseña.
              </Alert>
            )}
            <Text fontSize="sm" textAlign="center" mt={4}>
              Si no tienes cuenta,{" "}
              <Text
                as="span"
                color="blue.500"
                cursor="pointer"
                onClick={() => navigate("/register")}
                _hover={{ textDecoration: "underline" }}
              >
                regístrate
              </Text>
              .
            </Text>
            <Text
                as="span"
                color="blue.500"
                cursor="pointer"
                onClick={() => passwordRecover()}
                _hover={{ textDecoration: "underline" }}
              >
                Olvidé mi contraseña
              </Text>


          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
