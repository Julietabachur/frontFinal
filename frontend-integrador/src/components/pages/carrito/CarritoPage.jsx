import {
    Box,
    Button,
    HStack,
    Image,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
  } from "@chakra-ui/react";
  import React, { useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { useProductContext } from "../home/Global.context";
  import { FaShoppingCart, FaTrash } from "react-icons/fa";
  
  const CarritoPage = ({ username }) => {
    const { updateCarrito, deleteCarrito, setCarrito, carrito, clientId } =
      useProductContext();
    const navigate = useNavigate();
  
    const deleteProduct = (productId, size) => {
      if (carrito.products.length > 1) {
        const { products } = carrito;
        const productIndex = products.findIndex(
          (p) => p.productId === productId && p.size === size
        );
        if (productIndex === -1) {
          console.log("Producto no encontrado en el carrito.");
          return;
        }
        const updatedProducts = products.filter((_, index) => index !== productIndex);
        const newCarrito = {
          ...carrito,
          products: updatedProducts,
          idUser: clientId,
        };
        updateCarrito(newCarrito);
      } else {
        deleteCarrito(carrito.id);
      }
    };
  
    useEffect(() => {
      if (!username) {
        navigate("/");
      }
    }, [username, navigate]);
  
    return (
      <VStack
        m={1}
        w={{ base: "95vw", md: "98vw" }}
        px={{ base: 4, md: 20 }}
        pt={4}
        pb={10}
      >
        {carrito && carrito.products.length > 0 ? (
          <>
            <Text
              mx={4}
              fontWeight="medium"
              fontFamily={"Roboto"}
              textAlign={"center"}
              fontSize={{ base: "lg", md: "2xl" }}
              color={"#e1bc6a"}
              mt={"20px"}
            >
              Mi carrito
            </Text>
            <HStack justifyContent={"space-between"} w={{ base: "100%", md: 830 }}>
              <Button
                onClick={() => navigate("/")}
                p={3}
                px={5}
                variant={"plain"}
                _hover={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  borderBottom: "1px solid",
                  borderColor: "color",
                }}
              >
                <FaShoppingCart />
                <Text pl={3}>Seguir comprando</Text>
              </Button>
              <Button
                onClick={async () => {
                  await deleteCarrito(carrito.id);
                  navigate("/");
                }}
                p={3}
                px={5}
                variant={"plain"}
                _hover={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  borderBottom: "1px solid",
                  borderColor: "color",
                }}
              >
                <FaTrash />
                <Text pl={3}>Vaciar carrito</Text>
              </Button>
            </HStack>
            <Box w={{ base: "100%", md: 830 }} mt={3} overflowX="auto">
              <Table variant="simple">
                <Thead backgroundColor="rgba(225, 188, 106, 0.5)">
                  <Tr>
                    <Th>
                      <Text textAlign={"center"} fontWeight="bold">
                        Producto
                      </Text>
                    </Th>
                    <Th>
                      <Text textAlign={"center"} fontWeight="bold">
                        Talle
                      </Text>
                    </Th>
                    <Th>
                      <Text textAlign={"center"} fontWeight="bold">
                        Precio
                      </Text>
                    </Th>
                    <Th>
                      <Text textAlign={"center"} fontWeight="bold">
                        Cantidad
                      </Text>
                    </Th>
                    <Th>
                      <Text textAlign={"center"} fontWeight="bold">
                        Subtotal
                      </Text>
                    </Th>
                    <Th>
                      <Text textAlign={"center"} fontWeight="bold"></Text>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {carrito.products.map((producto) => (
                    <Tr key={producto.productId}>
                      <Td>
                        <HStack>
                          <Image
                            src={producto.thumbnail}
                            alt={producto.productName}
                            w={10}
                            h={10}
                          />
                          <Text>{producto.productName}</Text>
                        </HStack>
                      </Td>
                      <Td textAlign={"center"}>{producto.size}</Td>
                      <Td textAlign={"center"}>${producto.price}</Td>
                      <Td textAlign={"center"}>{producto.amount}</Td>
                      <Td textAlign={"center"}>${producto.amount * producto.price}</Td>
                      <Td
                        textAlign={"center"}
                        _hover={{ cursor: "pointer" }}
                        onClick={() => deleteProduct(producto.productId, producto.size)}
                      >
                        <FaTrash />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <HStack
              justifyContent={"space-between"}
              px={4}
              fontSize={{ base: "md", md: "20px" }}
              w={{ base: "100%", md: 830 }}
              mt={4}
              pt={4}
              color={"color"}
              fontWeight={"medium"}
              borderTop={"1px solid"}
              borderColor={"color"}
            >
              <Text>Total a abonar</Text>
              <Text>${carrito.totalPrice}</Text>
            </HStack>
          </>
        ) : (
          navigate("/")
        )}
      </VStack>
    );
  };
  
  export default CarritoPage;
  