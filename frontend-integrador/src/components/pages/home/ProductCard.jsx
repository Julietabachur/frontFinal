import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
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
    setHeartClicked(isFavorite);
  }, [item.id, favorites]);

  const handleHeartClick = (event) => {
    event.stopPropagation(); // Evita la navegación al hacer clic en el corazón
    setHeartClicked(!isHeartClicked);

    const updatedFavorites = isHeartClicked
      ? favorites.filter((id) => id !== item.id)
      : [...favorites, item.id];

    setFavorites(updatedFavorites);
  };

  return (
    <Link as={ReactRouterLink} to={`/detalle/${item.id}`} style={{ textDecoration: "none" }}>
      <Card
        h={[300, 400, 500]}
        w={[198, 264, 330]}
        color="blanco"
        _hover={{ transform: "scale(0.98)", cursor: "pointer" }}
        border="3px solid black"
        boxShadow="2xl"
      >
        <CardBody display="flex" justifyContent="center" h="90%" p={0} position="relative">
          <Image
            src={item?.thumbnail}
            h="100%"
            w="100%"
            objectFit="cover"
          />
          {token && (
            <Box
              position="absolute"
              top={1.5}
              right={1.5}
              onClick={handleHeartClick}
              color="green"
              _hover={{ color: "darkgreen" }}
            >
              {isFavorite ? <FaHeart size={30} /> : <FaRegHeart size={30} />}
            </Box>
          )}
        </CardBody>
        <CardFooter color="negro" textAlign="center">
          <Text
            fontFamily="Roboto"
            color="gris1"
            fontWeight="semibold"
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
    </Link>
  );
};

export default ProductCard;