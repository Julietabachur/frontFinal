import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Image,
  Text,
  Link,
} from "@chakra-ui/react";

<<<<<<< Updated upstream
const ProductCard = ({ item }) => {
 console.log(item?.thumbnail);
  
  
  return (
<<<<<<< Updated upstream
    <Card h={'500px'} bg={"blackAlpha.600"} color={"whiteAlpha.700"} borderRadius={10} overflow='hidden' >
      
      <CardBody display={"flex"} justifyContent={"center"} >
        <Image src={item?.thumbnail} fallbackSrc='https://via.placeholder.com/600' object-fit={"cover"} w={'100%'} ></Image>
      </CardBody>
{/*       <CardHeader>{item?.name}</CardHeader>
      <CardFooter>{item?.set}</CardFooter> */}
=======
    <Card  
    h={['350px','300px',"300px"]}
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
>>>>>>> Stashed changes
    </Card>
=======
const ProductCard = ({ product }) => {

  if (!product || !product.id) {
    return null; 
  }
  return (
    <Link to={`/detail/${product.id}`}>
      <Card h={"500px"} color={"blanco"}>
        <CardBody
          _hover={{
            transform: "scale(1.02)",
            boxShadow: "md",
            cursor: "pointer",
          }}
          border={"5px solid black"}
          boxShadow={"5px 5px 5px gray"}
          display={"flex"}
          justifyContent={"center"}
          h={"80%"}
        >
          <Image
            src={product?.thumbnail}
            objectFit="cover"
          ></Image>
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
            {product.productName}
          </Text>
        </CardFooter>
      </Card>
    </Link>
>>>>>>> Stashed changes
  );
};

export default ProductCard;