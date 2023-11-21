import {
  Text,
  VStack,
  Button,
  HStack,
  Image,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
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
    setCurrentPage(1);
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

  useEffect(() => {
    if(Array.isArray(categories)){
      categories.length > 0 && getProductsByType(categories);
    }
   
  }, [currentPage,categories]);

  return (
    <VStack
      w={"100%"}
      bg={"negro"}
      position={"relative"}
      top={"14px"}
      p={5}
      shadow={"dark-lg"}
    >
      <SimpleGrid
        w={"100%"}
        h={"80%"}
        minChildWidth={["50px", "100px"]}
        spacing={2}
      >
        {categoryList.map((category) => (
          <Box
            key={category.id}
            w={"100%"}
            h={["60px", "90px", "150px"]}
            textAlign="center"
            onClick={() => handleCategoryClick(category.categoryName)}
            style={{
              boxShadow: categories.includes(category.categoryName)
                ? "1px 10px 28px green"
                : "none",
              border: categories.includes(category.categoryName)
                ? "3px solid #00cc00"
                : "none",
            }}
          >
            <Box bg={"verde2"} w={"100%"} h={"100%"}>
              <Image
                w={"100%"}
                h={"80%"}
                objectFit={"cover"}
                src={category.imageUrl}
                fallbackSrc="https://via.placeholder.com/150"
              />
              <Text fontSize={{ base: 10, lg: 18 }} color={"negro"}>
                {category.categoryName}
              </Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
      <HStack mt={2}>
        <Button
          h={7}
          color={"blanco"}
          bg={"verde2"}
          fontSize={{ base: 12, lg: 18 }}
          w={{ base: "60px", lg: 40 }}
          onClick={() => handleFilterSearch()}
        >
          Filtrar
        </Button>
        <Button
          h={7}
          color={"blanco"}
          bg={"red.400"}
          fontSize={{ base: 10, lg: 18 }}
          w={{ base: "80px", sm: "80px", md: "100px", lg: 40 }}
          onClick={() => handleFiltros()}
        >
          Borrar Filtros
        </Button>
        <Text
          color={"verde2"}
          fontSize={{ base: 12, lg: 18 }}
        >{`Estás viendo ${totalElements} productos`}</Text>
      </HStack>
    </VStack>
  );
};

export default FilterBar;
{
  /* <HStack
      justify={"space-around"}
      w={"100%"}
      bg={"negro"}
      pr={"40px"}
      mt={'2px'}
      pt={2}
      pb={2}
    >
      
      {categoryList.map((category) => (
        <Box
          key={category.id}
          textAlign="center"
          onClick={() => handleCategoryClick(category.categoryName)}
          style={{
            border: categories.includes(category.categoryName)
              ? "3px solid #00cc00"
              : "none",
          }}
        >
          <Box bg={"verde2"}>
            <Image
              w={{ base: 100, lg: 150 }}
              h={{ base: 100, lg: 150 }}
              objectFit={"cover"}
              src={category.imageUrl}
              fallbackSrc="https://via.placeholder.com/150"
            />
            <Text color={"negro"}>{category.categoryName}</Text>
          </Box>
        </Box>
      ))}
      <VStack w={"20%"} pl={10}>
        <Button
          h={7}
          color={"blanco"}
          bg={"verde2"}
          w={{ base: "100px", lg: 40 }}
          onClick={() => handleFilterSearch()}
        >
          Filtrar
        </Button>
        <Button
          h={7}
          color={"blanco"}
          bg={"red.400"}
          w={{ base: "100px", lg: 40 }}
          onClick={() => handleFiltros()}
        >
          Borrar Filtros
        </Button>
        <Text
          color={"verde2"}
          fontSize={{ base: 12, lg: 18 }}
        >{`Estás viendo ${totalElements} productos`}</Text>
      </VStack>
    </HStack> */
}

{
  /*  <HStack
    justify={"space-around"}
    w={"100%"}
    bg={"negro"}
    pr={"40px"}
    mt={'22px'}
    pt={2}
    pb={2}
  >
    
    {categoryList.map((category) => (
      <Box
        key={category.id}
        
        textAlign="center"
        onClick={() => handleCategoryClick(category.categoryName)}
        style={{
          border: categories.includes(category.categoryName)
            ? "3px solid #00cc00"
            : "none",
        }}
      >
        <Box bg={"verde2"}
         w={{ base: '40px',}}
        h={{ base: '60px'}}
         overflow={'hidden'} >
          <Image
           w={{ base: '40px'}}
            h={{ base: '40px' }}
            objectFit={"cover"}
            src={category.imageUrl}
            fallbackSrc="https://via.placeholder.com/150"
          />
          <Text color={"negro"}  >{category.categoryName}</Text>
        </Box>
      </Box>
    ))}
    <VStack w={"20%"} pl={10}>
      <Button
        h={7}
        color={"blanco"}
        bg={"verde2"}
        w={{ base: "100px", lg: 40 }}
        onClick={() => handleFilterSearch()}
      >
        Filtrar
      </Button>
      <Button
        h={7}
        color={"blanco"}
        bg={"red.400"}
        w={{ base: "100px", lg: 40 }}
        onClick={() => handleFiltros()}
      >
        Borrar Filtros
      </Button>
      <Text
        color={"verde2"}
        fontSize={{ base: 12, lg: 18 }}
      >{`Estás viendo ${totalElements} productos`}</Text>
    </VStack>
  </HStack> */
}
