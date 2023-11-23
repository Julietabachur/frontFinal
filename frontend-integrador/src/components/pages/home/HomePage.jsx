<<<<<<< HEAD
import { useState, useEffect } from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";
import axios from "axios";
import {
  useParams,
  useNavigate,
  Link as ReactRouterLink,
} from "react-router-dom";
import {
  VStack,
  Box,
  HStack,
  Input,
  SimpleGrid,
  Image,
  Text,
  Button,
  Center,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";
import RenderPagination from "./RenderPagination";
=======
import { VStack, Box } from "@chakra-ui/react";
import SearchBar from "./searchBar/SearchBar";
import ShowList from "./ShowList";
import FilterBar from "./FilterBar";

>>>>>>> 7a6b67a621eafbc64ebbf7458345e1702ff24511

const HomePage = () => {
  //const token = import.meta.env.VITE_TOKEN;
  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const baseUrl = import.meta.env.VITE_SERVER_URL;



  return (
<<<<<<< HEAD
    <
      Box w={'99vw'} bg={"blanco"}  /*p={9}*/
    
    >

      <VStack margin={"0px auto"} rowGap={0}>
        {/* buscador */}
        <HStack
          color={"negro"}
          w={"100%"}
          bg={"#444444"}
          justify={"center"}
          h={{ base: "auto", md: "75px" }} // Altura responsiva
          align={"Center"}
          /*p={9}*/
          mt={5}
          
        >
          {!media && <Text fontSize={{ base: "1rem", md: "1.5rem" }}  >¿Qué buscas?</Text>}
          <Input
            bg={"blanco"}
            w={{ base: "80%", md: "50%" }} // Ancho responsivo
            h={{ base: "50px", md: "50px" }} // Altura responsiva
            placeholder="Buscar productos"
            _placeholder={{ color: "inherit" }}
            borderRadius={"15px"}
            m={{ base: 2, md: 10 }} // Márgenes responsivos
          />
          <Button
           h={{ base: "50px", md: "50px" }} // Altura responsiva
            color={"blanco"}
            borderRadius={20}
            bg={"negro"}
            fontSize={{ base: "0.8rem", md: "1rem" }} // Tamaño de fuente responsivo
            mr={5}
            >
            Buscar
          </Button>
        </HStack>

        {/* categorias */}
        {media && (
          <Menu>
            <MenuButton minW={'99vh'} bg={"negro"}>
              
                <Text
                  fontFamily={"podkova"}
                  color={"verde2"}
                  fontSize={17}
                  p={3}
                >
                  Categorias
                </Text>
            </MenuButton>
            <MenuList bg={"negro"}>
              {categoriesData.map((category) => (
                <MenuItem
                  bg={"negro"}
                  key={category.id}
                  textAlign="center"
                  onClick={() => handleCategoryClick(category.type)}
                >
                  <Link
                    fontFamily={"podkova"}
                    color={"verde2"}
                    fontSize={17}
                    p={3}
                  >
                    {category.name}
                  </Link>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}
        {!media && (
          <HStack justify={"space-around"} h={35} w={"100%"} bg={"negro"}>
            {/* Muestra las tarjetas de categorías */}
            {categoriesData.map((category) => (
              <Box
                key={category.id}
                textAlign="center"
                onClick={() => handleCategoryClick(category.type)}
              >
                {" "}
                <Link
                  fontFamily={"podkova"}
                  color={"verde2"}
                  fontSize={17}
                  p={3}
                >
                  {category.name}
                </Link>
              </Box>
            ))}
          </HStack>
        )}

        <SimpleGrid minH={'100vh'} columns={{ sm: 1, md: 2 }} padding={20} spacing={20}>
          {isLoading &&
            Skeletons.map((Skeleton) => {
              return (
                <ProductCardContainer key={Skeleton}>
                  <ProductCardSkeleton />
                </ProductCardContainer>
              );
            })}
          {lista.map((item) => (
            <Link key={item.id} as={ReactRouterLink} to={`/detalle/${item.id}`}>
              <ProductCardContainer key={item.id}>
                <ProductCard item={item} />
              </ProductCardContainer>
            </Link>
          ))}
        </SimpleGrid>
        {pageData && (
          <RenderPagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
=======
    <div>
    <Box w={"99vw"} bg={"blanco"} >
      <VStack >
        <SearchBar />
        <FilterBar />
        <ShowList />
>>>>>>> 7a6b67a621eafbc64ebbf7458345e1702ff24511
      </VStack>
    </Box>
    </div>
  );
};

export default HomePage;
