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
      h={"500px"}
      bg={"blackAlpha.600"}
      color={"whiteAlpha.700"}
      borderRadius={10}
      overflow="hidden"
      _hover={{
        transform: 'scale(1.02)', // Escala un poco la tarjeta en el hover
        boxShadow: 'md', // Agrega una sombra al hacer hover
        cursor: 'pointer', // Cambia el cursor al pasar por encima
      }}
      
    >
      <Image
        src={item?.thumbnail}
        /* fallbackSrc='https://via.placeholder.com/600' */ object-fit={"cover"}
        w={"100%"}
      ></Image>

      {/* <CardBody display={"flex"} justifyContent={"center"} >
      </CardBody> */}
    </Card>
  );
};

export default ProductCard;
