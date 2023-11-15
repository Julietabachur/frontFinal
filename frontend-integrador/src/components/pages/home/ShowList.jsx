import React, { useEffect } from "react";
import { useProductContext } from "./Global.context";
import { VStack, SimpleGrid, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";
import RenderPagination from "./RenderPagination";
const ShowList = () => {
  const { paginatedData } = useProductContext();

  return (
    <VStack>
      <SimpleGrid
        minH={"100vh"}
        columns={{ base: 1, md: 2 }}
        pt={16}
        spacing={20}
      >
        {paginatedData.map((item) => (
          <Link key={item.id} as={ReactRouterLink} to={`/detalle/${item.id}`}>
            <ProductCardContainer key={item.id}>
              <ProductCard item={item} />
            </ProductCardContainer>
          </Link>
        ))}
      </SimpleGrid>
      {paginatedData && <RenderPagination />}
    </VStack>
  );
};

export default ShowList;
