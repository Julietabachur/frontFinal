
import { Text, VStack, Button, HStack, Image, Box,SimpleGrid, Heading } from "@chakra-ui/react";
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
   /*  setCurrentPage(1); */
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    } else {
      let updatedCategories = categories.filter((item) => item !== category);
      setCategories(updatedCategories);
    }
  };

  const handleFiltros = () => {
    setCategories([]);
  };

  const handleFilterSearch = async () => {
    await getProductsByType(categories);
  };


  return (
  
   <VStack w={'100%'} bg={'negro'} position={"relative"} bottom={2} p={8} shadow={'dark-lg'} spacing={5}>
    <Heading color={"white"} fontFamily={"Podkova"} letterSpacing={1} fontWeight="medium" fontSize={[16, 22, 28]}>Descubre nuestro catálogo</Heading>

    <SimpleGrid w={'100%'} h={'80%'} minChildWidth={['50px', '100px']} spacing={3}  >
    {categoryList.map((category) => (
        <Box
          key={category.id}
          w={'100%'}
          h={['60px', '90px', '150px']}
          fontFamily={"Podkova"}
          textAlign="center"
          onClick={() => handleCategoryClick(category.categoryName)}
          style={{
            boxShadow:categories.includes(category.categoryName)
            ? "1px 10px 28px green"
            : "none",
            border: categories.includes(category.categoryName)
              ? "3px solid #00cc00"
              : "none",
          }}
        >
          <Box bg={"verde2"} /*bg={"gray.200"}*/ w={'100%'} h={'100%'}>
            <Image
              w={'100%'}
              h={'80%'}
              objectFit={"cover"}
              src={category.imageUrl}
              fallbackSrc="https://via.placeholder.com/150"
            />
            <Text fontSize={{ base: 10, sm:15, lg: 18 }} color={"negro"}>{category.description}</Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
    
    <HStack mt={4} spacing={4}>
    <Button
          h={[5,6,7]}
          color={"white"}
          bg={"verde2"}
          fontSize={{ base: 10, lg: 16 }}
          w={{ base: "80px", sm: "80px", md: '100px', lg: 40 }}
          /*w={{ base: "60px", lg: 40 }}*/
          onClick={() => handleFilterSearch()}
        >
          Aplicar Filtros
        </Button>
        <Button
          h={[5,6,7]}
          color={"black"}
          bg={"gray.200"}
          fontSize={{ base: 10, lg: 16 }}
          w={{ base: "80px", sm: "80px", md: '100px', lg: 40 }}
          onClick={() => handleFiltros()}
        >
          Borrar Filtros
        </Button>
        <Text
          color={"verde2"}
          fontSize={{ base: 10, lg: 16 }}
        >{`Estás viendo ${totalElements} productos`}</Text>
    </HStack>
    
    
   </VStack>
  );
};

export default FilterBar;
