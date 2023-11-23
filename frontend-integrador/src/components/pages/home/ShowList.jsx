import React, { useEffect } from "react";
import { useProductContext } from "./Global.context";
import { VStack, SimpleGrid, Link,Text,Box } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";
import RenderPagination from "./RenderPagination";
const ShowList = () => {
  const { paginatedData,showFav,favorites,setShowFav,getProducts } = useProductContext();

  useEffect(()=>{
    if(showFav && favorites.length === 0){
      getProducts()
    }
  },[favorites,showFav])

  return (
    <VStack>
      {showFav && <Text fontSize={40} textShadow='1px 1px 10px #00cc00' >{favorites.length > 0 ? "Tus Favoritos":"No tienes ningun favorito" }</Text>}
      <SimpleGrid
        minH={"100vh"}
        columns={{ base: 1, md: 2 }}
        pt={16}
        spacing={20}
      >
        {paginatedData.map((item) => (
          <ProductCardContainer key={item.id}>
            <ProductCard item={item} />
          </ProductCardContainer>
        ))}
      </SimpleGrid>
      {paginatedData && <RenderPagination />}
    </VStack>
  );
};

export default ShowList;
