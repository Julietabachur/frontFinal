import React, { useEffect }  from "react";
import { useProductContext } from "./Global.context";
import { VStack,Icon, SimpleGrid, Link,Text,Box } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";
import RenderPagination from "./RenderPagination";
import { FaTruck, FaCreditCard, FaWhatsapp } from 'react-icons/fa';


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
      {showFav && <Text fontWeight="medium" fontFamily={"Roboto"} fontSize={"1.8rem"} textShadow='1px 1px 10px #00cc00' mt={'70px'} >{paginatedData.length != 0 ? "Tus Favoritos":"Tu lista de favoritos está vacía" }</Text>}
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

      <SimpleGrid columns={[1, 1, 3]} spacing={28} p={4}>
      <Box 
        borderWidth="1px" 
        borderRadius="md" 
        p={6} 
        textAlign="center" 
        boxShadow="sm"
        bg="white"
        width='250px'
        height='250px'
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
      >
        <Icon as={FaTruck} boxSize={16} mb={2} color="black" />
        <Text fontSize="lg" fontWeight="semibold">Envíos gratis <br/>y en el día <br/>dentro de CABA</Text>
      </Box>

      <Box 
        borderWidth="1px" 
        borderRadius="md" 
        p={6} 
        textAlign="center" 
        boxShadow="sm"
        bg="white"
        width='250px'
        height='250px'
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
      >
        <Icon as={FaCreditCard} boxSize={16} mb={2} color="black" />
        <Text fontSize="lg" fontWeight="semibold">3 cuotas <br/>sin interés <br/>en todo el sitio</Text>
      </Box>

      <Box 
        borderWidth="1px" 
        borderRadius="md" 
        p={6} 
        textAlign="center" 
        boxShadow="sm"
        bg="white"
        width='250px'
        height='250px'
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        flexDirection={'column'}
      >
        <Icon as={FaWhatsapp} boxSize={16} mb={2} color="black" />
        <Text fontSize="lg" fontWeight="semibold">Contáctanos: <br/>1134567987 <br/>lu-sa de 10-17 hs</Text>
      </Box>
    </SimpleGrid>

    </VStack>
  );
};

export default ShowList;
