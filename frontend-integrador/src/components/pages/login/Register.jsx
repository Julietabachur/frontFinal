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
  Text,
  
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
/*
const nameRegex = /^[a-zA-Z][a-zA-Z_-]{2,22}$/;
const clientNameRegex = /^[a-zA-Z0-9._-]{5,}$/;
*/
const nameRegex = /^[A-Za-zÀ-ÿ'-]{1,50}$/;
const lastNameRegex = /^[A-Za-zÀ-ÿ'-]+(?: [A-Za-zÀ-ÿ'-]+)*$/;
const clientNameRegex = /^[A-Za-z][A-Za-z0-9._]{2,19}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const GETME_URL = import.meta.env.VITE_GETME_URL;
const REGISTER_URL = import.meta.env.VITE_AUTH_URL;
const REGISTER_URL2 = import.meta.env.VITE_AUTH_URL+"/register";


const Register = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const [showPassword, setShowPassword] = useState(false);
  const MIN_DESKTOP_WIDTH = 768;
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [media, setMedia] = useState(window.innerWidth < MIN_DESKTOP_WIDTH);
 
  
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: "onBlur" });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

   // Resizing effect
   useEffect(() => {
    const handleResize = () => {
      setMedia(window.innerWidth < MIN_DESKTOP_WIDTH);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkClientNameAndEmail = async (value, field, path) => {
    //console.log(`${REGISTER_URL}/${path}?${path}=${value}`)
    try {
      const response = await axios.get(`${REGISTER_URL}/${path}?${path}=${value}`);
      if (!response.data) {
        //console.log(`${value} ya está en uso.`)
        return `${value} ya está en uso.`; // Devuelve un mensaje si existe
      }
      return null; // Devuelve null si todo está bien
    } catch (error) {
      console.error(`Error al verificar ${field}:`, error);
      return `Error al verificar ${field}.`; // Mensaje de error en caso de fallo
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
  
  const validateClientName = async (value) => {
    const result = await checkClientNameAndEmail(value, "clientName", "clientName");
    return result || true; // Devuelve el mensaje si hay error, o true si no hay error
  };
  
  const validateEmail = async (value) => {
    const result = await checkClientNameAndEmail(value, "email", "email");
    return result || true; // Devuelve el mensaje si hay error, o true si no hay error
  };

  const onSubmit = async (formData) => {
    // Estructuramos el objeto data con los valores del formulario
  const data = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    clientName: formData.clientName,
    email: formData.email,
    password: formData.password,
  };

  console.log(data);
    
    try {
      // Llamada a la API con los datos estructurados
    const response = await axios.post(REGISTER_URL2, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
      
      <Box
        w={"97vw"}
        maxW="500px"
        p={8}
        borderRadius="md"
        boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
        
      >
        <Text fontSize={media ? "2xl" : "4xl"} align="center" py={3}>
          Crear Cuenta
        </Text>
         
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          //boxShadow="md"
        >
          <FormControl isInvalid={errors.firstName} mb={4}>
            <Input
              placeholder="Nombre"
              autoComplete="off" // Desactiva la autocompletación
              borderColor={errors.firstName ? "red.500" : "#e1bc6a"}
              focusBorderColor="#e1bc6a" // Cambiar el color del borde al enfocar
              {...register("firstName", {
                required: "Nombre es requerido",
                pattern: {
                  value: nameRegex,
                  message: "El nombre no es válido",
                },
              })}
              onBlur={(e) => ("firstName", e.target.value.trim())} // Elimina espacios al hacer blur>
            
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
                  value: lastNameRegex,
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
                validate: validateClientName, // Asigna la función de validación
                
              })}
            />
            <FormErrorMessage>{errors.clientName?.message}</FormErrorMessage>
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
                validate: validateEmail, // Asigna la función de validación
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
                    message: "La contraseña debe tener entre 8 y 24 caracteres, e incluir al menos: una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%*).",
                  },
                })}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  bg="transparent" // Fondo transparente
                  _hover={{ bg: "transparent" }} // Quitar fondo al pasar el ratón
                  _active={{ bg: "transparent" }} // Quitar fondo al hacer clic
                  _focus={{ boxShadow: "none" }} // Quitar el borde de enfoque onClick={togglePasswordVisibility}
                  onClick={togglePasswordVisibility}
                >
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
                {/* <Button h="1.75rem" size="sm" onClick={toggleConfirmPasswordVisibility}> */}
                <Button
                  h="1.75rem"
                  size="sm"
                  bg="transparent" // Fondo transparente
                  _hover={{ bg: "transparent" }} // Quitar fondo al pasar el ratón
                  _active={{ bg: "transparent" }} // Quitar fondo al hacer clic
                  _focus={{ boxShadow: "none" }} // Quitar el borde de enfoque
                  onClick={toggleConfirmPasswordVisibility}
                >
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

          <Button
            type="submit"
            backgroundColor={"#e1bc6a"}
            w="full"
            color="white"
            _hover={{ backgroundColor: "#d3a45a" }}
          >
            Registrarse
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Register;
