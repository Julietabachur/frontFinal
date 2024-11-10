import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Button,
  Image,
  Text,
  Link,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useProductContext } from "./Global.context";
import { Link as ReactRouterLink } from "react-router-dom";

const ProductCard = ({ item }) => {
  const [isHeartClicked, setHeartClicked] = useState(false);
  const { setFavorites, favorites } = useProductContext();

  const token = JSON.parse(localStorage.getItem("riskkojwt"));
  const isFavorite = favorites.includes(item.id);

  useEffect(() => {
    const isFavorite = favorites.includes(item.id);
    setHeartClicked(isFavorite);
  }, [item.id]);

  const handleHeartClick = (event) => {
    event.stopPropagation();
    setHeartClicked(!isHeartClicked);

    const updatedFavorites = isHeartClicked
      ? favorites.filter((id) => id !== item.id)
      : [...favorites, item.id];

    setFavorites(updatedFavorites);
  };

  return (
    // <Link as={ReactRouterLink} to={`/detalle/${item.id}`} style={{ textDecoration: 'none' }}>
    //   <Card  
    //     h={[240, 300, 360]} 
    //     w={[150, 200, 250]}  
    //     color={"blanco"}
    //     mx={2} 
    //   >
    //     <CardBody
    //       _hover={{
    //         transform: "scale(0.98)",
    //         cursor: "pointer",
    //       }}
    //       border={"1px solid black"}
    //       borderRadius={'50px'}
    //       boxShadow={'xl'}
    //       display={"flex"}
    //       justifyContent={"center"}
    //       h={"90%"}
    //       w={"100%"}
    //       p={0}
    //       position="relative"
    //     >
    //       {/* Imagen */}
    //       <Link as={ReactRouterLink} to={`/detalle/${item.id}`} style={{ textDecoration: 'none' }}>
    //         <Image
    //           src={item?.thumbnail}
    //           h={"100%"}
    //           w={"100%"}
    //           objectFit={"cover"}
    //         />
    //       </Link>

          
    //     </CardBody>

    //     <CardFooter color={"negro"} alignContent={"center"} justify={"center"}>
    //       <VStack>
    //       <Link as={ReactRouterLink} to={`/detalle/${item.id}`} style={{ textDecoration: 'none' }}>
    //         <Text
    //           fontFamily={"Roboto"}
    //           color={"gris1"}
    //           fontWeight="semibold"
    //           fontSize={["0.8rem", "1rem"]}
    //           whiteSpace="nowrap"
    //           overflow="hidden"
    //           textOverflow="ellipsis"
    //           maxWidth="100%"
    //         >
    //         {item.productName}
    //         </Text>
    //       </Link>
    //       <HStack>
    //       {/* <Text>{item.precio}</Text> */}
    //       <Text>$2000</Text>
    //       {/* Botón de corazón personalizado */}
    //       {token && (
    //         <Box
    //           position="absolute"
    //           top={1.5}
    //           right={1.5}
    //           onClick={handleHeartClick}
    //           color="gold" // Cambiar a dorado
    //           _hover={{
    //             color: "#DAA520", // Cambiar a amarillo oscuro
    //           }}
    //         >
    //           {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
    //         </Box>
    //       )}
    //       </HStack>
    //       </VStack>
    //     </CardFooter>
    //   </Card>
    // </Link>

    <Card
      w={[160, 200]}
      bg="blanco"
      borderRadius="16px"
      boxShadow="md"
      _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
      transition="0.3s"
      mx={2}
      position="relative"
    >
      {/* Imagen enlazada al detalle */}
      <Box h="300px" overflow="hidden" borderTopRadius="16px">
        <Link as={ReactRouterLink} to={`/detalle/${item.id}`} style={{ textDecoration: 'none' }}>
          <Image
            src={item?.thumbnail}
            alt={item.productName}
            objectFit="cover"
            w="100%"
            h="100%"
          />
        </Link>
      </Box>

      {/* Contenedor de información */}
      <VStack p={2} spacing={2} align="stretch">
        {/* Título enlazado alineado a la izquierda */}
        <Link as={ReactRouterLink} to={`/detalle/${item.id}`} style={{ textDecoration: 'none' }}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            color="gray.700"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxWidth="100%"
            textAlign="left"
          >
            {item.productName}
          </Text>
        </Link>

        {/* Precio y corazón */}
        <HStack justify="space-between" w="100%">
          <Text fontSize="lg" color="gray.800" fontWeight="bold">
            $2000
          </Text>
          {token && (
            <Box
              onClick={handleHeartClick}
              color={isFavorite ? "red.500" : "gray.400"}
              _hover={{ color: isFavorite ? "red.600" : "gray.500" }}
              cursor="pointer"
            >
              {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </Box>
          )}
        </HStack>
      </VStack>
    </Card>
   
  );
};

export default ProductCard;
