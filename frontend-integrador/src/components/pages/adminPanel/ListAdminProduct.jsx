import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Img, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Flex, Text, Button } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import NewProduct from "./NewProduct";
import * as XLSX from "xlsx"; // Para exportar a Excel
import { jsPDF } from "jspdf"; // Para exportar a PDF
import "jspdf-autotable";
import { useProductContext } from "../home/Global.context";

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
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [closeList, setCloseList] = useState(false);
  const [allProductsLoaded, setAllProductsLoaded] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  const cancelRef = useRef();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    getProducts();
  }, [page]);

  useEffect(() => {
    getAllProducts()
    console.log('todos los productos: ', allProductsLoaded);

    
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/products/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        let data = response.data   
        const allProducts = data;
        setAllProductsLoaded(data)    
        console.log('cargados todos los productos: ', allProductsLoaded);
        

      }
    } catch (error) {
      console.error(error);
    }
  };

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

  // Exportar datos a Excel
  const handleDownloadExcelReport = () => {
   if (allProductsLoaded.length > 0 ) {
    const worksheet = XLSX.utils.json_to_sheet(
      allProductsLoaded.map((product) => ({
        ID: product.productId,
        Nombre: product.productName,
        Categoría: product.category,
        Stock: product.stock,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Productos");
    XLSX.writeFile(workbook, "reporte_productos.xlsx");
   }

  };

  // Exportar datos a PDF
  const handleDownloadPDFReport = () => {
    if (allProductsLoaded.length > 0 ) {
    const doc = new jsPDF();
    doc.text("Reporte de Productos", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [["ID", "Nombre", "Categoría", "Stock"]],
      body: allProductsLoaded.map((product) => [
        product.productId,
        product.productName,
        product.category,
        product.stock,
      ]),
    });

    doc.save("reporte_productos.pdf");
    }
  };

  return (
    <>
      {!closeList && (
        <Flex justify={"center"}>
          <Box mt={10}>
            {/* Botones para descargar reportes */}
            <Flex mb={4}>
              <Button
                isDisabled={allProductsLoaded.length == 0}
                mr={2}
                border={"1px solid"}      
                borderColor={'color'}    
                color={'color'}               
                onClick={handleDownloadExcelReport}
                variant="outline"
                _hover={{
                  backgroundColor: "color",
                  color: "white",
                }}
              >
                Descargar Excel
              </Button>
              <Button
                isDisabled={allProductsLoaded.length == 0}
                border={"1px solid"}
                borderColor={'color'}    
                color={'color'}            
                onClick={handleDownloadPDFReport}
                variant="outline"
                _hover={{
                  backgroundColor: "color",
                  color: "white",
                }}
              >
                Descargar PDF
              </Button>
            </Flex>

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
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Categoría</Th>
                    <Th>Imagen</Th>
                    <Th>Stock</Th>
                    <Th>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lista.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.productId}</Td>
                      <Td>{item.productName}</Td>
                      <Td>{item.category}</Td>
                      <Td>
                        <Img src={item.thumbnail} alt={item.productName} w={50} h={50} />
                      </Td>
                      <Td>{item.stock}</Td>
                      <Td>
                        <FaEdit
                          style={{ cursor: "pointer", color: "black", fontSize: "1.2em", marginLeft: "10px" }}
                          onClick={() => handleEdit(item)}
                        />
                        <FaTrash
                          style={{ cursor: "pointer", color: "black", fontSize: "1.2em", marginLeft: "10px" }}
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

      <AlertDialog isOpen={isDeleteDialogOpen} leastDestructiveRef={cancelRef} onClose={closeDeleteDialog}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Confirmación</AlertDialogHeader>
            <AlertDialogBody>¿Seguro que quiere eliminar este elemento?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>Cancelar</Button>
              <Button
                color="red"
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

      {productToEdit && (
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
