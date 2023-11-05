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
    <Card  
    h={['350px','300px', "300px"]}
    w={['300px','300px',"300px"]} 
    color={"blanco"}>
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
        h={['100%']}
        w={['100%']}
        p={0}
      >
        <Image
          src={item?.thumbnail}
          h={"100%"}
          w={"100%"}
          objectFit={"cover"}
        ></Image>
      </CardBody>
      <CardFooter color={"negro"} alignContent={"center"} justify={"center"}>
        <Text
          fontFamily={"Saira"}
          color={"gris1"}
          fontSize={['1 rem', '1.2rem']}
          // textShadow={"5px 5px 5px gray"}
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
