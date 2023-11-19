import React  from "react";
import { useProductContext } from "./Global.context";
import { VStack, SimpleGrid, Link, Heading, Text, Button } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductCardContainer from "./ProductCardContainer";
import RenderPagination from "./RenderPagination";
import { useNavigate } from "react-router-dom";
const ShowList = ({titulo}) => {
  var { paginatedData } = useProductContext();
  // paginatedData = [];
  const navigate = useNavigate();
console.log(paginatedData);
  return (
    <VStack>
       {titulo == 'Mis favoritos' && <Heading as='h2' mt={5}>{titulo}</Heading>}
       {(titulo == '' && paginatedData.length == 0 ) &&         
           <Heading as='h3' size='lg' mt={10}>No hay productos para mostrar</Heading>         
        
       }
       {(titulo == 'Mis favoritos' && paginatedData.length == 0 ) &&
         <VStack>
           <Heading as='h3' size='lg'>Tu lista de favoritos está vacía</Heading>
           <Button size='lg' bg={'verde2'} onClick={()=>{navigate(`/`)}} mt='24px'>
             Volver al inicio
           </Button>
         </VStack>
       }  
      <SimpleGrid
        minH={"100vh"}
        columns={{ base: 1, md: 2 }}
        pt={16}
        spacing={20}
      >       
        {paginatedData.map((item) => (
          <Link key={item.id} as={ReactRouterLink} to={`/detalle/${item.id}`}>
            <ProductCardContainer key={item.id}>
              <ProductCard item={item} />
            </ProductCardContainer>
          </Link>
        ))}           
      </SimpleGrid>
      {paginatedData && <RenderPagination />}
    </VStack>
  );
};

export default ShowList;
