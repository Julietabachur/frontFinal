import {
  Text,
  VStack,
  Button,
  HStack,
  Image,
  Box
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {  useProductContext } from "./Global.context";
import axios from "axios";

const FilterBar = () => {
const {categories,setCategories,currentPage,setCurrentPage,setPaginatedData} = useProductContext()
const [categoryList, setCategoryList] = useState([])
const token = import.meta.env.VITE_TOKEN;
const baseUrl = import.meta.env.VITE_SERVER_URL;

const getProductsByType = async (categories, currentPage=1) => {
  console.log(categories);
  try {
    const response = await axios.get(
      `${baseUrl}/api/v1/public/products/category?categories=${categories}&page=${currentPage}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      setPaginatedData(response.data)
    }
  } catch (error) {
    console.error(error);
  }
};

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
  getProductsByType(categories)
};

/* //si se cancelan todos los filtros te vuelve a  la lista de mesclados
useEffect(() => {
  if (categories.length === 0) {
    setFiltered(false);
  }
}, [categories]); */


  /* useEffect(() => {
    getProductsByType(categories);
  }, [currentPage,categories]); */


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
              {/* <Text
                color={"verde2"}
                fontSize={{ base: 12, lg: 18 }}
              >{`Estás viendo ${cant} productos`}</Text> */}
            </VStack>
          </HStack>
  );
};
//   );

export default FilterBar;
