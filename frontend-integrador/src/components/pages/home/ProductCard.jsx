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
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart} from "react-icons/fa";
import { useProductContext } from "./Global.context";
import { Link as ReactRouterLink } from "react-router-dom";

const ProductCard = ({ item }) => {
  const [isHeartClicked, setHeartClicked] = useState(false);
  const { setFavorites, favorites } = useProductContext();

  // Verificar si el item.id está en el array de favoritos
  const isFavorite = favorites.includes(item.id);

  useEffect(() => {
    // Actualizar el estado del corazón basado en si el id está en favoritos
    const isFavorite = favorites.includes(item.id);
    setHeartClicked(isFavorite);
  }, [item.id]);

  const handleHeartClick = (event) => {
   
    // Cambiar el estado del clic del corazón
    setHeartClicked(!isHeartClicked);

    // Actualizar favoritos según el estado del corazón
    const updatedFavorites = isHeartClicked
      ? favorites.filter((id) => id !== item.id) // Quitar de favoritos si estaba
      : [...favorites, item.id]; // Agregar a favoritos si no estaba

    setFavorites(updatedFavorites);
  };

  return (
    <Card  
    h={500}
    w={330} 
    color={"blanco"}>
      
      <CardBody
        _hover={{
          transform: "scale(0.98)",
          cursor: "pointer",
        }}
        border={"3px solid black"}
        boxShadow={'2xl'}
        display={"flex"}
        justifyContent={"center"}
        h={["90%"]}
        w={["100%"]}
        p={0}
        position="relative"
      >
        {/* Imagen */}
        <Link as={ReactRouterLink} to={`/detalle/${item.id}`}>
          <Image src={item?.thumbnail} h={"100%"} w={"100%"} objectFit={"cover"} />
        </Link>
        {/* Botón de corazón personalizado */}
        <Box
          position="absolute"
          top={1.5}
          right={1.5}
          onClick={handleHeartClick}
          color="green"
          _hover={{
            color: "green",
          }}
        >
          {isFavorite ? <FaHeart size={30} /> : <FaRegHeart size={30} />}
        </Box>
      </CardBody>

      <CardFooter color={"negro"} alignContent={"center"} justify={"center"}>
        <Text
          fontFamily={"Saira"}
          color={"gris1"}
          fontSize={["1rem", "1.2rem"]}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxWidth="100%"
        >
          {item.productName}
        </Text>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

