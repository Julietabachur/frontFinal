import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Img, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Flex, Text, Button, HStack } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import NewSale from "./NewSale"; // Componente para agregar o editar una venta
import * as XLSX from "xlsx"; // Para exportar datos a Excel
import DatePicker from "react-datepicker"; // Importamos el DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Importamos el estilo de DatePicker

const ListAdminSales = ({
  getSales,
  page,
  handlePageChange,
  salesList,
  token,
  getProductsAll,
  productListAll,
  getCustomersAll,
  customerListAll,
  showAddSale,
  setShowAddSale,
  setShowSalesList,
}) => {
  console.log("COMIENZA LISTA DE VENTAS");
  console.log(page);
  const baseUrl = import.meta.env.VITE_SERVER_URL;

  const [closeList, setCloseList] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [filteredSales, setFilteredSales] = useState(salesList);
  const [startDate, setStartDate] = useState(null); // Fecha de inicio
  const [endDate, setEndDate] = useState(null); // Fecha de fin

  const cancelRef = useRef();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    getSales();
  }, [page]);

  useEffect(() => {
    // Filtra las ventas por las fechas seleccionadas
    if (startDate && endDate) {
      const filtered = salesList.filter(sale => {
        const saleDate = new Date(sale.saleDate);
        return saleDate >= startDate && saleDate <= endDate;
      });
      setFilteredSales(filtered);
    } else {
      setFilteredSales(salesList);
    }
  }, [startDate, endDate, salesList]);

  const openDeleteDialog = (item) => {
    setIsDeleteDialogOpen(true);
    setItemToDelete(item);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/api/v1/admin/sales/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getSales(); // Vuelve a cargar las ventas
    } catch (error) {
      console.error("Error al eliminar la venta", error);
    }
  };

  const handleEdit = (sale) => {
    setCloseList(true);
    setSaleToEdit(sale);
  };

  // Función para descargar el reporte de ventas en un archivo Excel
  const handleDownloadReport = () => {
    // Crea una hoja de trabajo con los datos de las ventas
    const worksheet = XLSX.utils.json_to_sheet(filteredSales.map(sale => ({
      ID: sale.saleId,
      Producto: sale.productName,
      Cliente: sale.customerName,
      Fecha: sale.saleDate,
      Cantidad: sale.quantity,
      Precio: sale.price,
      Total: sale.totalAmount,
    })));

    // Crea un libro de trabajo y añade la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de Ventas");

    // Exporta el archivo Excel
    XLSX.writeFile(workbook, "reporte_ventas.xlsx");
  };

  return (
    <>
      {closeList === false && (
        <Flex justify={"center"}>
          <Box mt={10}>
            {/* Filtro por fecha */}
            <HStack spacing={4} mb={4}>
              <Text>Filtrar por fecha:</Text>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Fecha de inicio"
                dateFormat="dd/MM/yyyy"
                className="react-datepicker__input"
              />
              <Text>-</Text>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Fecha de fin"
                dateFormat="dd/MM/yyyy"
                className="react-datepicker__input"
              />
            </HStack>

            {/* Paginación */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <Button
                border={"1px solid #e1bc6a"}
                _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
                onClick={() => handlePageChange(page > 1 ? page - 1 : page)}
                disabled={page === 0}
              >
                &lt;&lt;
              </Button>
              <Text>- {page} -</Text>
              <Button
                border={"1px solid #e1bc6a"}
                _focus={{ borderColor: "#e1bc6a", backgroundColor: "#e1bc6a" }}
                onClick={() => handlePageChange(page + 1)}
              >
                &gt;&gt;
              </Button>
            </div>

            {/* Botón para descargar el reporte */}
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
              Descargar Reporte
            </Button>

            <Box w={830} mt={3}>
              <Table variant="striped" backgroundColor="rgba(225, 188, 106, 0.5)">
                <Thead>
                  <Tr>
                    <Th><Text fontWeight="bold">ID</Text></Th>
                    <Th><Text fontWeight="bold">Producto</Text></Th>
                    <Th><Text fontWeight="bold">Cliente</Text></Th>
                    <Th><Text fontWeight="bold">Fecha</Text></Th>
                    <Th><Text fontWeight="bold">Cantidad</Text></Th>
                    <Th><Text fontWeight="bold">Precio</Text></Th>
                    <Th><Text fontWeight="bold">Total</Text></Th>
                    <Th><Text fontWeight="bold" style={{ marginBottom: "8px" }}>Editar / Eliminar</Text></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSales && filteredSales.map((sale) => (
                    <Tr key={sale.saleId}>
                      <Td>{sale.saleId}</Td>
                      <Td>{sale.productName}</Td>
                      <Td>{sale.customerName}</Td>
                      <Td>{sale.saleDate}</Td>
                      <Td>{sale.quantity}</Td>
                      <Td>{sale.price}</Td>
                      <Td>{sale.totalAmount}</Td>
                      <Td>
                        <FaEdit
                          style={{ cursor: "pointer", color: "black", fontSize: "1.2em", marginLeft: "40px", marginBottom: "10px" }}
                          onClick={() => handleEdit(sale)}
                        />
                        <FaTrash
                          style={{ cursor: "pointer", color: "black", fontSize: "1.2em", marginLeft: "40px", marginTop: "10px" }}
                          onClick={() => openDeleteDialog(sale)}
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

      
    </>
  );
};

export default ListAdminSales;
