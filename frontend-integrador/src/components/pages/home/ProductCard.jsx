import React, { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { FaRegHeart } from "react-icons/fa";

const ProductCard = ({ item }) => {
  const [isHeartClicked, setHeartClicked] = useState(false);

  const handleHeartClick = (event) => {
    // Evitar que el evento se propague a la tarjeta
    event.stopPropagation();
    
    // Cambiar el estado del clic del corazón
    setHeartClicked(!isHeartClicked);
  };

  return (
    <Card
      h={500}
      w={300}
      color={"blanco"}
      
      
    >
      <CardBody
        _hover={{
          transform: "scale(0.98)",
          cursor: "pointer",
        }}
        border={"5px solid black"}
        boxShadow={"2xl"}
        display={"flex"}
        justifyContent={"center"}
        h={["90%"]}
        w={["100%"]}
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
        <Box position="absolute" top={1.5} right={1.5}>
            <FaRegHeart 
            size={30} 
            color="green"
            backgroundColor={isHeartClicked ? "green" : "transparent"}
            onClick={handleHeartClick}
            />
          
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
