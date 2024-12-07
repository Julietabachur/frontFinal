import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductContext } from '../home/Global.context';
import { Box, Button, HStack, List, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { FaShoppingCart} from "react-icons/fa";

const UserSales = () => {
    const { userSales} = useProductContext();
    const navigate = useNavigate();
  return (
    <VStack
        m={1}
        w={"98vw"}
        display={"flex"}
        justifyContent={"start"}
        px={20}
        pt={4}
        pb={10}
        h={"71vh"}

      >
        {userSales && userSales.length > 0 && (
            <>
                <Text mx={4} fontWeight="medium" fontFamily={"Roboto"} textAlign={'center'} fontSize={{base:'lg',md:"2xl"}} color={'#e1bc6a'} mt={'20px'}>
                    Mis compras
                </Text>
            
            <Box 
            // w={830} 
            mt={3}>
                <Table variant="simple" >
                    <Thead backgroundColor="rgba(225, 188, 106, 0.5)">
                        <Tr>
                        <Th>
                            <Text textAlign={'center'} fontWeight="bold">Fecha</Text>
                        </Th>    
                        <Th>
                            <Text textAlign={'center'} fontWeight="bold">Productos</Text>
                        </Th>
                        <Th>
                            <Text textAlign={'center'} fontWeight="bold">Entrega</Text>
                        </Th>
                        <Th>
                            <Text textAlign={'center'} fontWeight="bold">Medio de pago</Text>
                        </Th>
                        <Th>
                            <Text textAlign={'center'} fontWeight="bold">Total de compra</Text>
                        </Th>                        
                        </Tr>
                    </Thead>
                    <Tbody>
                        {userSales.map((compra) => (
                            <Tr key={compra.id} h="30px">
                                <Td textAlign={'center'} fontSize={'12px'} width={'20%'}>{compra.saleDate}</Td>     
                                <Td textAlign={'center'} fontSize={'12px'} width={'20%'}>
                                    <Box as="ul" listStyleType="circle">
                                    {compra.productList.map((producto, index) => (
                                        <ul key={index}>
                                        {producto.productName}, {producto.size}, {producto.amount}
                                        </ul>
                                    ))}
                                    </Box>
                                </Td>
                                <Td textAlign={'center'} fontSize={'12px'} width={'20%'}>
                                    {compra.entrega.toUpperCase()}
                                    {compra.entrega === 'envio' && `: ${compra.domicilio}`}
                                </Td>
                                <Td textAlign={'center'} fontSize={'12px'} width={'20%'}>{compra.medioDePago}</Td>
                                <Td textAlign={'center'} fontSize={'12px'} width={'20%'}>${compra.totalPrice}</Td>
                                
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>           
            <HStack justifyContent={'space-between'} 
            // w={830} 
            mt={'100px'}
            >                
                <Button
                    onClick={() => navigate('/')}
                    color={"white"}
                    backgroundColor={'color'}
                    p={3}
                    px={5}
                    borderRadius={'10px'}
                    variant={"plain"}
                    _hover={{
                        cursor: "pointer", // Cambia el cursor al pasar por encima
                        fontWeight:'bold',
                    }}
                >
                    <Text>
                        Volver al inicio
                    </Text>
                </Button>              
            </HStack>
            </> )
        }
        </VStack>
  )
}

export default UserSales