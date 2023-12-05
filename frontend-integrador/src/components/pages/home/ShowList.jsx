import React, { useEffect }  from "react";
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
      console.log('favs: ', favorites);
    }
  },[favorites,showFav])

  return (
    <VStack>
      {showFav && <Text fontSize={40} fontWeight="medium" fontFamily={"Saira"} fontSize={"1.8rem"} textShadow='1px 1px 10px #00cc00' mt={'70px'} >{paginatedData.length != 0 ? "Tus Favoritos":"Tu lista de favoritos está vacía" }</Text>}
      <SimpleGrid
        minH={"100vh"}
        columns={{ base: 1, md: 2 }}
        pt={12}
        spacing={[5,10,20]}
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
