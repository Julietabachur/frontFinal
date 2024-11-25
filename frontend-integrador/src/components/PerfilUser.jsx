import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  VStack,
  HStack,
  Avatar,
  Flex,
  Box,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  FormErrorMessage,
  useBreakpointValue,
  Divider,
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  useDisclosure, 
  useToast
} from "@chakra-ui/react";
import { useProductContext } from "./pages/home/Global.context";
import { useForm } from "react-hook-form";

const PerfilUser = () => {
    const nameRegex = /^[A-Za-zÀ-ÿ'-]{1,50}$/;
const lastNameRegex = /^[A-Za-zÀ-ÿ'-]+(?: [A-Za-zÀ-ÿ'-]+)*$/;
const clientNameRegex = /^[A-Za-z][A-Za-z0-9._]{2,19}$/;
    const streetRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+(\s\d+)?$/;
    const numberRegex = /^[1-9]\d*$/;
    const cityRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const countryRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const postalCodeRegex = /^\d{4,8}$/;
    const celRegex = /^\+?(\d{1,3})?[-. (]*\d{2,4}[-. )]*\d{3,4}[-. ]*\d{3,4}$/;


  const { clientId } = useProductContext();
  const REGISTER_URL = import.meta.env.VITE_AUTH_URL;
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const avatarSize = useBreakpointValue({ base: "md", md: "lg" });
  const MIN_DESKTOP_WIDTH = 768;
  const [media, setMedia] = useState(window.innerWidth < MIN_DESKTOP_WIDTH);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    clientName: "",
    cel: "",
    email: "",
    address: {
        street: "",
        number: "",
        city: "",
        country: "",
        postalCode: "",
      },
  });
  const toast = useToast();
  const [originalClientName, setOriginalClientName] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    const handleResize = () => setMedia(window.innerWidth < MIN_DESKTOP_WIDTH);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/private/clients/${clientId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setUser(response.data);
        setOriginalClientName(response.data.clientName); 
        // Inicializar valores en el formulario
        Object.entries(response.data).forEach(([key, value]) => {
          setValue(key, value);
        });
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  useEffect(() => {
    if (clientId && token) {
      getUser();
    }
  }, [clientId, token]);

  useEffect(() => {
    // Explicitly set all form values after user data is fetched
    if (user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('clientName', user.clientName || '');
      setValue('cel', user.cel || '');
      setValue('email', user.email || ''); 
      // Set address values
      setValue('address.street', user.address?.street || '');
      setValue('address.number', user.address?.number || '');
      setValue('address.city', user.address?.city || '');
      setValue('address.country', user.address?.country || '');
      setValue('address.postalCode', user.address?.postalCode || '');
    }
  }, [user, setValue]);


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);

  const onSubmit = async (formData) => {
    // Instead of directly submitting, open modal and store data
    setFormDataToSubmit(formData);
    onOpen();
  };


  const handleConfirmSubmit = async (formData) => {
    if (formDataToSubmit) {
      const data = {
        firstName: formDataToSubmit.firstName,
        lastName: formDataToSubmit.lastName,
        clientName: formDataToSubmit.clientName,
        email: formDataToSubmit.email,
        cel: formDataToSubmit.cel,
        address: {
          street: formDataToSubmit.address.street, 
          number: formDataToSubmit.address.number,
          city: formDataToSubmit.address.city,
          country: formDataToSubmit.address.country,
          postalCode: formDataToSubmit.address.postalCode,
        }
      };

    console.log("Datos enviados:", data);
    console.log(clientId);
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/private/clients/${clientId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        //alert("Datos actualizados con éxito.");
        toast({
          title: "Datos actualizados con éxito.",
          status: "success",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        onClose(); 
      }
    } catch (error) {
      toast({
        title: "Error al modificar datos",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      console.error("Error al modificar datos:", error);
    }
  };}

  const validateClientName = async (value) => {
    // Solo validar si el clientName ha cambiado
  if (value !== originalClientName) {
    const result = await checkClientNameAndEmail(value, "clientName", "clientName");
    return result || true; // Devuelve el mensaje si hay error, o true si no hay error
  }
  return true;  // No hacer nada si no ha cambiado
  };

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

  return (
    <VStack
      w="100%"
      h="100vh"
      maxWidth="1200px"
      spacing={8}
      align="center"
      p={6}
      margin="auto"
    >
      <HStack
        w="100%"
        justify="center"
        spacing={4}
        align="center"
        p={4}
        bg="white"
      >
        <Avatar
          size={avatarSize}
          name={user?.clientName || "Usuario"}
          bg="color"
        />
        <VStack spacing={1} align="flex-start">
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            {user?.clientName || "Usuario"}
          </Text>
          <Text color="gray.500">{user?.email || "email@example.com"}</Text>
        </VStack>
      </HStack>

      {/* Divider para separar las secciones */}
      <Divider borderColor="#e1bc6a" w="90%" />

      {/* Formulario */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        
        p={4}
      >
        <Box
          w={media ? "90vw" : "600px"}
          p={media ? 6 : 8}
          borderRadius="md"
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
          marginBottom={useBreakpointValue({ base: "10px", md: "20px" })}
        >
          <Text fontSize={media ? "2xl" : "4xl"} align="center" py={3}>
            Modificar datos de usuario
          </Text>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <SimpleGrid
              columns={{ base: 1, md: 2 }} // Una columna en pantallas pequeñas
              spacing={4}
              mb={4}
            >
              <FormControl isInvalid={errors.firstName}>
                <FormLabel>Nombre</FormLabel>
                <Input
                focusBorderColor="#e1bc6a" 
                  {...register("firstName", {
                    required: "Nombre es requerido",
                    pattern: {
                        value: nameRegex,
                        message: "El nombre no es válido",
                      },
                  })}
                  borderColor={errors.firstName ? "red.500" : "#e1bc6a"}
                />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.lastName}>
                <FormLabel>Apellido</FormLabel>
                <Input
                focusBorderColor="#e1bc6a" 
                  {...register("lastName", {
                    required: "Apellido es requerido",
                    pattern: {
                        value: lastNameRegex,
                        message: "El apellido no es válido",
                      },
                  })}
                  borderColor={errors.lastName ? "red.500" : "#e1bc6a"}
                />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.clientName}>
                <FormLabel>Nombre de Usuario</FormLabel>
                <Input
                focusBorderColor="#e1bc6a" 
                  {...register("clientName", {
                    required: "Nombre de usuario es requerido",
                    pattern: {
                        value: clientNameRegex,
                        message: "Nombre de usuario no válido",
                      },
                      validate: validateClientName,

                  })}
                  borderColor={errors.clientName ? "red.500" : "#e1bc6a"}
                />
                <FormErrorMessage>
                  {errors.clientName?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                focusBorderColor="#e1bc6a" 
                  isDisabled
                  value={user.email}
                  borderColor="gray.300"
                  cursor="not-allowed"
                />
              </FormControl>
              <FormControl isInvalid={errors.cel}>
                <FormLabel>Teléfono</FormLabel>
                <Input
                focusBorderColor="#e1bc6a" 
                  type="tel"
                  {...register("cel", { required: "Teléfono es requerido",
                    pattern: {
                        value: celRegex,
                        message: "Número telefónico de usuario no válido",
                      },
                   })}
                  borderColor={errors.cel ? "red.500" : "#e1bc6a"}
                />
                <FormErrorMessage>{errors.cel?.message}</FormErrorMessage>
              </FormControl>
              {/* Nueva entrada para la dirección */}
            <FormControl isInvalid={errors.address?.street}>
              <FormLabel>Calle</FormLabel>
              <Input
              focusBorderColor="#e1bc6a" 
                {...register("address.street", {
                  required: "Calle es requerida",
                  pattern: {
                    value: streetRegex,
                    message: "Nombre de calle no válida",
                  },
                })}
                borderColor={errors.address?.street ? "red.500" : "#e1bc6a"}
              />
              <FormErrorMessage>{errors.address?.street?.message}</FormErrorMessage>
            </FormControl>

            {/* Nueva entrada para el número de la dirección */}
            <FormControl isInvalid={errors.address?.number}>
              <FormLabel>Número</FormLabel>
              <Input
              focusBorderColor="#e1bc6a" 
                type="number"
                {...register("address.number", {
                  required: "Número es requerido",
                  pattern: {
                    value: celRegex.escape,
                    message: "Número de puerta no válido",
                  },
                })}
                borderColor={errors.address?.number ? "red.500" : "#e1bc6a"}
              />
              <FormErrorMessage>{errors.address?.number?.message}</FormErrorMessage>
            </FormControl>

            {/* Nueva entrada para la ciudad */}
            <FormControl isInvalid={errors.address?.city}>
              <FormLabel>Ciudad</FormLabel>
              <Input
              focusBorderColor="#e1bc6a" 
                {...register("address.city", {
                  required: "Ciudad es requerida",
                  pattern: {
                    value: cityRegex,
                    message: "Nombre de ciudad no válida",
                  },
                })}
                borderColor={errors.address?.city ? "red.500" : "#e1bc6a"}
              />
              <FormErrorMessage>{errors.address?.city?.message}</FormErrorMessage>
            </FormControl>

            {/* Nueva entrada para el país */}
            <FormControl isInvalid={errors.address?.country}>
              <FormLabel>País</FormLabel>
              <Input
              focusBorderColor="#e1bc6a" 
                {...register("address.country", {
                  required: "País es requerido",
                  pattern: {
                    value: countryRegex,
                    message: "Nombre de ciudad no válida",
                  },
                })}
                borderColor={errors.address?.country ? "red.500" : "#e1bc6a"}
              />
              <FormErrorMessage>{errors.address?.country?.message}</FormErrorMessage>
            </FormControl>

            {/* Nueva entrada para el código postal */}
            <FormControl isInvalid={errors.address?.postalCode}>
              <FormLabel>Código Postal</FormLabel>
              <Input
              focusBorderColor="#e1bc6a" 
                type="number"
                {...register("address.postalCode", {
                  required: "Código postal es requerido",
                  pattern: {
                    value: postalCodeRegex,
                    message: "Número postal no válido",
                  },
                })}
                borderColor={errors.address?.postalCode ? "red.500" : "#e1bc6a"}
              />
              <FormErrorMessage>{errors.address?.postalCode?.message}</FormErrorMessage>
            </FormControl>
            </SimpleGrid>
            <Flex justify="space-between" mt={4}>
              <Button
                backgroundColor="#e1bc6a"
                color="white"
                _hover={{ backgroundColor: "#d3a45a" }}
              >
                Cambiar contraseña
              </Button>
              <Button
                type="submit"
                backgroundColor="#e1bc6a"
                color="white"
                _hover={{ backgroundColor: "#d3a45a" }}
              >
                Modificar
              </Button>
              {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Modificación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Está seguro que desea modificar sus datos?
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="gray" 
              mr={3} 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              backgroundColor="#e1bc6a"
              color="white"
              _hover={{ backgroundColor: "#d3a45a" }}
              onClick={handleConfirmSubmit}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
            </Flex>
          </form>
        </Box>
      </Flex>
    </VStack>
  );
};

export default PerfilUser;
