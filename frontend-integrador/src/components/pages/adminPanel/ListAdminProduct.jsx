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
} from "@chakra-ui/react";
import NewProduct from "./NewProduct";
import { FaEdit, FaTrash } from "react-icons/fa";

const ListAdminProduct = ({ getProducts, page, handlePageChange, lista, token, getCategoriesAll, categoriesListAll, setShowList, showAddProduct, setShowAddProduct, prodId, setProdId }) => {
  console.log("COMIENZA LISTADMIN");
  console.log(page);
  const baseUrl = import.meta.env.VITE_SERVER_URL;
  //const [isModalOpen, setIsModalOpen] = useState(false);
  //const [productToEdit, setProductToEdit] = useState(null);



  // constantes del Alert Box
  const cancelRef = useRef(); // permite cancelar en el box de alerta
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // controla estado del AlertBox
  const [itemToDelete, setItemToDelete] = useState(null); // pasa la variable del item a eliminar


  useEffect(() => {
    getProducts();
  }, [page]); // Agrega 'page' como dependencia para que se actualice cuando cambie el número de página

  useEffect(() => {
    getCategoriesAll();
  }, []);

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

      console.log(lista);
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  const handleEdit = (product) => {
    setShowList(false); // cierra el listado de productos
    setShowAddProduct(true)// abre el product form.
    setProdId(product.id); // pasa el id product a traves del prop
    console.log("Producto para editar:", product.id);

  };

  return (
    <>
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
          <Button colorScheme="green" onClick={() => handlePageChange(page + 1)}>
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

              <Th >
                <Text fontWeight="bold" style={{ marginBottom: "8px" }}>
                  Editar / Eliminar
                </Text>
              </Th >
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
                        marginBottom: "10px"
                      }}
                      onClick={() => handleEdit(item)}
                    />
                  
                    <FaTrash
                      style={{
                        cursor: "pointer",
                        color: "red",
                        fontSize: "1.2em",
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

     
      {showAddProduct && (
        <NewProduct
          token={token}
          prodId={prodId}
        />

      )}


    </>
  );
};

export default ListAdminProduct;
