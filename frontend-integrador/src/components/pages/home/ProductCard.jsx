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
    <Card h={'500px'} bg={"blackAlpha.600"} color={"whiteAlpha.700"} borderRadius={10} overflow='hidden' >
      
      <CardBody display={"flex"} justifyContent={"center"} >
        <Image src={item?.thumbnail} fallbackSrc='https://via.placeholder.com/600' object-fit={"cover"} w={'100%'} ></Image>
      </CardBody>
{/*       <CardHeader>{item?.name}</CardHeader>
      <CardFooter>{item?.set}</CardFooter> */}
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