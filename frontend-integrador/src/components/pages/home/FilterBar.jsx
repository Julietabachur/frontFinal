import { Text, VStack, Button, HStack, Image, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useProductContext } from "./Global.context";
import axios from "axios";

const FilterBar = () => {
  const {
    categories,
    setCategories,
    setPaginatedData,
    setCurrentPage,
    getProductsByType,
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
    await setCurrentPage(1)
    await getProductsByType(categories);
  };

/*   useEffect(() => {
    if (categories.length > 0) {
      getProductsByType(categories);
    }
  }, [currentPage, categories]); */

  return (
    <HStack
      justify={"space-around"}
      w={"100%"}
      bg={"negro"}
      pr={"40px"}
      pt={2}
      pb={2}
    >
      {/* Muestra las tarjetas de categorías */}
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
    </HStack>
  );
};
//   );

export default FilterBar;
