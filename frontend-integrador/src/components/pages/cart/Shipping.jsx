import React, { useState } from "react";
import {
  HStack,
  RadioGroup,
  Radio,
  Text,
  Box,
  Icon,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { FaStore, FaTruck } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useProductContext } from "../home/Global.context";

function Shipping() {

  
  const { updateCarrito, deleteCarrito, setCarrito, carrito, clientId, size, setSize, sale, setSale } =
useProductContext();
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

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    const venta = {
      ...sale,
      productList: carrito.products,
      idUser: clientId,
      entrega: selectedOption,
      domicilio: '',
    }
  };

  return (
    <Box
      position="relative" // Asegura que el Box esté en su posición original
      top={0} // Alinea el contenedor al principio de la página
      display="flex"
      justifyContent="center"
      alignItems="flex-start" // Alinea el contenido hacia el principio verticalmente
    //   h="90vh"
      p={4}
    >
      <Box
        borderRadius="md"
        p={6}
        w={{ base: "85vw", md: "500px" }}
        minW="300px"
      >
        {/* <h2 className="title-payments">Tipo de entrega</h2> */}
        <Text mx={4} fontWeight="medium" mb={5} fontFamily={"Roboto"} textAlign={'center'} fontSize={{base:'lg',md:"2xl"}} color={'#e1bc6a'} mt={'20px'}>
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
                borderColor="#e1bc6a" // Color del borde personalizado
                borderRadius="md"
                p={4}
                display="grid"
                gridTemplateRows="auto 1fr auto"
                gridTemplateColumns="1fr auto"
                gap={2}
                alignItems="center"
                textAlign="center"
                minW="200px"
                w="100%" // Asegura que el Box ocupe todo el espacio disponible
                cursor="pointer"
                onClick={() => setSelectedOption(item.value)} // Cambia el valor al hacer clic
              >
                <Icon
                  as={item.icon}
                  boxSize={6}
                  color="#e1bc6a" // Color del icono personalizado
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

        {/* Formulario de envío */}
        {selectedOption === "envio" && (
          <Box mt={6}>
            <Text fontSize="lg" mb={4}>
              Complete los datos para el envío
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mb={4}>
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

              <FormControl mb={4}>
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

              <FormControl mb={4}>
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

              <FormControl mb={4}>
                <FormLabel htmlFor="postalCode">Código postal</FormLabel>
                <Input
                  id="postalCode"
                  focusBorderColor="#e1bc6a"
                  {...register("postalCode", {
                    required: "Este campo es obligatorio",
                  })}
                />
                {errors.postalCode && (
                  <Text color="red.500">{errors.postalCode.message}</Text>
                )}
              </FormControl>

              {/* Nuevo campo para el teléfono de contacto */}
              <FormControl mb={4}>
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

              {/* <Button type="submit" color="#e1bc6a">Enviar</Button> */}
            </form>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Shipping;
