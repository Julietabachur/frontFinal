import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Img, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Flex, Text, Button, HStack } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import NewProduct from "./NewProduct";
import * as XLSX from "xlsx"; // Importa la librería para trabajar con Excel

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
  setShowProdList,
}) => {
  console.log("COMIENZA LISTADMIN");
  console.log(page);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [closeList, setCloseList] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const cancelRef = useRef();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    getProducts();
  }, [page]);

  const openDeleteDialog = (item) => {
    setIsDeleteDialogOpen(true);
    setItemToDelete(item);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/v1/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getProducts();
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  const handleEdit = (product) => {
    setCloseList(true);
    setProductToEdit(product);
  };

  // Función para descargar los productos en un archivo Excel
  const handleDownloadReport = () => {
    // Crea una hoja de trabajo con los datos de los productos
    const worksheet = XLSX.utils.json_to_sheet(lista.map(product => ({
      ID: product.productId,
      Nombre: product.productName,
      Categoría: product.category,
      Stock: product.stock,
    })));

    // Crea un libro de trabajo y añade la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Productos");

    // Exporta el archivo Excel
    XLSX.writeFile(workbook, "reporte_productos.xlsx");
  };

  return (
    <>
      {closeList === false && (
        <Flex justify={"center"}>
          <Box mt={10}>
            {/* Botón para descargar el reporte (ubicado arriba de la tabla) */}
            <Button
              border={"1px solid #e1bc6a"}
              _focus={{
                borderColor: "#e1bc6a",
                backgroundColor: "#e1bc6a",
              }}
              onClick={handleDownloadReport}
              colorScheme="yellow"
              variant="outline"
              _hover={{
                backgroundColor: "#e1bc6a",
                color: "white",
              }}
            >
              Descargar Stock
            </Button>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "10px" }}>
              <Button
                border={"1px solid #e1bc6a"}
                _focus={{ borderColor: "#e1bc6a", backgroungColor: "#e1bc6a" }}
                onClick={() => handlePageChange(page > 1 ? page - 1 : page)}
                disabled={page === 0}
              >
                &lt;&lt;
              </Button>
              <Text>- {page} -</Text>
              <Button
                border={"1px solid #e1bc6a"}
                _focus={{ borderColor: "#e1bc6a", backgroungColor: "#e1bc6a" }}
                onClick={() => handlePageChange(page + 1)}
              >
                &gt;&gt;
              </Button>
            </div>

            <Box w={830} mt={3}>
              <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)">
                <Thead>
                  <Tr>
                    <Th><Text fontWeight="bold">ID</Text></Th>
                    <Th><Text fontWeight="bold">Nombre</Text></Th>
                    <Th><Text fontWeight="bold">Categoría</Text></Th>
                    <Th><Text fontWeight="bold">Imagen</Text></Th>
                    <Th><Text fontWeight="bold">Stock Total</Text></Th>
                    <Th><Text fontWeight="bold" style={{ marginBottom: "8px" }}>Editar / Eliminar</Text></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lista && lista.map((item) => (
                    <Tr key={item.id} h="10px">
                      <Td>{item.productId}</Td>
                      <Td>{item.productName}</Td>
                      <Td>{item.category}</Td>
                      <Td><Img src={item.thumbnail} alt={item.productName} w={50} h={50} /></Td>
                      <Td>{item.stock}</Td>
                      <Td>
                        <FaEdit style={{ cursor: "pointer", color: "black", fontSize: "1.2em", marginLeft: "40px", marginBottom: "10px" }} onClick={() => handleEdit(item)} />
                        <FaTrash style={{ cursor: "pointer", color: "black", fontSize: "1.2em", marginLeft: "40px", marginTop: "10px" }} onClick={() => openDeleteDialog(item)} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Flex>
      )}

      <AlertDialog isOpen={isDeleteDialogOpen} leastDestructiveRef={cancelRef} onClose={closeDeleteDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Confirmación</AlertDialogHeader>
            <AlertDialogBody>¿Seguro que quiere eliminar este elemento?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>Cancelar</Button>
              <Button color="red" onClick={() => { handleDelete(itemToDelete.id); closeDeleteDialog(); }} ml={3}>Eliminar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

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
