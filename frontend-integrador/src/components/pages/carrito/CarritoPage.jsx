import { Box, Button, Image, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../home/Global.context';

const CarritoPage = ({username}) => {
const { getCarrito, setCarrito, carrito, size, setSize } =
useProductContext();
const navigate = useNavigate();


  
useEffect(() => {
    debugger
    if (!username) {
      navigate('/')
    } 
    getCarrito()
  }, []);


  return (
    <>
    <VStack
        m={1}
        w={"98vw"}
        display={"flex"}
        justifyContent={"start"}
        px={20}
        py={4}
      h={"71vh"}

      >
        {carrito.length > 0 ? (
            <>
            <Text mx={4} fontWeight="medium" fontFamily={"Roboto"} textAlign={'center'} fontSize={{base:'lg',md:"2xl"}} color={'#e1bc6a'} mt={'20px'}>
            Mi carrito
         </Text>
            <Box w={830} mt={3}>
                <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)">
                <Thead>
                    <Tr>
                    <Th>
                        <Text textAlign={'center'} fontWeight="bold">Nombre</Text>
                    </Th>                          
                    <Th>
                        <Text textAlign={'center'} fontWeight="bold">Imagen</Text>
                    </Th>
                    <Th>
                        <Text textAlign={'center'} fontWeight="bold">Talle</Text>
                    </Th>
                    <Th>
                        <Text textAlign={'center'} fontWeight="bold">Precio</Text>
                    </Th>
                    <Th>
                        <Text textAlign={'center'} fontWeight="bold">Cantidad</Text>
                    </Th>
                    <Th>
                        <Text textAlign={'center'} fontWeight="bold">Subtotal</Text>
                    </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {carrito && carrito.products &&
                    carrito.products.map((producto) => (
                        <Tr key={producto.id} h="10px">
                        <Td textAlign={'center'}>{producto.categoryName}</Td>
                        <Td textAlign={'center'}>{producto.description}</Td>
                        <Td alignItems={'center'}>
                            <Image
                            src={producto.imageUrl}
                            alt={producto.categoryName}
                            w={50}
                            h={50}
                            position={'relative'}
                            left={'30%'}
                            />
                        </Td>                              
                        </Tr>
                    ))}
                </Tbody>
                </Table>
            </Box>
            </> ):(
                <>
                    <Text mx={4} fontWeight="medium" fontFamily={"Roboto"} textAlign={'center'} fontSize={{base:'lg',md:"2xl"}} color={'#e1bc6a'} mt={'20px'}>
                        Tu carrito todavía está vacío.
                    </Text>
                    <Button
                      onClick={() => navigate('/')}
                      // colorScheme="teal"
                      backgroundColor={'white'}
                      variant="solid"
                      width="250px"                      
                      border={'1px solid'}
                      borderColor={'color'}
                      marginTop={10}
                      _hover={{
                        backgroundColor:'color',
                        color:'white'
                      }}
                    >
                      Volver al inicio
                    </Button>
                </>

            )             
        }
        </VStack>
        </>
  )
}

export default CarritoPage