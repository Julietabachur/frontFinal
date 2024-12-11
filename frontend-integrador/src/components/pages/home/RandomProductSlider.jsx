import { Box, Button, Flex, HStack, Text } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useProductContext } from "./Global.context";
import { useState, useEffect } from "react";
import ProductCardContainer from "./ProductCardContainer";
import ProductCard from "./ProductCard";
import RenderPagination from "./RenderPagination"; // Componente de paginación importado
import axios from "axios";


const RandomProductSlider = () => {
  const { paginatedDataBySeason, setSeason, getProductsBySeason, setPaginatedData, totalElements, setCurrentPage} = useProductContext();
  const baseUrl = import.meta.env.VITE_SERVER_URL;


  return (
    paginatedDataBySeason ? (
      <Flex direction="column" alignItems="center" m={{ base: 4, md: 8 }}>
        <Text fontSize={'2xl'} fontWeight={'semibold'} mb={'2rem'}>Lo que se viene 💣</Text>
        <ProductCardContainer>
          <Flex direction={{ base: "column", md: "row" }} gap={4} wrap="wrap" justifyContent="center" >
            {paginatedDataBySeason.map((item, index) => (
              <ProductCard key={index} item={item} />
            ))}
          </Flex>
        </ProductCardContainer>
        <RenderPagination />

      </Flex>
    ) : null
  
    
  )
};

export default RandomProductSlider;