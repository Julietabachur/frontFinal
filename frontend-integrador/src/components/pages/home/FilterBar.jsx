import { Text, VStack, Button, SimpleGrid, Box, Image, Heading, HStack, Collapse } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useProductContext } from "./Global.context";
import axios from "axios";

const FilterBar = () => {
  const {
    categories,
    setCategories,
    setCurrentPage,
    getProductsByType,
    currentPage,
    totalElements,
  } = useProductContext();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState(null);

  const token = import.meta.env.VITE_TOKEN;
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/public/category/all`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response) {
          setCategoryList(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
  }, []);

  const handleCategoryClick = (category) => {
   /*setCurrentPage(1); */
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    } else {
      let updatedCategories = categories.filter((item) => item !== category);
      setCategories(updatedCategories);
    }
  };

  const handleFiltros = () => {
    setCategories([]);
    setSelectedCategoryGroup(null);
  };

  const toggleCategoryGroup = (groupName) => {
    setSelectedCategoryGroup(selectedCategoryGroup === groupName ? null : groupName);
  };

  const tops = categoryList.filter((category) =>
    ["REMERA", "CAMISA", "BUZO", "CAMPERA", "PULLOVER"].includes(category.categoryName)
  );
  const bottoms = categoryList.filter((category) =>
    ["PANTALÓN", "POLLERA"].includes(category.categoryName)
  );
  const accessories = categoryList.filter((category) =>
    ["ACCESORIO"].includes(category.categoryName)
  );

  return (
    <VStack w="100%" bg="white" p={8} spacing={5} align="flex-start">
      <Heading
        color="black"
        fontFamily="Roboto"
        fontWeight="bold"
        fontSize={[20, 24, 28]}
        textAlign="center"
        w="100%"
      >
        Descubre nuestro catálogo
      </Heading>

      <SimpleGrid columns={3} spacing={4} w="100%">
        {[{ title: 'Partes de Arriba', data: tops }, { title: 'Partes de Abajo', data: bottoms }, { title: 'Accesorios', data: accessories }].map((group) => (
          <Box
            key={group.title}
            borderRadius="md"
            overflow="hidden"
            cursor="pointer"
            onClick={() => toggleCategoryGroup(group.title)}
            position="relative"
            bg="gray.100"
            height="400px"
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
            <Collapse in={selectedCategoryGroup === group.title} animateOpacity>
              <SimpleGrid columns={2} spacing={4} mt={2}>
                {group.data.map((category) => (
                  <Box
                    key={category.id}
                    borderRadius="md"
                    border={categories.includes(category.categoryName) ? "3px solid gold" : "1px solid #e0e0e0"}
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.categoryName);
                    }}
                    transition="border 0.3s ease"
                    bg={categories.includes(category.categoryName) ? "yellow.100" : "white"}
                    _hover={{ border: "3px solid gold" }}
                  >
                    <Image
                      w="100%"
                      h="70%"
                      objectFit="cover"
                      src={category.imageUrl}
                      fallbackSrc="https://via.placeholder.com/150"
                      alt={`Imagen de ${category.description}`}
                    />
                    <Text fontSize={{ base: 12, md: 14, lg: 16 }} color="black" p={2} fontWeight="medium" textAlign="center">
                      {category.description}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Collapse>
          </Box>
        ))}
      </SimpleGrid>

      <HStack spacing={4} mt={8}>
        <Button
          h={10}
          px={6}
          colorScheme="red"
          fontSize={{ base: 14, lg: 16 }}
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
