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
    <Link as={ReactRouterLink} to={`/detalle/${item.id}`} style={{ textDecoration: 'none' }}>
      <Card  
        h={[240, 300, 360]} 
        w={[150, 200, 250]}  
        color={"blanco"}
        mx={2} 
      >
        <CardBody
          _hover={{
            transform: "scale(0.98)",
            cursor: "pointer",
          }}
          border={"2px solid black"}
          boxShadow={'xl'}
          display={"flex"}
          justifyContent={"center"}
          h={"90%"}
          w={"100%"}
          p={0}
          position="relative"
        >
          {/* Imagen */}
          <Image
            src={item?.thumbnail}
            h={"100%"}
            w={"100%"}
            objectFit={"cover"}
          />

          {/* Botón de corazón personalizado */}
          {token && (
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
              {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
            </Box>
          )}
        </CardBody>

        <CardFooter color={"negro"} alignContent={"center"} justify={"center"}>
          <Text
            fontFamily={"Roboto"}
            color={"gris1"}
            fontWeight="semibold"
            fontSize={["0.8rem", "1rem"]}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxWidth="100%"
          >
            {item.productName}
          </Text>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
