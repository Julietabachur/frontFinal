import React, { useEffect } from "react";
import { useProductContext } from "./Global.context";
import { VStack, Icon, SimpleGrid, Text, Box } from "@chakra-ui/react";
import ProductCard from "./ProductCard"; // Componente para mostrar cada producto
import ProductCardContainer from "./ProductCardContainer"; // Contenedor para cada tarjeta de producto
import RenderPagination from "./RenderPagination"; // Componente de paginación importado


const ShowList = () => {
  const { paginatedData, showFav, favorites, getFavorites, setShowFav, getProducts } = useProductContext();

  useEffect(() => {
    // Efecto que obtiene los productos si se están mostrando favoritos y no hay favoritos disponibles
    if (showFav && favorites.length === 0) {      
      getProducts(); // Llama a la función para obtener los productos
      console.log('favs: ', favorites);
    } else if (showFav && favorites.length > 0){
      getFavorites()
    }
  }, [favorites, showFav]);

  return (
    <VStack>
      {showFav && (
        // Este mensaje indica si hay favoritos o no
        <Text fontWeight="medium" fontFamily={"Roboto"} fontSize={"1.8rem"} color={'#e1bc6a'} mt={'70px'}>
          {/* Se desactiva la visualización de favoritos */}
          {favorites.length > 0 ? "Tus Favoritos" : "Tu lista de favoritos está vacía. Echale un vistazo a nuestros productos"}
        </Text>
      )}

      {paginatedData ? (
      <>
        <SimpleGrid
        minH={"100vh"} // Altura mínima del contenedor
        columns={{ base: 1, sm:2, md: 3, lg: 4 }} // Definición de columnas responsivas
        pt={12} // Padding en la parte superior
        spacing={[5, 10, 15]} // Espaciado entre los elementos
        >
          {paginatedData.map((item) => (
            <ProductCardContainer key={item.id}>
              <ProductCard item={item} />
            </ProductCardContainer>
          ))}
        </SimpleGrid>
        <RenderPagination />
       </>
      ) : (null)
      }



    </VStack>
  );
};

export default ShowList;
