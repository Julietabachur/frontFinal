import { Text, VStack, Button, SimpleGrid, Box, Image, HStack } from "@chakra-ui/react";
import React from "react";
import { useProductContext } from "./Global.context";
import { useNavigate } from "react-router-dom";

const FilterBar = () => {
  const {
    categories,
    setCategories,
    setCurrentPage,
    getProductsByTypeFilterBar,
    totalElements,
    setSeason,
    setShowFav,
    setIsFilteredByCategory
  } = useProductContext();
  const navigate = useNavigate();
  const handleCategoryClick = async (categoryGroup) => {
    // debugger
    setSeason('')
    setShowFav(false)
    setCategories(categoryGroup);
  };

  const handleFiltros = () => {
    setSeason("Primavera");
    setCategories([]);
    setIsFilteredByCategory(false); // Desactiva el filtro de categoría
    setShowFav(false)
    setTimeout(() => {
      navigate("/"); // Redirigir después de un pequeño retraso
    }, 100); // 100ms de retraso
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
 */

return (
  <VStack w="100%" bg="white" p={2} pb={0} spacing={5} align="flex-start">
    <SimpleGrid columns={{ base: 3, sm: 3, md: 3 }} spacing={4}  justifyContent="center" // Centra horizontalmente
  alignItems="center" // Centra verticalmente, si es necesario
  w="80%" // Establece el ancho del contenedor al 80%
  margin="0 auto">
      {[{ title: 'Partes de Arriba', data: tops }, { title: 'Partes de Abajo', data: bottoms }, { title: 'Accesorios', data: accessories }].map((group) => (
        <Box
          key={group.title}
          borderRadius="md"
          overflow="hidden"
          cursor="pointer"
          onClick={async (e) => {
            e.stopPropagation();
            await handleCategoryClick(group.data.map(category => category.categoryName));
          }}
          position="relative"
          bg="gray.100"
          height={{ base: "180px", md: "200px" }} // Cambiar height para ser automático en pantallas pequeñas
          border={categories.includes(group.title) ? "3px solid color" : "1px solid #e0e0e0"}
          bgColor={categories.includes(group.title) ? "color" : "white"}
          // boxShadow={categories.includes(group.title) ? "0px 7px 17px 0px #e1bc6a;" : "none"}
          transition="border 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease"
          _hover={{ transform: "scale(1.01)", boxShadow: "lg" }}
        >
          <Box width="100%" height="0" paddingBottom={{ base: "75%", sm: "50%", md: "50%" }} borderRadius="md"> {/* Cambiar paddingBottom para pantallas pequeñas */}
            <Image
              src={group.data[0]?.imageUrl || 'https://via.placeholder.com/300'}
              alt={group.title}
              objectFit="cover"
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              borderRadius="md"
              filter="brightness(0.5)"
            />
          </Box>
          <Text
            fontSize={{ base: 16, md: 20, lg: 24 }}
            color="white"
            position="absolute"
            bottom={4}
            left="50%"
            transform="translateX(-50%)"
            zIndex={2}
            textAlign="center"
            fontWeight="bold"
          >
            {group.title}
          </Text>
        </Box>
      ))}
    </SimpleGrid>

    <HStack spacing={4} mt={4} justify="flex-end" w="100%">
      <Button
        h={{ base: 8, md: 10 }} 
        px={4}
        // colorScheme="yellow"
        fontSize={{ base: 12, lg: 14 }}
        bg="color"
        color="white"
        _hover={{ bg: "yellow.500" }}
        onClick={handleFiltros}
        boxShadow="lg"
        display={categories.length > 0 ? "block" : "none"}
      >
        Borrar Filtros
      </Button>
    </HStack>

    <Text color={"gray.600"} fontSize={{ base: 12, md: 14, lg: 16 }} mt={6}>
      Mostrando <b>{totalElements}</b> resultados.
    </Text>
  </VStack>
);

};

export default FilterBar;
