import { Box, Button, HStack, Image, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../home/Global.context';
import { FaShoppingCart, FaTrash , FaMoneyCheckAlt   } from "react-icons/fa";

const CarritoPage = ({username}) => {
const { updateCarrito, deleteCarrito, setCarrito, carrito, clientId, size, setSize } =
useProductContext();
const navigate = useNavigate();

const deleteProduct = (productId, size) => {
    debugger;
if (carrito.products.length > 1) {
    
  // Obtener los productos del carrito
  const { products } = carrito;

  // Buscar el índice del producto a eliminar
  const productIndex = products.findIndex(
    (p) => p.productId === productId && p.size === size
  );

  if (productIndex === -1) {
    console.log('Producto no encontrado en el carrito.');
    return;
  }

  // Crear una nueva lista de productos sin el producto eliminado
  const updatedProducts = products.filter(
    (p, index) => index !== productIndex
  );

  // Crear el nuevo objeto carrito
  const newCarrito = {
    ...carrito,
    products: updatedProducts,
    idUser: clientId, 
  };

  updateCarrito(newCarrito);
  console.log('Producto eliminado: '+ productId+ ' carrito actualizado: '+ newCarrito);
}else{
    deleteCarrito(carrito.id)
}

}
  
useEffect(() => {
    debugger
    if (!username) {
      navigate('/')
    } 
    // getCarrito()
  }, []);


  return (
    
    <VStack
        m={1}
        w={"98vw"}
        display={"flex"}
        justifyContent={"start"}
        px={20}
        pt={4}
        pb={10}
    //   h={"71vh"}

      >
        {carrito && carrito.products.length > 0 ? (
            <>
                <Text mx={4} fontWeight="medium" fontFamily={"Roboto"} textAlign={'center'} fontSize={{base:'lg',md:"2xl"}} color={'#e1bc6a'} mt={'20px'}>
                    Mi carrito
                </Text>
            <HStack justifyContent={'space-between'} w={830}>                
                <Button
                    onClick={() => deleteCarrito(carrito.id)}
                    color={"color"}
                    p={3}
                    px={5}
                    borderRadius={0}
                    variant={"plain"}
                    _hover={{
                        cursor: "pointer", // Cambia el cursor al pasar por encima
                        fontWeight:'bold',
                        borderBottom:'1px solid',
                        borderColor:' color'
                    }}
                >
                  <FaShoppingCart/>
                    <Text pl={3}>
                        Seguir comprando
                    </Text>
                </Button>
                <Button
                    onClick={() => navigate('/')}
                    color={"color"}
                    p={3}
                    px={5}
                    borderRadius={0}
                    variant={"plain"}
                    _hover={{
                        cursor: "pointer", // Cambia el cursor al pasar por encima
                        fontWeight:'bold',
                        borderBottom:'1px solid',
                        borderColor:' color'
                    }}
                >
                  <FaTrash />
                  <Text pl={3}>
                    Vaciar carrito
                  </Text>
                </Button>
            </HStack>
            <Box w={830} mt={3}>
                <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)">
                    <Thead>
                        <Tr>
                        <Th>
                            <Text textAlign={'center'} fontWeight="bold">Producto</Text>
                        </Th>                          
                        {/* <Th>
                            <Text textAlign={'center'} fontWeight="bold">Imagen</Text>
                        </Th> */}
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
                        <Th>
                            <Text textAlign={'center'} fontWeight="bold"></Text>
                        </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {carrito.products.map((producto) => (
                            <Tr key={producto.productId} h="10px">
                            <Td textAlign={'center'}>
                                <HStack textAlign={'center'}>                                    
                                    <Image
                                    src={producto.thumbnail}
                                    alt={producto.productName}
                                    w={50}
                                    h={50}
                                    // position={'relative'}
                                    // left={'30%'}
                                    />
                                    <Text>
                                        {producto.productName}
                                    </Text>
                                </HStack>
                            </Td>     
                            <Td textAlign={'center'}>{producto.size}</Td>
                            <Td textAlign={'center'}>${producto.price}</Td>
                            <Td textAlign={'center'}>{producto.amount}</Td>
                            <Td textAlign={'center'}>${producto.amount * producto.price}</Td>
                            <Td textAlign={'center'} 
                             _hover={{
                                cursor: "pointer",
                            }} 
                            onClick={()=>deleteProduct(producto.productId, producto.size)}><FaTrash /></Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
            <HStack justifyContent={'space-between'} px={4} fontSize={'20px'} w={830} mt={4} pt={4} color={'color'} fontWeight={'medium'} borderTop={'1px solid'} borderColor={'color'}>
                <Text>
                    Total a abonar
                </Text>
                <Text>
                   ${carrito.totalPrice}
                </Text>
            </HStack>
            {/* <HStack w={650} justifyContent={'space-between'}>
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
                    <FaShoppingCart/>
                    <Text pl={3}>
                        Seguir comprando
                    </Text>
                </Button>
                <Button
                    onClick={() => deleteCarrito()}
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
                    <FaMoneyCheckAlt/>
                    <Text  pl={3}>
                        Ir a pagar 
                    </Text>
                </Button>
            </HStack> */}
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
        
  )
}

export default CarritoPage