import { Text, VStack, Button, SimpleGrid, Box, Image, HStack } from "@chakra-ui/react";
import React from "react";
import { useProductContext } from "./Global.context";

const FilterBar = () => {
  const {
    categories,
    setCategories,
    setCurrentPage,
    getProductsByTypeFilterBar,
    totalElements,
    setSeason,
  } = useProductContext();

  const handleCategoryClick = async (categoryGroup) => {
    setSeason("");
    setCategories(categoryGroup);
  };

  const handleFiltros = () => {
    setSeason("Primavera");
    setCategories([]);
    setCurrentPage(0);
  };

  const tops = [
    { categoryName: "T-SHIRT", imageUrl: "../Parte Arriba.jpg" },
    { categoryName: "SHIRT", imageUrl: "../Parte Arriba.jpg" },
    { categoryName: "HOODIE", imageUrl: "../Parte Arriba.jpg" },
    { categoryName: "JACKET", imageUrl: "../Parte Arriba.jpg" },
    { categoryName: "SWEATER", imageUrl: "../Parte Arriba.jpg" },
  ];
  const bottoms = [
    { categoryName: "PANT", imageUrl: "../Parte Abajo.jpg" },
    { categoryName: "SKIRT", imageUrl: "../Parte Abajo.jpg" },
  ];
  const accessories = [
    { categoryName: "ACCESSORY", imageUrl: "../Accesorios.jpg" },
  ];

  return (
    <VStack w="100%" bg="white" p={{ base: 4, md: 8 }} pb={0} spacing={5} align="flex-start">
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }} // Ajuste de columnas según el tamaño de pantalla
        spacing={4}
        w="100%"
      >
        {[{ title: "Partes de Arriba", data: tops }, { title: "Partes de Abajo", data: bottoms }, { title: "Accesorios", data: accessories }].map((group) => (
          <Box
            key={group.title}
            borderRadius="md"
            overflow="hidden"
            cursor="pointer"
            onClick={async (e) => {
              e.stopPropagation();
              await handleCategoryClick(group.data.map((category) => category.categoryName));
            }}
            position="relative"
            bg="gray.100"
            height={{ base: "250px", md: "300px" }} // Altura ajustada para más espacio para el texto
            width="100%"
            border="none" // Eliminar el borde
            boxShadow={categories.includes(group.title) ? "0px 7px 17px rgba(225, 188, 106, 0.5)" : "none"}
            transition="box-shadow 0.3s ease"
            _hover={{ transform: "scale(1.05)", boxShadow: "0px 7px 17px rgba(225, 188, 106, 0.5)" }}
          >
            <Box position="relative" width="100%" height="0" paddingBottom={{ base: "80%", md: "60%" }}>
              <Image
                src={group.data[0]?.imageUrl || "https://via.placeholder.com/300"}
                alt={group.title}
                objectFit="cover"
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                borderRadius="md"
                filter="brightness(0.6)"
              />
              <Box
                position="absolute"
                top="75%" // Ajusta la posición del texto al 75% de la altura de la tarjeta
                left={0}
                width="100%"
                bg="rgba(0, 0, 0, 0.7)" // Fondo semi-transparente
                color="white"
                py={2}
                textAlign="center"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderTopRadius="md" // Agrega un borde redondeado en la parte superior
              >
                <Text 
                  fontSize={{ base: "lg", md: "xl" }} // Tamaño de fuente más grande
                  fontWeight="bold"
                  textAlign="center"
                  whiteSpace="normal" // Permitir salto de línea si es necesario
                  lineHeight={1.2} // Espaciado entre líneas
                  px={2} // Espacio en los lados
                >
                  {group.title}
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <HStack spacing={4} mt={4} justify="flex-end" w="100%">
        <Button
          h={{ base: 8, md: 10 }}
          px={4}
          fontSize={{ base: "xs", md: "sm" }}
          bg="#e1bc6a"
          color="white"
          _hover={{ bg: "yellow.500" }}
          onClick={handleFiltros}
          boxShadow="lg"
          display={categories.length > 0 ? "block" : "none"}
        >
          Borrar Filtros
        </Button>
      </HStack>

      <Text color="gray.600" fontSize={{ base: "sm", md: "md" }} mt={6}>
        Mostrando <b>{totalElements}</b> resultados.
      </Text>
    </VStack>
  );
};

export default FilterBar;
