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
 console.log(item?.thumbnail);
  
  
  return (
    <Card h={'500px'} bg={"blackAlpha.600"} color={"whiteAlpha.700"} borderRadius={10} overflow='hidden' >
      
      <CardBody display={"flex"} justifyContent={"center"} >
        <Image src={item?.thumbnail} fallbackSrc='https://via.placeholder.com/600' object-fit={"cover"} w={'100%'} ></Image>
      </CardBody>
{/*       <CardHeader>{item?.name}</CardHeader>
      <CardFooter>{item?.set}</CardFooter> */}
    </Card>
  );
};

export default ProductCard;
