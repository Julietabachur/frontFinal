import React, { useEffect } from "react";
import { useProductContext } from "./Global.context";
import { VStack, Icon, SimpleGrid, Text, Box } from "@chakra-ui/react";
import ProductCard from "./ProductCard"; // Componente para mostrar cada producto
import ProductCardContainer from "./ProductCardContainer"; // Contenedor para cada tarjeta de producto
import RenderPagination from "./RenderPagination"; // Componente de paginación importado
import { FaTruck, FaCreditCard, FaWhatsapp } from 'react-icons/fa';

const ShowList = () => {
  const { paginatedData, showFav, favorites, setShowFav, getProducts } = useProductContext();

  useEffect(() => {
    // Efecto que obtiene los productos si se están mostrando favoritos y no hay favoritos disponibles
    if (showFav && favorites.length === 0) {
      getProducts(); // Llama a la función para obtener los productos
      console.log('favs: ', favorites);
    }
  }, [favorites, showFav]);

  return (
    <VStack>
      {showFav && (
        // Este mensaje indica si hay favoritos o no
        <Text fontWeight="medium" fontFamily={"Roboto"} fontSize={"1.8rem"} textShadow='1px 1px 10px #00cc00' mt={'70px'}>
          {/* Se desactiva la visualización de favoritos */}
          {paginatedData.length !== 0 ? "Tus Favoritos" : "Tu lista de favoritos está vacía"}
        </Text>
      )}

      {/* Sección de productos comentada */}
      {/* <SimpleGrid
        minH={"100vh"} // Altura mínima del contenedor
        columns={{ base: 1, md: 2 }} // Definición de columnas responsivas
        pt={12} // Padding en la parte superior
        spacing={[5, 10, 20]} // Espaciado entre los elementos
      >
        {paginatedData.map((item) => (
          <ProductCardContainer key={item.id}>
            <ProductCard item={item} />
          </ProductCardContainer>
        ))}
      </SimpleGrid> */}

      {/* Se mantiene visible la paginación comentada */}
      {/* {paginatedData && <RenderPagination />} */}

      {/* Contenido adicional */}
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
          <Text fontSize="lg" fontWeight="semibold">Envíos gratis <br />y en el día <br />dentro de CABA</Text>
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
          <Text fontSize="lg" fontWeight="semibold">3 cuotas <br />sin interés <br />en todo el sitio</Text>
        </Box>

        {/* Se mantiene visible el contacto por WhatsApp */}
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
          <Text fontSize="lg" fontWeight="semibold">Contáctanos: <br />1134567987 <br />lu-sa de 10-17 hs</Text>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default ShowList;
