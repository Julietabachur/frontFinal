import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Img,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Flex,
  Text,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import NewProduct from "./NewProduct";

const ListAdminProduct = ({
  getProducts,
  page,
  handlePageChange,
  lista,
  token,
  getCategoriesAll,
  categoryListAll,
  featuresListAll,
  getFeaturesAll,
  showAddProduct,
  setShowAddProduct,
  setShowProdList
  }) => {
  console.log("COMIENZA LISTADMIN");
  console.log(page);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [closeList, setCloseList] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // constantes del Alert Box

  const cancelRef = useRef(); // permite cancelar en el box de alerta
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla estado del AlertBox
  const [itemToDelete, setItemToDelete] = useState(null); // pasa la variable del item a eliminar

  useEffect(() => {
    getProducts();
  }, [page]); // Agrega 'page' como dependencia para que se actualice cuando cambie el número de página

  /*  CREO ES INNECESARIO
  useEffect(() => {
    getCategoriesAll();
    getFeaturesAll();
  }, []);
  */

  const openDeleteDialog = (item) => {
    setIsDeleteDialogOpen(true);
    setItemToDelete(item);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      // Realiza una solicitud DELETE a la API para eliminar el producto
      await axios.delete(`${baseUrl}/api/v1/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Vuelve a obtener la lista de productos después de eliminar.
      getProducts();
      //console.log(lista);

    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  const handleEdit = (product) => {
    setCloseList(true);  // cierra el listado 
    setProductToEdit(product); // pasa el objeto product a traves del prop
    //console.log("Producto para editar:", productToEdit);
    //console.log("Muestra Formulario", showAddProduct);
  };

  return (
    <>
    {closeList == false && (
            <Flex justify={"center"}>
            <Box mt={10}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Button
                  colorScheme="green"
                  onClick={() => handlePageChange(page > 1 ? page - 1 : page)}
                  disabled={page === 0}
                >
                  &lt;&lt;&lt;
                </Button>
                <Text>- {page} -</Text>
                <Button
                  colorScheme="green"
                  onClick={() => handlePageChange(page + 1)}
                >
                  &gt;&gt;&gt;
                </Button>
              </div>
    
              <Box w={830} mt={3}>
                <Table variant="striped" colorScheme="green">
                  <Thead>
                    <Tr>
                      <Th>
                        <Text fontWeight="bold">ID</Text>
                      </Th>
                      <Th>
                        <Text fontWeight="bold">Nombre</Text>
                      </Th>
                      <Th>
                        <Text fontWeight="bold">Imagen</Text>
                      </Th>
                      <Th>
                        <Text fontWeight="bold" style={{ marginBottom: "8px" }}>
                          Editar / Eliminar
                        </Text>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {lista &&
                      lista.map((item) => (
                        <Tr key={item.id} h="10px">
                          <Td>{item.productId}</Td>
                          <Td>{item.productName}</Td>
                          <Td>
                            <Img
                              src={item.thumbnail}
                              alt={item.productName}
                              w={50}
                              h={50}
                            />
                          </Td>
                          <Td>
                            
                            <FaEdit
                              style={{
                                cursor: "pointer",
                                color: "green",
                                fontSize: "1.2em",
                                marginLeft: "40px",
                                marginBotton: "10px" 
                              }}
                              onClick={() => handleEdit(item)}
                            />
                            <FaTrash
                              style={{
                                cursor: "pointer",
                                color: "red",
                                fontSize: "1.2em",
                                marginLeft: "40px",
                                marginTop: "10px" 
                              }}
                              onClick={() => openDeleteDialog(item)}
                            />
                            
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Flex>
    )}



      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmación
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Seguro que quiere eliminar el item?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleDelete(itemToDelete.id);
                  closeDeleteDialog();
                }}
                ml={3}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Render condicional, solo se llama a EditProduct si la variable productToEdit es valida */}
      {productToEdit !== null && (
        <NewProduct
          token={token}
          productToEdit={productToEdit}
          onClose={() => {
            setProductToEdit(null);
            setShowAddProduct(false);
            setShowProdList(false);
          }}
          getProducts={getProducts}
          getCategoriesAll={getCategoriesAll}
          categoryListAll={categoryListAll}
          getFeaturesAll={getFeaturesAll}
          featuresListAll={featuresListAll}
          setShowAddProduct={setShowAddProduct}
          setShowProdList={setShowProdList}
        />
      )}
    </>
  );
};

export default ListAdminProduct;
