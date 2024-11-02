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
  } = useProductContext();

  const handleCategoryClick = async (categoryGroup) => {
    setCategories(categoryGroup);
    setCurrentPage(0);
    await getProductsByTypeFilterBar(categoryGroup);
  };

  const handleFiltros = () => {
    setCategories([]);
    setCurrentPage(0);
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

  return (
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
