import {
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image, 
  Button,
  Center,
  HStack
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

import PaymentLoading from "./PaymentLoading";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../home/Global.context";


function Succes() {
  const { sale } = useProductContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 7000);
  }, []);

  return (
    <>
      {loading ? (
        <Center height="50vh" width="100vw" bg="white">
          <PaymentLoading />
        </Center>
      ) : (
        <VStack
          m={1}
          w={{ base: "95vw", md: "98vw" }}
          display={"flex"}
          justifyContent={"start"}
          px={{ base: 4, md: 20 }}
          pt={4}
          pb={10}
        >
          <Text
            mx={4}
            fontWeight="medium"
            fontFamily={"Roboto"}
            textAlign={"center"}
            fontSize={{ base: "lg", md: "2xl" }}
            color={"#e1bc6a"}
            mt={"20px"}
          >
            GRACIAS POR TU COMPRA
          </Text>

          {/* Primera tabla: Detalles del carrito */}
          <TableContainer mt={10} w={{ base: "100%", md: 830 }}>
            <Table variant="simple">
              <Thead backgroundColor="rgba(225, 188, 106, 0.5)">
                <Tr>
                  <Th textAlign={'center'}>Producto</Th>
                  <Th textAlign={'center'}>Talle</Th>
                  <Th textAlign={'center'}>Precio</Th>
                  <Th textAlign={'center'}>Cantidad</Th>
                  <Th textAlign={'center'}>Subtotal</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sale?.productList?.map((product) => (
                  <Tr key={product.productId}>
                    <Td textAlign={'center'}>
                      <HStack textAlign={'center'}>
                        <Image
                          src={product.thumbnail || 'sin imagen'}
                          alt={product.productName}
                          boxSize="50px"
                          objectFit="cover"
                        />
                        <Text>{product.productName}</Text>
                      </HStack>                    
                    </Td>
                    <Td textAlign={'center'}>{product.size}</Td>
                    <Td textAlign={'center'}>${product.price}</Td>
                    <Td textAlign={'center'}>{product.amount}</Td>
                    <Td textAlign={'center'}>${(product.amount * product.price)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <HStack
            justifyContent={'space-between'}
            px={{ base: 4, md: 10 }}
            fontSize={{ base: "md", md: "20px" }}
            w={{ base: "100%", md: 830 }}
            mt={4}
            pt={4}
            color={"color"}
            fontWeight={"medium"}
            borderTop={'1px solid'}
            borderColor={"color"}
          >
            <Text>Total abonado</Text>
            <Text>${sale.totalPrice}</Text>
          </HStack>

          {/* Segunda tabla: Datos adicionales */}
          <TableContainer mt={10} w={{ base: "100%", md: 830 }}>
            <Table variant="simple">
              <Tbody>
                <Tr className="border-b">
                  <Td textAlign="left" fontWeight="bold">
                    Tipo de entrega:
                  </Td>
                  <Td textAlign="left">{sale.entrega}</Td>
                </Tr>

                {sale.entrega === 'envio' && (
                  <>
                    <Tr className="border-b">
                      <Td textAlign="left" fontWeight="bold">
                        Dirección de envío:
                      </Td>
                      <Td textAlign="left">{sale.domicilio}</Td>
                    </Tr>                    
                  </>
                )}

                <Tr className="border-b">
                  <Td textAlign="left" fontWeight="bold">
                    Medio de pago:
                  </Td>
                  <Td textAlign="left">{sale.medioDePago}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>

          <Button
            mt={6}
            backgroundColor="#e1bc6a"
            color="white"
            _hover={{ backgroundColor: "#d3a45a" }}
            size="lg"
            onClick={() => navigate('/')}
          >
            Seguir comprando
          </Button>
        </VStack>
      )}
    </>
  );
}

export default Succes;
