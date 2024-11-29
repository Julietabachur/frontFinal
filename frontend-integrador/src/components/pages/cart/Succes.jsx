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

  const [loading, setLoading] = useState(true); // Estado de loading

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 7000);
  }, []);

  console.log(sale);

  // const items = sale?.productList?.map((product) => ({
  //   id: product.productId,
  //   item: product.productName,
  //   quantity: product.amount,
  //   price: product.price,
  //   total: product.price * product.amount, // Total por producto
  // }));

  // const baseColumnOptions = {
  //   sortable: false,
  //   pinnable: false,
  //   hideable: false,
  // };

  // const columns = [
  //   {
  //     field: "item",
  //     headerName: "Item/Description",
  //     ...baseColumnOptions,
  //     flex: 3,
  //   },
  //   {
  //     field: "quantity",
  //     headerName: "Quantity",
  //     ...baseColumnOptions,
  //     flex: 1,
  //   },
  //   {
  //     field: "price",
  //     headerName: "Price",
  //     flex: 1,
  //     ...baseColumnOptions,
  //   },
  //   {
  //     field: "total",
  //     headerName: "Total",
  //     flex: 1,
  //     ...baseColumnOptions,
  //   },
  // ];

  return (
    <>
      {loading ? (
        // Pantalla de carga (loading)
        <Center height="50vh" width="100vw" bg="white">
        <PaymentLoading />
      </Center>
      ) : (
        // Contenido después de la carga
        <VStack
          m={1}
          w={"98vw"}
          display={"flex"}
          justifyContent={"start"}
          px={20}
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
        <TableContainer mt={10} w={830}>
            {/* <Text
              fontWeight="bold"
              fontSize="xl"
              mb={4}
              color={"#333"}
              textAlign="left"
            >
              Compra: 
            </Text> */}
            <Table variant="simple">
              <Thead backgroundColor="rgba(225, 188, 106, 0.5)">
                <Tr>
                  <Th textAlign={'center'}>Producto</Th>
                  {/* <Th>Imagen</Th> */}
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
                        src={product.thumbnail
                          || 'sin imagen'} // por si hay que agregar una imagen generica
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
                {/* <Tr>
                  <Td colSpan={4} fontWeight="bold" textAlign="right">
                    Total
                  </Td>
                  <Td>$ {sale.totalPrice}</Td>
                </Tr> */}
              </Tbody>
            </Table>
          </TableContainer>

          <HStack justifyContent={'space-between'} px={4} fontSize={'20px'} w={830} mt={4} pt={4} color={'color'} fontWeight={'medium'} borderTop={'1px solid'} borderColor={'color'}>
                <Text>
                    Total abonado
                </Text>
                <Text>
                   ${sale.totalPrice}
                </Text>
            </HStack>

          {/* Segunda tabla: Datos adicionales */}
            {/* <Text
              fontWeight="bold"
              fontSize="xl"
              mb={4}
              color={"#333"}
              textAlign="left"
            >
              Detalles de la Compra
            </Text> */}
          <TableContainer mt={10} w={830}>
            <Table variant="simple">
              <Tbody>
                <Tr className="border-b">
                  <Td  textAlign="left" fontWeight="bold">
                    Tipo de entrega:
                  </Td>
                  <Td textAlign="left">{sale.entrega}</Td>
                </Tr>

                {/* Mostrar datos de envío si aplica */}
                {sale.entrega === 'envio' && (
                  <>
                    <Tr className="border-b">
                      <Td  textAlign="left" fontWeight="bold">
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
          
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <DataGrid
              disableColumnFilter
              disableRowSelectionOnClick
              hideFooter
              showCellVerticalBorder
              showColumnVerticalBorder
              columns={columns}
              rows={items}
            />
          </Box> */}

          {/* <DataListRoot orientation="horizontal" divideY="1px" maxW="md">
            {sale?.productList?.map((product) => (
              <DataListItem
                pt="4"
                grow
                key={product.productId} // Usamos el productId como key
                label={product.productName} // Nombre del producto como label
                value={`Cantidad: ${product.amount} | Talle: ${product.size} | Precio: ${product.price}`} // Mostramos la cantidad, talle y precio como el valor
              />
            ))}
            <DataListItem
              pt="4"
              grow
              label={"Tipo de entrega: "}
              value={sale.entrega}
            />
           
            <DataListItem
              pt="4"
              grow
              label={"Medio de pago: "}
              value={sale.medioDePago}
            />
             <DataListItem
              pt="4"
              grow
              label={"Total: "}
              value={sale.totalPrice}
            />
          </DataListRoot> */}

          {/* <Box>
            <Text>
              Compraste:
              {sale?.productList?.map((product) => {
                <Text>
                  {product.productName} - Cantidad: {product.amount} - Talle{" "}
                  {product.size} - {product.price}
                </Text>;
              })}
            </Text>
            <Text>Total abonado: ${sale.totalPrice}</Text>
            <Text>Entrega: {sale.entrega}</Text>
            <Text>Medio de pago: {sale.medioDePago}</Text>
          </Box> */}
        </VStack>
      )}
    </>
  );
}

export default Succes;
