import React, { useEffect, useState } from "react";
import { useProductContext } from "./Global.context";
import { VStack, Icon, SimpleGrid, Text, Box } from "@chakra-ui/react";
import ProductCard from "./ProductCard"; // Componente para mostrar cada producto
import ProductCardContainer from "./ProductCardContainer"; // Contenedor para cada tarjeta de producto
import RenderPagination from "./RenderPagination"; // Componente de paginación importado


const ShowList = () => {
  const { paginatedData, showFav, favorites, getFavorites, isFilteredByCategory, getProducts, categories, productName, titulo} = useProductContext();
  // const [title, setTitle] = useState("");

  useEffect(() => {
    // Efecto que obtiene los productos si se están mostrando favoritos y no hay favoritos disponibles
    if (showFav && favorites.length === 0) {      
      getProducts(); // Llama a la función para obtener los productos
      console.log('favs: ', favorites);
    } else if (showFav && favorites.length > 0){
      getFavorites()
    }
  }, [favorites, showFav]);

//  useEffect(() => {
//   debugger
//     const getTitle = () => {
//       if (isFilteredByCategory) {
//         if (productName && productName !== "") {
//           return productName; // Si hay un nombre de producto, muestra ese
//         }
//         if (categories && categories.length > 0) {
//           return `Categorías seleccionadas: ${categories.join(", ")}`; // Muestra las categorías si productName está vacío
//         }
//       }
//       return "Productos"; // Título por defecto si no está filtrado por categoría
//     };

//     // Actualiza el título cuando las dependencias cambien
//     setTitle(getTitle());

//   }, [isFilteredByCategory, productName, categories]); // Se ejecuta cuando estas variables cambian


  return (
    <VStack>
      {showFav && (
        // Este mensaje indica si hay favoritos o no
        <Text fontWeight="medium" fontFamily={"Roboto"} fontSize={"1.8rem"} color={'#e1bc6a'} mt={'20px'}>
          {/* Se desactiva la visualización de favoritos */}
          {favorites.length > 0 ? "Tus Favoritos" : "Tu lista de favoritos está vacía. Echale un vistazo a nuestros productos"}
        </Text>
      )}
      {isFilteredByCategory && (
        // Este mensaje indica si hay favoritos o no
        <Text fontWeight="medium" fontFamily={"Roboto"} fontSize={"1.8rem"} color={'#e1bc6a'} mt={'20px'}>
           {titulo} {/* Aquí se aplica la lógica para el título */}
        </Text>
      )}

      {paginatedData ? (
      <>
        <SimpleGrid
        // minH={"100vh"} // Altura mínima del contenedor
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
