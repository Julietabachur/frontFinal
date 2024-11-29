import { Text, VStack, Button, SimpleGrid, Box, Image, HStack } from "@chakra-ui/react";
import React from "react";
import { useProductContext } from "./Global.context";
import { useNavigate } from "react-router-dom";

const FilterBar = () => {
  const {
    categories,
    showFav,
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
    setSeason('')
    setShowFav(false)
    setCategories(categoryGroup);
  };

  const handleFiltros = () => {
    setCategories([]);
    setIsFilteredByCategory(false); // Desactiva el filtro de categoría
    setSeason('Primavera')
    setShowFav(false)

    setTimeout(() => {
      navigate("/"); // Redirigir después de un pequeño retraso
    }, 50); // 100ms de retraso
    
  };

  const tops = [
    { categoryName: "T-SHIRT", imageUrl: '../Parte Arriba.jpg' },
    { categoryName: "SHIRT", imageUrl: '../Parte Arriba.jpg' },
    { categoryName: "HOODIE", imageUrl: '../Parte Arriba.jpg' },
    { categoryName: "JACKET", imageUrl: '../Parte Arriba.jpg' },
    { categoryName: "SWEATER", imageUrl: '../Parte Arriba.jpg' },
  ];
  const bottoms = [
    { categoryName: "PANT", imageUrl: '../Parte Abajo.jpg' },
    { categoryName: "SKIRT", imageUrl: '../Parte Abajo.jpg' },
  ];
  const accessories = [
    { categoryName: "ACCESSORY", imageUrl: '../Accesorios.jpg' },
  ];

  /* return (
    <VStack w="100%" bg="white" p={8} spacing={5} align="flex-start">
      <SimpleGrid columns={3} spacing={4} w="100%">
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
            height="400px"
            border={categories.includes(group.title) ? "3px solid gold" : "1px solid #e0e0e0"}
            bgColor={categories.includes(group.title) ? "yellow.100" : "white"}
            boxShadow={categories.includes(group.title) ? "0 0 20px rgba(255, 215, 0, 0.5)" : "none"}
            transition="border 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease"
            _hover={{ transform: "scale(1.05)", boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)" }}
          >
            <Image
              src={group.data[0]?.imageUrl || 'https://via.placeholder.com/300'}
              alt={group.title}
              objectFit="cover"
              width="100%"
              height="100%"
              position="absolute"
              top={0}
              left={0}
              zIndex={1}
              filter="brightness(0.5)"
            />
            <Text
              fontSize={{ base: 20, md: 24 }}
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
          h={8} // Tamaño más pequeño
          px={4}
          colorScheme="yellow"
          fontSize={{ base: 12, lg: 14 }}
          bg="gold"
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
        display={categories.length > 0 || showFav ? "block" : "none"}
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