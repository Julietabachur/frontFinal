import React, { useState, useEffect } from "react";
import {
  HStack,
  RadioGroup,
  Radio,
  Text,
  Box,
  Icon,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { FaStore, FaTruck } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

const postalCodeRegex = /^\d{4,5}$/;

function Shipping() {
  const { setChildValidationFunc, setValid } = useOutletContext();
  
  const items = [
    {
      value: "retiro",
      icon: FaStore,
      description: "Recoge tu pedido en nuestra tienda",
    },
    {
      value: "envio",
      icon: FaTruck,
      description: "Envío directo a tu domicilio",
    },
  ];

  const [selectedOption, setSelectedOption] = useState("retiro");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isDirty }, // Using isDirty to track form changes
  } = useForm({
    mode: "onBlur", // Changed from onChange to onBlur
    reValidateMode: "onChange"
  });

  const validateShipping = async () => {
    // Si 'retiro' es seleccionado, la validación es siempre exitosa
    if (selectedOption === "retiro") {
      setValid(true);
      return true;
    }

    // Si la opción es 'envio', validamos los campos
    const result = await trigger([
      'fullName', 
      'address', 
      'city', 
      'postalCode', 
      'phone'
    ]);
    setValid(result); // Actualiza el estado de validación
    return result;
  };

  useEffect(() => {
    setChildValidationFunc(() => validateShipping);

    // Si se selecciona 'retiro', marcar como válido inmediatamente
    if (selectedOption === "retiro") {
      setValid(true); // Validación exitosa sin necesidad de cambios
    }
  }, [selectedOption, isDirty]);

  const onSubmit = (data) => {
    console.log("Form Data:", {
      ...data,
      deliveryType: selectedOption
    });
  };

  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      p={4}
    >
      <Box
        borderRadius="md"
        p={6}
        w={{ base: "85vw", md: "500px" }}
        minW="300px"
      >
        <Text 
          mx={4} 
          fontWeight="medium" 
          mb={5} 
          fontFamily="Roboto" 
          textAlign="center" 
          fontSize={{base:'lg',md:"2xl"}} 
          color="#e1bc6a" 
          mt="20px"
        >
          Tipo de entrega
        </Text>
        
        <RadioGroup
          onChange={setSelectedOption}
          value={selectedOption}
          defaultValue="retiro"
        >
          <HStack spacing={4} align="stretch">
            {items.map((item) => (
              <Box
                key={item.value}
                borderWidth="1px"
                borderColor="#e1bc6a"
                borderRadius="md"
                p={4}
                display="grid"
                gridTemplateRows="auto 1fr auto"
                gridTemplateColumns="1fr auto"
                gap={2}
                alignItems="center"
                textAlign="center"
                minW="200px"
                w="100%"
                cursor="pointer"
                onClick={() => setSelectedOption(item.value)}
              >
                <Icon
                  as={item.icon}
                  boxSize={6}
                  color="#e1bc6a"
                  gridRow="1"
                  gridColumn="1"
                />
                <Radio value={item.value}>{item.title}</Radio>
                <Text gridRow="3" gridColumn="1 / span 2" mt={2}>
                  {item.description}
                </Text>
              </Box>
            ))}
          </HStack>
        </RadioGroup>

        {/* Shipping Form */}
        {selectedOption === "envio" && (
          <Box mt={6}>
            <Text fontSize="lg" mb={4}>
              Complete los datos para el envío
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb={4} isInvalid={!!errors.fullName}>
                <FormLabel htmlFor="fullName">Nombre completo</FormLabel>
                <Input
                  id="fullName"
                  focusBorderColor="#e1bc6a"
                  {...register("fullName", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.fullName && (
                  <Text color="red.500">{errors.fullName.message}</Text>
                )}
              </FormControl>

              <FormControl mb={4} isInvalid={!!errors.address}>
                <FormLabel htmlFor="address">Dirección de envío</FormLabel>
                <Input
                  id="address"
                  focusBorderColor="#e1bc6a"
                  {...register("address", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.address && (
                  <Text color="red.500">{errors.address.message}</Text>
                )}
              </FormControl>

              <FormControl mb={4} isInvalid={!!errors.city}>
                <FormLabel htmlFor="city">Ciudad</FormLabel>
                <Input
                  id="city"
                  focusBorderColor="#e1bc6a"
                  {...register("city", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.city && (
                  <Text color="red.500">{errors.city.message}</Text>
                )}
              </FormControl>

              <FormControl mb={4} isInvalid={!!errors.postalCode}>
                <FormLabel htmlFor="postalCode">Código postal</FormLabel>
                <Input
                  id="postalCode"
                  focusBorderColor="#e1bc6a"
                  {...register("postalCode", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: postalCodeRegex,
                      message: "Número postal no válido",
                    },
                  })}
                />
                {errors.postalCode && (
                  <Text color="red.500">{errors.postalCode.message}</Text>
                )}
              </FormControl>

              <FormControl mb={4} isInvalid={!!errors.phone}>
                <FormLabel htmlFor="phone">Teléfono de contacto</FormLabel>
                <Input
                  id="phone"
                  focusBorderColor="#e1bc6a"
                  {...register("phone", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "El teléfono debe tener 10 dígitos",
                    },
                  })}
                />
                {errors.phone && (
                  <Text color="red.500">{errors.phone.message}</Text>
                )}
              </FormControl>

              <button type="submit" style={{ display: "none" }}></button>
            </form>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Shipping;
