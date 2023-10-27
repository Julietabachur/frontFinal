import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";

const ProductCard = ({ item }) => {
  return (
    <Card h={"500px"} color={"blanco"}>
      <CardBody
        _hover={{
          transform: "scale(1.02)", // Escala un poco la tarjeta en el hover
          boxShadow: "md", // Agrega una sombra al hacer hover
          cursor: "pointer", // Cambia el cursor al pasar por encima
        }}
        border={"5px solid black"}
        boxShadow={"5px 5px 5px gray"}
        display={"flex"}
        justifyContent={"center"}
        h={"80%"}
        p={0}
      >
        <Image src={item?.thumbnail} h={'100%'} w={'100%'} objectFit={'cover'} ></Image>
      </CardBody>
      <CardFooter
        fontSize={26}
        color={"negro"}
        alignContent={"center"}
        justify={"center"}
      >
        <Text
          fontFamily={"Saira"}
          color={"gris1"}
          fontSize={"24px"}
          textShadow={"5px 5px 5px gray"}
        >
          {" "}
          {item.productName}
        </Text>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
